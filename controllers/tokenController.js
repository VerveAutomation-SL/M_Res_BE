const {generateTokens, verifyRefreshToken} = require("../services/tokenService");

const refreshTokenController = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
    const decoded = verifyRefreshToken(refreshToken);
    const userData = {userId: decoded.UserId, role: decoded.role, username: decoded.username, email: decoded.email}
    const tokens = generateTokens(userData);

    return res.json({ success: true, ...tokens });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

module.exports = {
    refreshTokenController
};