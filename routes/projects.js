const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");

const projectController = require("../controllers/projectController");

router.get("/", isAuth, projectController.getProject);

router.put("/:id", isAuth, errorWrapper(projectController.editProject));

router.post("/", isAuth, errorWrapper(projectController.submitProject));

module.exports = router;
