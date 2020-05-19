const { gql } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const typeDefs = gql`
    scalar Date
    scalar Location

    type Query{
        _empty: String,
    }

    type Mutation {
        _empty: String,
    }
    
    type Subscription {
        _empty: String
    }
`

const resolvers = {
  Query: {
    _empty: (parent, args, context) => {
      return("helloworld");
    },
  },
  Mutation: {
    _empty: (parent, args, context) => {
      context.pubsub.publish('EMPTY', "helloworld");
      return("helloworld");
    },
  },
  Subscription: {
    _empty: {
      subscribe: (parent, args, context) => context.pubsub.asyncIterator(['EMPTY'])
    },
  },
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

exports.typeDefs = typeDefs;
exports.resolvers = resolvers;