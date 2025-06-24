const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken };
  };

  const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  };

module.exports = {
    generateTokens,
    verifyRefreshToken
};