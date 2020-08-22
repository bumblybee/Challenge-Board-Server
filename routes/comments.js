const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");
const commentsController = require("../controllers/commentsController");

router.delete("/:id", commentsController.deleteComment);

module.exports = router;
