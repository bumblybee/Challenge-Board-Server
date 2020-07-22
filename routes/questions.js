const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");

router.get("/:id", challengeController.getQuestions);

module.exports = router;
