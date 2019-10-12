const express = require("express");
const router = express.Router();

const setResource = require("../middleware/setResource");
const isAdmin = require("../middleware/isAdmin");
const isOwner = require("../middleware/isOwner");
const currentUserOnly = require("../middleware/currentUserOnly");
const find = require("../middleware/find");

const tags = require("../handlers/tags");
const users = require("../handlers/users");

router.route("/").get(isAdmin, tags.getAll);
router.route("/").post(currentUserOnly, tags.create);
router.route("/").delete(isAdmin, tags.deleteAll);

router.use(setResource("Tag"));

router.use("/:id", find, isOwner);
router.route("/:id").get(tags.getById);
router.route("/:id").put(tags.update);
router.route("/:id").delete(tags.deleteById);

// Get notes tagged with a specific tag
router.route("/:id/notes").get(users.getNotesByTag)

module.exports = router;
