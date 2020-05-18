// First import the Mongo model so we can work with the database:
const { User } = require('./UserMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql } = require('apollo-server-express');

const userTypeDef = gql`
    extend type Query {
        user(id: ID!): User
    }

    type User {
        id: ID!,
        fname: String!,
        lname: String!,
        phno: String!,
        email: String,
        dob: Date!,
    }
`

const userResolvers = {
    Query: {
        user: (parent, args) =>{
            return User.findById(args.id)
        }
    },
}

exports.userTypeDef = userTypeDef;
exports.userResolvers = userResolvers;