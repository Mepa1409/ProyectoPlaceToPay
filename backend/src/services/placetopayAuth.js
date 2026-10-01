require('dotenv').config();


const crypto = require('crypto');

function generateAuth() {
    const login = process.env.PLACETOPAY_LOGIN;
    const secretKey = process.env.PLACETOPAY_SECRET_KEY;

    const seed = new Date().toISOString();
    const rawNonce = crypto.randomBytes(16).toString('hex');

    const tranKey = crypto
        .createHash('sha256')
        .update(rawNonce + seed + secretKey)
        .digest('base64');

    const nonce = Buffer
        .from(rawNonce)
        .toString('base64');

    return {
        login,
        tranKey,
        nonce,
        seed
    };
}

module.exports = {
    generateAuth
};