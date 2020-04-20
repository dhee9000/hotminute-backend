const { typeDefs, resolvers } = require('./GraphQLBaseSchema');
const { authTypeDef, authResolvers } = require('./Auth/AuthGraphQL');
const { profileTypeDef, profileResolvers } = require('./Profile/ProfileGraphQL');
const { userTypeDef, userResolvers } = require('./User/UserGraphQL');


exports.typeDefs = [ typeDefs, authTypeDef, userTypeDef, profileTypeDef ];
exports.resolvers = [ resolvers, authResolvers, userResolvers, profileResolvers ];