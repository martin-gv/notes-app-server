const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

const ACCESS_EXPIRY = "5m";
const REFRESH_EXPIRY = "12h";

/**
 * Generates new JWT token
 * @param {Object} data Data to encode in the token
 * @param {string} type The type of token to generate
 * @returns {string} Encoded JWT token
 */
function createToken(data, type) {
  const payload = { ...data, type };
  const token = jwt.sign(payload, secret, { expiresIn: getExpiry(type) });
  return token;
}

/**
 * Gets expiry value for token based on saved constants
 * @param {string} type The type of token
 * @returns {string} The expiry value as a string describing a time span (zeit/ms)
 */
function getExpiry(type) {
  if (type === "access") return ACCESS_EXPIRY;
  if (type === "refresh") return REFRESH_EXPIRY;
}

module.exports = createToken;
