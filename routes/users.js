const express = require("express");
const router = express.Router();

const setResource = require("../middleware/setResource");
const isAdmin = require("../middleware/isAdmin");
const ownRecord = require("../middleware/ownRecord");
const find = require("../middleware/find");
const hashPassword = require("../middleware/hashPassword");

const users = require("../handlers/users");

router.route("/").get(isAdmin, users.getAll);
router.route("/").post(isAdmin, hashPassword, users.create);
router.route("/").delete(isAdmin, users.deleteAll);

router.use(setResource("User"));
router.use("/:id", find, ownRecord);

router.route("/:id").get(users.getById);
router.route("/:id").put(hashPassword, users.update);
router.route("/:id").delete(users.deleteById);

// User's notes
const userNotes = [users.searchNotes, users.getNotes];
router.route("/:id/notes").get(userNotes);

// User's tags
router.route("/:id/tags").get(users.getTags);

module.exports = router;
