// First import the Mongo model so we can work with the database:
const { Chat } = require('./ChatMongo');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql } = require('apollo-server-express');

const CHAT_SENT = 'CHAT_SEND';

const chatTypeDef = gql`
    extend type Query {
        chat(id: Int!): Chat
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
        chat: (parent, args) => {
            return Chat.findById(args.id)
        }
    },
    Mutation: {
        sendChat: (parent, args, context) => {
            return Chat.create({
                id: 'test',
                timestamp: new Date(),
                from: 'id',
                chat: 'id',
                body: 'message',
            }).then(doc => {
                context.pubsub.publish(CHAT_SENT, doc);
                return doc;
            });
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