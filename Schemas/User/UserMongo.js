// First Define Mongoose Schema for MongoDB
const mongo = require('mongoose');
require('mongoose-type-url');

const Schema = mongo.Schema;

const userSchema = new Schema(
    {
        id: { type: String, required: true },
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        phno: { type: String, required: true, unique: true },
        email: { type: String, required: false, unique: true },
        dob: { type: Date, required: true },
        verified: { type: Boolean, required: true },
    },
    {
        collection: 'users'
    }
);

const User = mongo.model('User', userSchema);

exports.User = User;


