const {generateTokens, verifyAccessToken} = require("../services/tokenService");

const getTokenController = (req, res) => {
    // const { accesstoken } = req.body;\
    const accessToken  = req.cookies.accessToken;
    // const accesstoken = req.headers['Authorization']?.split(' ')[1];

    console.log("Access Token:", accessToken);


    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found." });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        const userData = {userId: decoded.UserId, role: decoded.role, username: decoded.username, email: decoded.email}
        // const accesstoken = generateTokens(userData);

        return res.json({ success: true, message: "Access token is valid.", user: userData });
  } catch (err) {
    return res.status(401).json({ message: "Invalid access token" });
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