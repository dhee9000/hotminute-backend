const { gql } = require('apollo-server-express');

const mongo = require('mongoose');
require('mongoose-type-url');
const Schema = mongo.Schema;

const Location = new Schema(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    }
)

const profileSchema = new Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        dob: { type: Date, required: true },
        occupation: { type: String, required: true },
        bio: { type: String, required: true },
        // location: { type: Location, required: true }, //TODO: Add Location type to Schema
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        images: { type: [ {type: mongo.SchemaTypes.Url, required: true, } ], required: true }
    },
    {
        collection: 'profiles'
    }
);

const Profile = mongo.model('Profile', profileSchema);

exports.Profile = Profile;

exports.profileTypeDef = gql`
    extend type Query {
        profile(id: Int!): Profile
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

exports.profileResolvers = {
    Query: {
        profile: (parent, args) =>{
            return Profile.findById(args.id)
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
