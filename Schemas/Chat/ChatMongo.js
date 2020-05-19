// First Define Mongoose Schema for MongoDB
const mongo = require('mongoose');
require('mongoose-type-url');

const Schema = mongo.Schema;

const chatSchema = new Schema(
    {
        timestamp: { type: Date, required: true },
        from: { type: String, required: true }, // ID of Sender
        chat: { type: String, required: true },
        body: { type: String, required: true },
        properties: [
            {key: String, value: String}
        ],
        attachments: [
            {
                type: { type: String, required: true },
                source: String,
                properties: [
                    {key: String, value: String}
                ]
            }
        ]
    },
    {
        collection: 'chats'
    }
);

const Chat = mongo.model('Chat', chatSchema);

exports.Chat = Chat;


