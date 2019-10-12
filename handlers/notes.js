const Handler = require("../config/Handler");
const notes = new Handler("Note");

const db = require("../models/index");

notes.addTag = async function(req, res, next) {
  try {
    // Note: values are from both params and request body
    const note_id = Number(req.params.id);
    const tag_id = Number(req.body.id);

    const data = { note_id, tag_id };
    const results = await db.TaggedBy.create(data);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

notes.deleteTag = async function(req, res, next) {
  try {
    const note_id = Number(req.params.id);
    const tag_id = Number(req.params.tag_id);

    const query = { note_id, tag_id };
    const results = await db.TaggedBy.delete(query);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = notes;
