const accountSid = process.env.TWILIO_LIVE_SID;
const authToken = process.env.TWILIO_LIVE_KEY;
const serviceId = process.env.VERIFY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

function sendVerificationCode(num){
    client.verify.services(serviceId)
                .verifications
                .create({to: '+17038263618', channel: 'sms'})
                .then(verification => console.log(verification.status))
                .catch(error => console.error("TwilioError:", error));
}

function verifyPhoneNumberWithCode(num, code){
    client.verify.services(serviceId)
        .verificationChecks
        .create({to: '+15017122661', code: '123456'})
        .then(verification_check => console.log(verification_check.status))
        .catch(error => console.error("TwilioError:", error));
}

exports.sendVerificationCode = sendVerificationCode;