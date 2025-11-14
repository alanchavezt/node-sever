const crypto = require('crypto');

const createVerificationToken = (length = 48) => {
    // raw token for email
    const token = crypto.randomBytes(length).toString('hex'); // long random token
    // hashed for DB
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashed };
};

module.exports = { createVerificationToken };
