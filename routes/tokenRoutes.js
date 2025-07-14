const express = require("express");
const router = express.Router();

const { getTokenController, verifyAccessTokenController } = require("../controllers/tokenController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/refresh", getTokenController)
router.post("/verify", authenticateToken ,verifyAccessTokenController);

module.exports = router;