const { typeDefs, resolvers } = require('./GraphQLBaseSchema');
const { profileTypeDef, profileResolvers } = require('./Profile/ProfileGraphQL');
const { userTypeDef, userResolvers } = require('./User/UserGraphQL');
const { messageTypeDef, messageResolvers } = require('./Chat/ChatGraphQL');


exports.typeDefs = [ 
    typeDefs, 
    userTypeDef, 
    profileTypeDef, 
    messageTypeDef
];

exports.resolvers = [ 
    resolvers, 
    userResolvers, 
    profileResolvers, 
    messageResolvers 
];