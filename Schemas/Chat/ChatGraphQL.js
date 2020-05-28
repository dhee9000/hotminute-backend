// First import the Mongo model so we can work with the database:
const { Chat: Message } = require('./ChatMongo');
const { Profile } = require('../Profile/ProfileMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql, AuthenticationError } = require('apollo-server-express');

const MESSAGE_SENT = 'MESSAGE_SENT';

const messageTypeDef = gql`
    extend type Query {
        message(id: String!): Message
        messagesInChat(id: String!): [Message]!
    }

    extend type Mutation {
        sendMessage(input: MessageInput): Boolean
    }

    extend type Subscription {
        messageSent(chatId: String): Message
    }

    input MessageInput {
        chatId: String!,
        body: String!,
        properties: [PropertyInput!],
        attachments: [AttachmentInput!]
    }

    type Property {
        key: String!,
        value: String!,
    }

    input PropertyInput {
        key: String!,
        value: String!,
    }

    type Attachment {
        type: String!,
        source: String!,
        properties: [Property!]
    }

    input AttachmentInput {
        type: String!,
        source: String!,
        properties: [PropertyInput!],
    }

    type Message {
        id: String!,
        timestamp: Date!,
        from: Profile!,
        chatId: String!,
        body: String!,
        properties: [Property!],
        attachments: [Attachment!]
    }
`

const messageResolvers = {
    Query: {
        message: async (parent, args) => {
            let messageDoc = await Message.findById(args.id);
            messageDoc = messageDoc.toObject();
            let profileDoc = await Profile.findOne({uid: messageDoc.fromId});
            messageDoc.from = profileDoc.toObject();
            messageDoc.id = messageDoc._id;
            return messageDoc;
        },
        messagesInChat: async (parent, args, context) => {
            let messagesQuery = await Message.find({chatId: args.id}).sort({timestamp: -1});
            let messagesDocs = messagesQuery.map(async (doc) => {
                doc = doc.toObject();
                let profileDoc = await Profile.findOne({uid: doc.fromId});
                doc.from = profileDoc.toObject();
                doc.id = doc._id;
                return doc;
            });
            return messagesDocs;
        }
    },
    Mutation: {
        sendMessage: async (parent, args, context) => {
            if(!context.authorized) throw new AuthenticationError();
            let messageDoc = await Message.create({
                timestamp: new Date(),
                fromId: context.uid,
                chatId: args.input.chatId,
                body: args.input.body,
                attachments: args.input.attachments,
                properties: args.input.properties,
            });
            messageDoc = messageDoc.toObject();
            let profileDoc = await Profile.findOne({uid: messageDoc.fromId});
            messageDoc.from = profileDoc.toObject();
            messageDoc.id = messageDoc._id;
            context.pubsub.publish(`${MESSAGE_SENT}_${args.input.chatId}`, { messageSent: messageDoc });
            return true;
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (parent, args, context) => context.pubsub.asyncIterator([`${MESSAGE_SENT}_${args.chatId}`])
        }
    }
}

exports.messageTypeDef = messageTypeDef;
exports.messageResolvers = messageResolvers;