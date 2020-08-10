var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const userController = require("../controllers/userController");

router.post("/create", userController.signupUser);
router.post("/login", userController.loginUser);

router.post("/password-reset", userController.generatePasswordReset);
router.post("/password-reset/:token", userController.passwordReset);

router.get("/check-login", isAuth, userController.checkLoggedIn);

module.exports = router;
