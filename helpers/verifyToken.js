const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

/**
 * Check if token is valid and of correct type
 * @param {string} token JWT token
 * @param {string} type Type of token to check for
 * @returns {object} Decoded payload of JWT token
 */
function verifyToken(token, type) {
  // jwt.verify() throws an error if token is not valid
  const decoded = jwt.verify(token, secret);

  if (type && decoded.type !== type)
    throw Error(`wrong token type. ${type} token required`);

  return decoded;
}

module.exports = verifyToken;
