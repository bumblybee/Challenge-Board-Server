const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");

const questionsController = require("../controllers/questionsController");

router.get("/:id", questionsController.getQuestion);

router.get("/", questionsController.getQuestions);

router.post("/", isAuth, errorWrapper(questionsController.createQuestion));

router.put(
  "/edit-question/:id",
  isAuth,
  errorWrapper(questionsController.editQuestion)
);

router.put(
  "/edit-thread-question/:id",
  isAuth,
  errorWrapper(questionsController.editThreadQuestion)
);

router.put(
  "/edit-answer/:id",
  isAuth,
  errorWrapper(questionsController.editAnswer)
);

router.delete(
  "/:id",
  isAuth,
  authRole(roles.Teacher),
  errorWrapper(questionsController.deleteQuestion)
);

module.exports = router;
