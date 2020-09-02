const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");

const questionsController = require("../controllers/questionsController");

router.get("/", questionsController.getQuestions);

router.get("/:id", questionsController.getQuestion);

router.post("/", isAuth, errorWrapper(questionsController.createQuestion));

router.post(
  "/select-answer/:questionId/:commentId",
  isAuth,
  authRole(roles.Teacher),
  questionsController.selectAnswer
);

router.put(
  "/edit-question/:id",
  isAuth,
  errorWrapper(questionsController.editQuestion)
);

router.delete(
  "/:id",
  isAuth,
  authRole(roles.Teacher),
  questionsController.deleteQuestion
);

module.exports = router;
