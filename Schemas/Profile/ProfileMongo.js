// First Define Mongoose Schema for MongoDB
const mongo = require('mongoose');
require('mongoose-type-url');

const Schema = mongo.Schema;

const Location = new Schema(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    }
)

const profileSchema = new Schema(
    {
        uid: { type: String, required: true},
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        dob: { type: Date, required: true },
        occupation: { type: String, required: true },
        bio: { type: String, required: true },
        // location: { type: Location, required: true }, //TODO: Add Location type to Schema
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        images: { type: [ {type: mongo.SchemaTypes.Url, required: true, } ], required: false }
    },
    {
        collection: 'profiles'
    }
);

const Profile = mongo.model('Profile', profileSchema);

exports.Profile = Profile;