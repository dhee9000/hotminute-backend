
const mongo = require('mongoose');
const Schema = mongo.Schema;

const pairSchema = new Schema({
    pairedOn: Date,
    userIds: [{userId: { type: Number, required: true, }}],
});

module.exports = mongo.model('Pair', pairSchema);