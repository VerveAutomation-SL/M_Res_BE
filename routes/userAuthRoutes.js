const express = require("express");
const router = express.Router();

const {loginController, registerController} = require("../controllers/userAuthController");

// login
router.post("/login", loginController);

// register
router.post("/register", registerController);

module.exports = router;