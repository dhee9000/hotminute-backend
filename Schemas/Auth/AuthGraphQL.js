// First import the required functions
const { sendVerificationCode, verifyPhoneNumberWithCode } = require('./util/TwilioVerify');

// Then Define GraphQL Schema for GQL using the Mongoose fields above
const { gql } = require('apollo-server-express');

const authTypeDef = gql`

    input VerifyInput {
        countryCode: Int!
        phoneNumber: String!
        verificationCode: Int
    }
    
    type VerifyResponse {
        verified: Boolean!
    }

    extend type Mutation {
        sendVerificationCode(input: VerifyInput!): VerifyResponse!
        verifyPhoneNumber(input: VerifyInput!): VerifyResponse!
    }
`

const authResolvers = {
    Query: {

    },
    Mutation: {
        sendVerificationCode: (parent, args) => {
            console.log(`Verification Code Requested for ${args.input.phoneNumber} `)
            return sendVerificationCode(args.input.phoneNumber)
            .then(result => ({
                verified: false,
            }));
        },
        verifyPhoneNumber: (parent, args) => {
            return verifyPhoneNumberWithCode(args.input.phoneNumber, args.input.verificationCode).then(result => ({
                verified: result.status === 'approved'
            }));
        }
    }
}

exports.authTypeDef = authTypeDef;
exports.authResolvers = authResolvers;
