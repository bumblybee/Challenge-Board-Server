var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");

router.post("/create", errorWrapper(userController.signupUser));

router.post("/login", errorWrapper(userController.loginUser));

router.post("/logout", userController.logoutUser);

router.post(
  "/password-reset",
  errorWrapper(userController.generatePasswordReset)
);

router.post(
  "/password-reset/:token",
  errorWrapper(userController.passwordReset)
);

router.get("/get-user", isAuth, errorWrapper(userController.getUser));

module.exports = router;
