const Handler = require("../config/Handler");
const users = new Handler("User");

const db = require("../models/index");

users.UPDATE_LOCKS = [
  {
    fields: ["role", "active"],
    roleRequired: "admin"
  }
];

// Async functions return a promise that resolves with the function's return value,
// or rejects with any thrown error. No need to explicitly return a promise via new Promise().

users.searchNotes = async function(req, res, next) {
  try {
    const { search } = req.query;
    if (!search) return next();

    const user_id = Number(req.params.id);
    const terms = search.split(" ");
    const results = await db.Note.find({ user_id, $ft_search: terms });

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

// Many to many table relationship (notes <-> tags). Notes are queried by inner join
// to link table via primary key and corresponding field in link table. Specific
// tag found by querying by tag_id in link table.

users.getNotesByTag = async function(req, res, next) {
  try {
    const tag_id = Number(req.params.id);
    const user_id = res.locals.token.id;

    const results = await await db.Note.find({
      user_id,
      "TaggedBy.tag_id": tag_id,
      $join: { table: "TaggedBy", field: "note_id" }
    });

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

users.getNotes = async function(req, res, next) {
  try {
    const user_id = Number(req.params.id);
    const results = await db.Note.find({ user_id });

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

users.getTags = async function(req, res, next) {
  try {
    const user_id = Number(req.params.id);

    const p1 = db.Tag.find({ user_id });
    const p2 = db.Tag.find({
      user_id,
      $join: { table: "TaggedBy", field: "tag_id" }
    });

    const results = await Promise.all([p1, p2]);

    res.status(200).json({ tags: results[0], notesTagged: results[1] });
  } catch (err) {
    next(err);
  }
};

module.exports = users;
