const {generateTokens, verifyAccessToken} = require("../services/tokenService");

const getTokenController = (req, res) => {
    const { accesstoken } = req.body;

    if (!accesstoken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
    const decoded = verifyAccessToken(accesstoken);
    const userData = {userId: decoded.UserId, role: decoded.role, username: decoded.username, email: decoded.email}
    const tokens = generateTokens(userData);

    return res.json({ success: true, ...tokens });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

const verifyAccessTokenController = (req, res) => {
    user = req.user;
    res.status(200).json({
        success: true,
        message: "Access token is valid, Logged in successfully.",
        user: {
            userId: user.UserId,
            role: user.role,
            username: user.username,
            email: user.email
        }
    });

}

module.exports = {
    getTokenController,
    verifyAccessTokenController
};