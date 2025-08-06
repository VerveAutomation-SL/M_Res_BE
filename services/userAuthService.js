const bcrypt = require("bcrypt");
const User = require("../models/Users");
const { generateTokens } = require("./tokenService");
const AppError = require("../utils/AppError");
const Permission = require("../models/Permission");
const { sendPasswordResetEmail } = require("./emailService");
const crypto = require('crypto');
const { Op } = require("sequelize");

require("dotenv").config();


const loginService = async ({ userName, password }) => {

        // Find Admin by username
        const user = await User.findOne({ where: { username: userName } });
        if (!user) {
            throw new AppError(404, `User not found with username: ${userName}`);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, "Invalid password");
        }

        const userData = {UserId: user.UserId, role: user.role, username: user.username, email: user.email};

        // Generate JWT tokens
        const accessToken = generateTokens(userData); 

        return { accessToken, user: userData  };
}

const registerService = async ({ userName, email, password }) => {

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username: userName, role: "Admin" } });
        if (existingUser) {
            throw new AppError(409, "User already exists",);        
        }

        // Create user
        const newUser = await User.create({
            username: userName,
            email,
            password: password,
            role: "Admin" // Default role for registration
        });

        const userData = { userId: newUser.UserId, role: newUser.role, username: newUser.username, email: newUser.email };

        return { user: userData };

}

const forgotPasswordService = async ({email}) => {
    const user = await User.findOne({where: {email: email.toLowerCase() }});

    if(!user){
        return {success: true, message: "If an account with that email exists, a password reset link has been sent."};
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token
    await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
    });

    await sendPasswordResetEmail(user.email, resetToken, user.username);

    return { success: true, message: "Password reset link has been sent." };

};

const resetPasswordService = async(token, newPassword) => {
    const user = await User.findOne({ where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
            [Op.gt]: new Date() // Check if token is not expired
        }
        
    }});
    console.log("User found for password reset:", user);

    if(!user){
        throw new AppError(400, "Invalid or expired password reset token");
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await user.update({
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
    });

    return { success: true, message: "Password has been reset successfully." };
}

module.exports = {
    loginService,
    registerService,
    forgotPasswordService,
    resetPasswordService
};