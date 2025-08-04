const {loginService, registerService, forgotPasswordService , resetPasswordService} = require("../services/userAuthService");

const loginController = async (req, res) => {
    const {userName, password} = req.body;

    if (!userName?.trim() || !password?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
    }

    try {
        const { accessToken, user } = await loginService({ userName, password });
        res
            .status(200).json({ 
                success: true, 
                message: `${user.username} Login successful`,
                accessToken: accessToken, 
            });
    } catch (error) {
        console.error("Error:", error);
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

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });
    }

    try {
        const result = await forgotPasswordService({ email });
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const resetPasswordController = async (req, res) => {
    console.log("Reset Password Controller called");
    const { token, password } = req.body;
    console.log("Reset Password Controller body:", req.body);

    if (!token?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Token and new password are required"
        });
    }

    // Password validation
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }

    try {
        const result = await resetPasswordService(token, password );
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = {
    loginController,
    registerController,
    forgotPasswordController,
    resetPasswordController
};