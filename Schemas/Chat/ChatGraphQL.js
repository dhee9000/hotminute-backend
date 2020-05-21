// First import the Mongo model so we can work with the database:
const { Chat } = require('./ChatMongo');
const { User } = require('../User/UserMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql } = require('apollo-server-express');

const CHAT_SENT = 'CHAT_SEND';

const chatTypeDef = gql`
    extend type Query {
        chat(id: String!): Chat
    }

    extend type Mutation {
        sendChat(input: ChatInput): Chat
    }

    extend type Subscription {
        chatSent(chatId: String): Chat
    }

    input ChatInput {
        chat: String!,
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

    type Chat {
        id: ID!,
        timestamp: Date!,
        from: User!,
        chat: String!,
        body: String!,
        properties: [Property!],
        attachments: [Attachment!]
    }
`

const chatResolvers = {
    Query: {
        chat: async (parent, args) => {
            let chatDoc = await Chat.findById(args.id);
            chatDoc = chatDoc.toObject();
            let userDoc = await User.findById(chatDoc.from);
            chatDoc.from = userDoc.toObject();
            chatDoc.id = chatDoc._id;
            return chatDoc;
        }
    },
    Mutation: {
        sendChat: async (parent, args, context) => {
            if(!context.authorized) throw new Error("Unauthorized");
            let chatDoc = await Chat.create({
                timestamp: new Date(),
                from: '5ec32bd6aa1cc07bbc488568',
                chat: 'testChatId',
                body: 'Test Message',
            });
            chatDoc = chatDoc.toObject();
            let userDoc = await User.findById(chatDoc.from);
            chatDoc.from = userDoc.toObject();
            chatDoc.id = chatDoc._id;
            context.pubsub.publish(CHAT_SENT, { chatSent: chatDoc });
            return chatDoc;
        }
    },
    Subscription: {
        chatSent: {
            subscribe: (parent, args, context) => context.pubsub.asyncIterator([CHAT_SENT])
        }
    }
}

exports.chatTypeDef = chatTypeDef;
exports.chatResolvers = chatResolvers;