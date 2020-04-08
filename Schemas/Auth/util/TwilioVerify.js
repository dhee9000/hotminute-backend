const accountSid = process.env.TWILIO_LIVE_SID;
const authToken = process.env.TWILIO_LIVE_KEY;
const serviceId = process.env.VERIFY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

function sendVerificationCode(phno){
    return new Promise((resolve, reject) => {
        client.verify.services(serviceId)
            .verifications
            .create({to: phno, channel: 'sms'})
            .then(verification_check => resolve(verification_check))
            .catch(error => reject(error));
    })
}

function verifyPhoneNumberWithCode(phno, code){
    return new Promise((resolve, reject) => {
        client.verify.services(serviceId)
            .verificationChecks
            .create({to: phno, code})
            .then(verification_check => resolve(verification_check))
            .catch(error => reject(error));
    })
}

exports.sendVerificationCode = sendVerificationCode;
exports.verifyPhoneNumberWithCode = verifyPhoneNumberWithCode;