require('dotenv').config();
const express = require('express');
const { gql, ApolloServer } = require('apollo-server-express');
const http = require('http');
const https = require('https');

// Configure API Server
const HTTP_PORT = process.env.PORT || 80;
const SSL_PORT = process.env.SSL_PORT || 443;
const app = express();

// Setup Data Store Access
// const MongoClient = require('./Clients/MongoClient.js');
// const RedisClient = require('./Clients/RedisClient.js');

// Setup GRAPHQL Server
const { typeDefs, resolvers } = require('./Schemas/GraphQLSchema');
const AuthContext = require('./Contexts/GraphQLAuthContext');

const apolloServer = new ApolloServer(
  {
    typeDefs,
    resolvers,
    context: (args) => {
      return {
        // ...AuthContext(args),
      }
    }
  }
);
apolloServer.applyMiddleware({ app });

app.get('/', (req, res) => {
  res.send('HotMinuteAPI v0.0.1');
})

const serverHTTPS = https.createServer(app).listen({ port: SSL_PORT }, () =>
  console.log(`🚀 GraphQL Server ready at http://localhost:${SSL_PORT}${apolloServer.graphqlPath}`)
);

const serverHTTP = http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`🚀 GraphQL Server ready at http://localhost:${HTTP_PORT}${apolloServer.graphqlPath}`);
});

// Setup WebSocket Server
const WebSocketServer = require('websocket').server;
const admin = require('./Clients/FirebaseClient');
const AgoraClient = require('./Clients/AgoraClient');

let usersNeedingMatches = [];
let activeUsers = [];

const io = new WebSocketServer({
  httpServer: serverHTTP,
})

const clients = {};

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

io.on('request', request => {
  var userId = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  const connection = request.accept(null, request.origin);
  clients[userId] = connection;
  connection.on('message', message => {
    var message = JSON.parse(message.utf8Data);
    switch(message.type){
      case 'debug': {
        console.log(message.body);
        connection.send(JSON.stringify({
          type: 'debug',
          body: 'Success'
        }));
      }
    }
  })

  connection.on('close', connection => {
    console.log((new Date()) + " Peer " + userId + " disconnected.");
    delete clients[userID];
  })
  console.log('connected: ' + userId + ' in ' + Object.getOwnPropertyNames(clients))
})

// add authentication to socket
// matchmaker.use((socket, next) => {
//   let idToken = socket.handshake.query.token;
//   // BYPASS AUTHENTICATION TODO: REMOVE THIS LINE
//   return next();
//   admin.auth().verifyIdToken(idToken)
//     .then(function (decodedToken) {
//       let uid = decodedToken.uid;
//       activeUsers.push({uid, socketId: socket.id});
//       return next();
//     }).catch(function (error) {
//       return next(Error('authentication error'));
//     });
// });