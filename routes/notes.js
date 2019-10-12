const express = require("express");
const router = express.Router();

const setResource = require("../middleware/setResource");
const isAdmin = require("../middleware/isAdmin");
const isOwner = require("../middleware/isOwner");
const currentUserOnly = require("../middleware/currentUserOnly");
const find = require("../middleware/find");

const notes = require("../handlers/notes");

router.route("/").get(isAdmin, notes.getAll);
router.route("/").post(currentUserOnly, notes.create);
router.route("/").delete(isAdmin, notes.deleteAll);

router.use(setResource("Note"));

router.use("/:id", find, isOwner);
router.route("/:id").get(notes.getById);
router.route("/:id").put(notes.update);
router.route("/:id").delete(notes.deleteById);

// Add/remove tags from a note
router.use(setResource("Tag"));
router.route("/:id/tags").post(find.body, isOwner, notes.addTag);
router
  .route("/:id/tags/:tag_id")
  .delete(find.by("tag_id"), isOwner, notes.deleteTag);

module.exports = router;
