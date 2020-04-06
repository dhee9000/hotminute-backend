const { User } = require('../Schemas/User/UserMongo.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Creates a new user on the database, sends verification code
 * @param {Number} phno - Sanitized phone number for the user
 * @param {String} fname - First name of the user
 * @param {String} lname - Last name of the user
 * @param {Date} dob - Date of birth of the user
 * @param {String} password - Password for the user
 */

const createNewAccount = (phno, fname, lname, dob, password) => {
    bcrypt(password, 10, (err, hash) => {
        User.create({
            phno,
            fname,
            lname,
            dob,
            password: hash,
            verified: false,
        });
    });
}

export default createNewAccount;