// First import the Mongo model so we can work with the database:
const { Profile } = require('./ProfileMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql } = require('apollo-server-express');

const profileTypeDef = gql`
    extend type Query {
        profile(id: Int!): Profile
        profiles: [Profile]
    }

    input ProfileInput {
        fname: String!,
        lname: String!,
        dob: Date!,
        occupation: String!,
        bio: String!,
        # location: Location!,
        gender: String!,
        images: [String!]!
    }

    extend type Mutation {
        addProfile(input: ProfileInput): Profile
        editProfile(id: Int!): Profile
    }

    enum Gender {
        Male,
        Female,
        Other
    }

    type Profile {
        id: ID!,
        fname: String!,
        lname: String!,
        dob: Date!,
        occupation: String!,
        bio: String!,
        # location: Location!,
        gender: Gender!,
    }
`

const profileResolvers = {
    Query: {
        profile: (parent, args) => {
            return Profile.findById(args.id)
        },
        profiles: (parent, args) => {
            return Profile.find({});
        }
    },
    Mutation: {
        addProfile: (parent, args) => {
            return Profile.create({...args.input});
        },
        editProfile: (parent, args) => {
            return Profile.update({ id: args.id }, { ...args.input });
        }
    }
}

exports.profileTypeDef = profileTypeDef;
exports.profileResolvers = profileResolvers;
