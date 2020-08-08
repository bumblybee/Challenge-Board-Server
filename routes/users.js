var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.signupUser);
router.post("/login", userController.loginUser);
//TODO: add route for checking isLogged in with isAuth
router.post("/password-reset", userController.generatePasswordReset);
router.post("/password-reset/:token", userController.passwordReset);
module.exports = router;
