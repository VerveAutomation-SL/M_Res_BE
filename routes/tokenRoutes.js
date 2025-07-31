const express = require("express");
const router = express.Router();

const { getTokenController, verifyAccessTokenController } = require("../controllers/tokenController");

router.post("/refresh", getTokenController)
router.post("/verify" , verifyAccessTokenController);


module.exports = router;