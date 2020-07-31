var express = require("express");
var router = express.Router();
var discordController = require("../controllers/discordController");

router.get("/", discordController.getDiscordUrl);

router.post("/signup", discordController.authenticateDiscordUser);

module.exports = router;
