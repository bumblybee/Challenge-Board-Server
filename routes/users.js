var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");

router.post("/create", errorWrapper(userController.signupUser));
router.post("/login", errorWrapper(userController.loginUser));

router.post(
  "/password-reset",
  errorWrapper(userController.generatePasswordReset)
);
router.post(
  "/password-reset/:token",
  errorWrapper(userController.passwordReset)
);

router.get("/check-login", isAuth, errorWrapper(userController.checkLoggedIn));

router.get("/:id/posts", isAuth, userController.getPosts);

module.exports = router;
