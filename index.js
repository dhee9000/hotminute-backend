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
const MongoClient = require('./Clients/MongoClient.js');
const RedisClient = require('./Clients/RedisClient.js');

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

// Setup SocketIO Server
const io = require('socket.io').listen(serverHTTP);
const admin = require('./Clients/FirebaseClient');
const AgoraClient = require('./Clients/AgoraClient');

const matchmaker = io.of('/matchmaker');

let usersNeedingMatches = [];
let activeUsers = [];

// add authentication to socket
matchmaker.use((socket, next) => {
  let idToken = socket.handshake.query.token;
  // BYPASS AUTHENTICATION TODO: REMOVE THIS LINE
  return next();
  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;
      activeUsers.push({uid, socketId: socket.id});
      return next();
    }).catch(function (error) {
      return next(Error('authentication error'));
    });
});

matchmaker.on('connect', socket => {

  // handle user joining the queue
  socket.on('joinqueue', requestingUser => {
    console.log(`Join queue request received from ${requestingUser.uid}`)
    socket.emit('debug', 'Success');
    socket.emit('joinqueue', 'success');
    if(usersNeedingMatches.find(e => e.uid == requestingUser.uid)){
      return;
    }
    if (usersNeedingMatches.length > 0) {
      let nextUser = usersNeedingMatches.pop();
      let requestingUserToken = AgoraClient.generateRTCToken(requestingUser.uid, `${requestingUser.uid}_${nextUser.uid}`)
      let nextUserToken = AgoraClient.generateRTCToken(nextUser.uid, `${requestingUser.uid}_${nextUser.uid}`)
      socket.emit('matchfound', {token: requestingUserToken, roomId: `${requestingUser.uid}_${nextUser.uid}`});
      socket.emit('debug', 'Match Found!');
      socket.to(nextUser.socketId).emit('matchfound', {token: nextUserToken});
      socket.to(nextUser.socketId).emit('debug', 'Match Found!');
      usersNeedingMatches = usersNeedingMatches.filter(e => e.uid != requestingUser.uid);
      usersNeedingMatches = usersNeedingMatches.filter(e => e.uid != nextUser.uid);
    }
    else {
      usersNeedingMatches.push({uid: requestingUser.uid, socketId: socket.id});
    }
  });

  socket.on('leavequeue', requestingUser => {
    console.log(`Leave queue request received from ${requestingUser.uid}`);
    socket.emit('debug', 'Success');
    usersNeedingMatches = usersNeedingMatches.filter(e => e.uid != requestingUser.uid);
    socket.emit('leavequeue', 'success');
  })

  socket.on('debug', string => {
    console.log(string);
    socket.emit('debug', "Success");
  });


  socket.on('disconnect', () => {

  })

});