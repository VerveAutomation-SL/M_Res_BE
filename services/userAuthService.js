const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { generateTokens } = require("./tokenService");
require("dotenv").config();


const loginAdminService = async ({ userName, password }) => {

        // Find Admin by username
        const user = await User.findOne({ where: { username: userName, role: "Admin" } });
        if (!user) {
            throw new Error("User not found or not an admin");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const userData = {userId: user.UserId, role: user.role, username: user.username, email: user.email}

        // Generate JWT tokens
        const tokens = generateTokens(userData); 

        return { ...tokens, user: userData  };
}

const loginHostService = async ({ userName, password }) => {

     // Find Host by username
     const user = await User.findOne({ where: { username: userName, role: "Host" } });
     if (!user) {
         throw new Error("User not found or not an Host");
     }

     // Verify password
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
         throw new Error("Invalid password");
     }

     const userData = {userId: user.UserId, role: user.role, username: user.username, email: user.email}

     // Generate JWT tokens
     const tokens = generateTokens(userData); 

     return { ...tokens, user: userData  };
}

const registerService = async ({ userName, email, password }) => {

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username: userName, role: "Admin" } });
        if (existingUser) {
            throw new Error("Admin already exists");
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
    loginAdminService, 
    loginHostService, 
    registerService
};