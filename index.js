require('dotenv').config();
const express = require('express');
const { gql, ApolloServer} = require('apollo-server-express');
const mongo = require('mongoose');
const redis = require("redis");

const PORT = 4000;
const app = express();

const mongoURI = process.env.MONGO_URI;

mongo.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e => {
    console.error("❌ MongoDB Connection Error:", e)
});

mongo.set('useCreateIndex', true);
mongo.connection.once('open', () => {
    console.log('💾 Connected to MongoDB database');
});

const redisOptions = {host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD};
if(!process.env.REDIS_PASSWORD) delete redisOptions.password;
const client = redis.createClient(redisOptions);
client.on('connect', () => {
    console.log('💿 Connected to Redis application store');
})
client.on('error', (e) => {
    console.error("❌ Redis Connection Error:", e);
});

// Setup GRAPHQL Server

const { typeDefs, resolvers } = require('./GraphQLSchema');
const AuthContext = require('./Contexts/GraphQLAuthContext');

const server = new ApolloServer(
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
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);