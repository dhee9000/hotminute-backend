const { typeDefs, resolvers } = require('./Schemas/GraphQLBaseSchema');
const { profileTypeDef, profileResolvers } = require('./Schemas/Profile/ProfileGraphQL');
const { userTypeDef, userResolvers } = require('./Schemas/User/UserGraphQL');


exports.typeDefs = [ typeDefs, userTypeDef, profileTypeDef ];
exports.resolvers = [ resolvers, userResolvers, profileResolvers ];