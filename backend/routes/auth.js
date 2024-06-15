var express = require("express");
var router = express.Router();
const catchError = require("../util/catchError"); // wrapper
const UserController = require("../controllers/UserController");

router.post("/register", catchError(UserController.register));
router.post("/login", catchError(UserController.login));
router.get("/isLoggedIn", catchError(UserController.isLoggedIn));
router.post("/logout", catchError(UserController.logOut));

module.exports = router;
