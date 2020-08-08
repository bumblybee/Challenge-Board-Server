var express = require("express");
var router = express.Router();
var discordController = require("../controllers/discordController");

// When they hit this route, get url (containing scope, client_id, redirect URI, and state)
router.get("/", discordController.getDiscordUrl);
// Where redirect URI brings user, checks state, stores them in DB and logs them in
router.post("/signup", discordController.authenticateDiscordUser);

module.exports = router;
