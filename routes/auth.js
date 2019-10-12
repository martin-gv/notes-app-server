const express = require("express");
const router = express.Router();

const auth = require("../handlers/auth");
const users = require("../handlers/users");
const hashPassword = require("../middleware/hashPassword");

router.route("/signup").post(hashPassword, auth.signup);

router.route("/login").post(auth.autoLogin, auth.login);
router.route("/refresh").post(auth.refresh);

module.exports = router;
