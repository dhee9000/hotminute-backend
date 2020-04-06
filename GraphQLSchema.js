const { typeDefs, resolvers } = require('./Schemas/GraphQLBaseSchema');
const { authTypeDef, authResolvers } = require('./Auth/AuthGraphQL');
const { profileTypeDef, profileResolvers } = require('./Schemas/Profile/ProfileGraphQL');
const { userTypeDef, userResolvers } = require('./Schemas/User/UserGraphQL');


exports.typeDefs = [ typeDefs, authTypeDef, userTypeDef, profileTypeDef ];
exports.resolvers = [ resolvers, authResolvers, userResolvers, profileResolvers ];