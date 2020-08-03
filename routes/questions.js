const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");

const questionsController = require("../controllers/questionsController");

router.get("/", isAuth, questionsController.getQuestions);
router.post("/", questionsController.createQuestion);

module.exports = router;
