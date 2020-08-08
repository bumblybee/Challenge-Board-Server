const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");

const questionsController = require("../controllers/questionsController");

router.get("/", questionsController.getQuestions);
router.post("/", isAuth, questionsController.createQuestion);

module.exports = router;
