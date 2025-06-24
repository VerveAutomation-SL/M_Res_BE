const {loginAdminService, loginHostService, registerService} = require("../services/userAuthService");

const loginAdminController = async (req, res) => {
    const {userName, password} = req.body;

    if (!userName?.trim() || !password?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
    }

    try {
        const { accesstoken, user } = await loginAdminService({ userName, password });
        res.status(200).json({ 
            success: true, 
            message: "Admin Login successful",
            accesstoken,
            user 
        });
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: error.message 
        });
    }
}

const loginHostController = async (req, res) => {
    const {userName, password} = req.body;

    if (!userName?.trim() || !password?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
    }
    try {
        const { accesstoken, user } = await loginHostService({ userName, password });
        res.status(200).json({ 
            success: true, 
            message: "Host Login successful",
            accesstoken,
            user 
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: error.message 
        });
    }
}

const registerController = async (req, res) => {
    const {userName, email, password} = req.body;

    if (!userName?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username, Email and password are required"
        });
    }
    try{
        const user = await registerService({ userName, email, password });
        res.status(201).json({ 
            success: true,
            message: "Admin registration successful",
            user 
            });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

module.exports = {
    loginAdminController, 
    loginHostController, 
    registerController
};