const {loginService, registerService} = require("../services/userAuthService");

const loginController = async (req, res) => {
    const {userName, password, role} = req.body;

    if (!userName?.trim() || !password?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
    }

    try {
        const { tokens, user } = await loginService({ userName, password, role });
        res.status(200).json({ 
            success: true, 
            message: `${role} Login successful`,
            tokens,
            user 
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.message || "Internal Server Error"
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
        res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.message || "Internal Server Error"
        });
    }
}

module.exports = {
    loginController,  
    registerController
};