var express = require("express");
var router = express.Router();
const catchError = require("../util/catchError"); // wrapper
const InvitationController = require("../controllers/InvitationController");

router.get("/find", catchError(InvitationController.find));
router.post("/reject", catchError(InvitationController.reject));

module.exports = router;
