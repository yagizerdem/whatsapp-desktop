var express = require("express");
var router = express.Router();
const catchError = require("../util/catchError"); // wrapper
const UserController = require("../controllers/UserController");

router.get("/find", catchError(UserController.find));
router.get("/getcurrentuser", catchError(UserController.getCurrentUser));
module.exports = router;
