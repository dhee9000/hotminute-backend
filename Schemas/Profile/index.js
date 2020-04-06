const { Profile } = require('./ProfileMongo');
const { profileTypeDefs, profileResolvers } = require('./ProfileGraphQL');

exports.Profile = Profile;
exports.profileTypeDefs = profileTypeDefs;
exports.profileResolvers = profileResolvers;