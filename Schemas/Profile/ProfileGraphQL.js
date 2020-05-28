// First import the Mongo model so we can work with the database:
const { Profile } = require('./ProfileMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql, AuthenticationError } = require('apollo-server-express');

const profileTypeDef = gql`
    extend type Query {
        profile(id: String!): Profile
        profiles: [Profile]
    }

    input ProfileImage {
        order: Int!,
        image: Upload!,
    }

    input ProfileInput {
        fname: String!,
        lname: String!,
        dob: Date!,
        occupation: String!,
        bio: String!,
        # location: Location!,
        gender: Gender!,
        images: [ProfileImage!]
    }

    extend type Mutation {
        createProfile(input: ProfileInput!): Boolean
        editProfile(id: ProfileInput): Boolean
    }

    enum Gender {
        Male,
        Female,
        Other
    }

    type Profile {
        id: String!,
        uid: String!
        fname: String!,
        lname: String!,
        dob: Date!,
        occupation: String!,
        bio: String!,
        gender: Gender!,
    }
`

const profileResolvers = {
    Query: {
        profile: async (parent, args, context) => {
            if(!context.authorized) throw new AuthenticationError();
            console.log("Profile Retrieved", args.id);
            return Profile.findOne({uid: args.id});
        },
    },
    Mutation: {
        createProfile: async (parent, args, context) => {
            if(!context.authorized) throw new AuthenticationError();
            let existingProfile = await Profile.find({uid: context.uid});
            if(existingProfile.length > 0) return false;
            await Profile.create({
                uid: context.uid,
                ...args.input,
            });
            return true;
        },
        editProfile: async (parent, args, context) => {
            if(!context.authorized) throw new AuthenticationError();
            await Profile.update({ uid: context.uid }, { 
                ...args.input
            });
            return true;
        }
    }
}

exports.profileTypeDef = profileTypeDef;
exports.profileResolvers = profileResolvers;
