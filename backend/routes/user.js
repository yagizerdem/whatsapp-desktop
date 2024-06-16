var express = require("express");
var router = express.Router();
const catchError = require("../util/catchError"); // wrapper
const upload = require("../lib/upload");
const UserController = require("../controllers/UserController");

router.get("/find", catchError(UserController.find));
router.get("/getcurrentuser", catchError(UserController.getCurrentUser));
router.post(
  "/uploadprofileimage",
  upload.single("file"),
  catchError(UserController.uploadProfileImage)
);
module.exports = router;
