const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ 
        success: false,
        message: "Access token not found." 
    });

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {

            return res.status(403).json({ 
                success: false,
                message: "Session expired or invalid, please log in again." 
            });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;