import { gql } from 'apollo-server-express';

const mongo = require('mongoose');
const Schema = mongo.Schema;

const userSchema = new Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        phno: { type: String, required: true, unique: true },
        email: { type: String, required: false, unique: true },
        dob: { type: Date, required: true },
    },
    {
        collection: 'users'
    }
);

export const User = mongo.model('User', userSchema);

export const userTypeDef = gql`
    extend type Query {
        user(id: Int!): Book
    }

    type User {
        fname: String!,
        lname: String!,
        phno: String!,
        email: String,
        dob: Date!,
    }
`

export const userResolvers = {
    Query: {
        user: (parent, args) =>{
            return User.findById(args.id)
        }
    },
}
