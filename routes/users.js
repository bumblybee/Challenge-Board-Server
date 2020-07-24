var express = require("express");
var router = express.Router();
const questionsController = require("../controllers/questionsController");

/* GET users listing. */
router.get("/", questionsController.getUsers);

module.exports = router;
