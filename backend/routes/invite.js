var express = require("express");
var router = express.Router();
const catchError = require("../util/catchError"); // wrapper
const InvitationController = require("../controllers/InvitationController");

router.get("/find", catchError(InvitationController.find));

module.exports = router;
