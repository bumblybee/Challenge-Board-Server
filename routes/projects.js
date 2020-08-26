const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const projectController = require("../controllers/projectController");

router.post("/", isAuth, projectController.submitProject);

module.exports = router;
