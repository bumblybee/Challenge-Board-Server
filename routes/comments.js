const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");
const commentsController = require("../controllers/commentsController");

router.post("/:id", isAuth, commentsController.createComment);

router.put("/edit/:id", isAuth, commentsController.editComment);

router.delete(
  "/:id",
  isAuth,
  authRole(roles.Teacher),
  commentsController.deleteComment
);

module.exports = router;
