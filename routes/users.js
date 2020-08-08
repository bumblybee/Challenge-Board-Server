var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.signupUser);
router.post("/login", userController.loginUser);
// router.get("/login", userController.checkLoggedIn);
router.post("/password-reset", userController.generatePasswordReset);
router.post("/password-reset/:token", userController.passwordReset);
module.exports = router;
