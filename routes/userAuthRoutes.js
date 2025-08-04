const express = require("express");
const router = express.Router();

const {loginController, registerController, forgotPasswordController, resetPasswordController} = require("../controllers/userAuthController");

// login
router.post("/login", loginController);

// register
router.post("/register", registerController);

// forgot password
router.post("/forgot-password" , forgotPasswordController);

// reset password
router.post("/reset-password" , resetPasswordController);

module.exports = router;