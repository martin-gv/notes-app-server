const Model = require("../config/Model");
const Note = new Model("Note");

Note.FULL_TEXT_FIELDS = ["title", "content"];

module.exports = Note;
