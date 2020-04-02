const graphql = require('graphql');

const User = require('../models/user');
const Pair = require('../models/pair');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const GraphQLDate = require('../utils/GraphQLScalars/Date.js');


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        phno: { type: GraphQLString },
        email: { type: GraphQLString },
        // dob: { type: GraphQLObjectType}
    })
});

const PairType = new GraphQLObjectType({
    name: 'Pair',
    fields: () => ({
        id: {
            type: GraphQLID
        },
    })
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        nextPairing: {
            type: PairType,
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                fname: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                lname: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                phno: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve(parent, args) {
                let user = new User({
                    ...args
                });
                return user.save();
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});