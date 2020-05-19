const { typeDefs, resolvers } = require('./GraphQLBaseSchema');
const { authTypeDef, authResolvers } = require('./Auth/AuthGraphQL');
const { profileTypeDef, profileResolvers } = require('./Profile/ProfileGraphQL');
const { userTypeDef, userResolvers } = require('./User/UserGraphQL');
const { chatTypeDef, chatResolvers } = require('./Chat/ChatGraphQL');


exports.typeDefs = [ 
    typeDefs, 
    userTypeDef, 
    profileTypeDef, 
    chatTypeDef
];

exports.resolvers = [ 
    resolvers, 
    userResolvers, 
    profileResolvers, 
    chatResolvers 
];