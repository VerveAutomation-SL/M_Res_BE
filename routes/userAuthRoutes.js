const express = require("express");
const router = express.Router();

const {loginAdminController, loginHostController, registerController} = require("../controllers/userAuthController");

// login admin
router.post("/login-admin", loginAdminController);

// login host
router.post("/login-host", loginHostController);

// register
router.post("/register", registerController);

module.exports = router;