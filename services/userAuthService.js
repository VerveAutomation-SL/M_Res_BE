const bcrypt = require("bcrypt");
const User = require("../models/Users");
const { generateTokens } = require("./tokenService");
const AppError = require("../utils/AppError");
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

module.exports = {
    loginService, 
    registerService
};