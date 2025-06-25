const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION || "15m";
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION || "1d";

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
  };

  const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  };

module.exports = {
    generateTokens,
    verifyRefreshToken
};