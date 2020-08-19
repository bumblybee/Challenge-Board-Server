const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");

const questionsController = require("../controllers/questionsController");

router.get("/", questionsController.getQuestions);
router.get("/:id", questionsController.getQuestion);
router.post("/", isAuth, questionsController.createQuestion);
router.post("/:id", isAuth, questionsController.createComment);
router.post(
  "/selectAnswer",
  isAuth,
  authRole(roles.Teacher),
  questionsController.selectAnswer
);

module.exports = router;
