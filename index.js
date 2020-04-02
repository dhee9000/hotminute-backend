const express = require('express');
const { gql, ApolloServer} = require('apollo-server-express');
const mongo = require('mongoose');
const redis = require("redis");

const PORT = 4000;

const app = express();

const mongoUri = "mongodb+srv://dheeraj:piArchimedes%23123@cluster0-6buo6.mongodb.net/hotminute?retryWrites=true&w=majority";

mongo.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e => {
    console.error("❌ MongoDB Connection Error:", e)
});

mongo.connection.once('open', () => {
    console.log('💾 Connected to MongoDB database');
});

const client = redis.createClient();
client.on('connect', () => {
    console.log('💿 Connected to Redis application store');
})
client.on('error', (e) => {
    console.error("❌ Redis Connection Error:", e);
});

// Setup GRAPHQL Server

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const { profileTypeDef, profileResolvers } = require('./Schemas/Profile');

const typeDefs = gql`
    scalar Date
    scalar Location

    type Query{
        _empty: String,
    }

    type Mutation {
        _empty: String,
    }
`

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  Location: new GraphQLScalarType({
      name: 'Location',
      description: 'Location custom scalar type',
      parseValue(value){
          return { latitude: value.latitude, longitude: value.longitude};
      },
      serialize(value) {
          return { latitude: value.latitude, longitude: value.longitude };
      },
      parseLiteral(ast) {
          //TODO: Implement this.
      }
  })
};

const server = new ApolloServer(
    {
        typeDefs: [typeDefs, profileTypeDef], 
        resolvers: [resolvers, profileResolvers] 
    }
);
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 GraphQL Server ready at http://localhost:4000${server.graphqlPath}`)
)