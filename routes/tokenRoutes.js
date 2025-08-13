const express = require("express");
const router = express.Router();

const { getTokenController, verifyAccessTokenController } = require("../controllers/tokenController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/refresh", authenticateToken, getTokenController)
router.post("/verify" , verifyAccessTokenController);


module.exports = router;