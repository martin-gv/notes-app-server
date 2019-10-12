const db = require("../models/index");
const createToken = require("../helpers/createToken");
const verifyToken = require("../helpers/verifyToken");

const bcrypt = require("bcrypt");

// Login possible with credentials or access token issued by refresh route.
// Auto login handled by front-end by using refresh token to receive a new
// access token and submitting it to the login route.
exports.autoLogin = async function loginWithToken(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) return next();

    const { username } = verifyToken(token, "access");
    const user = await db.User.findOne({ username });
    // No database check because front-end just authenticated with a refresh token.

    // Remove secure info
    delete user.password;

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.login = async function(req, res, next) {
  try {
    const { body } = req;
    if (!body.username || !body.password)
      throw Error("login credentials missing");

    const user = await db.User.findOne({ username: body.username });
    if (!user) throw Error("no user found by that username");

    verifyUser(user);

    const match = await bcrypt.compare(body.password, user.password);
    if (!match) throw Error("incorrect password");

    const payload = createPayload(user);
    const accessToken = createToken(payload, "access");
    const refreshToken = createToken(payload, "refresh");

    // Remove secure info
    delete user.password;

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
};

// Verify refresh token to issue new access token
exports.refresh = async function(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) throw Error("missing request body property 'token'");

    const payload = verifyToken(token, "refresh");

    const user = await db.User.findOne({ username: payload.username });
    if (!user) throw Error("no user found matching token credentials");

    verifyUser(user);

    const accessPayload = createPayload(user);
    const accessToken = createToken(accessPayload, "access");

    res.status(200).json({ accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      err.status = 403;
      err.message = "Refresh token expired";
    }
    next(err);
  }
};

function verifyUser(user) {
  if (!user.active) throw Error("account disabled");
}

function createPayload(user) {
  const { id, username, role } = user;
  const payload = { id, username, role };
  return payload;
}

exports.signup = async function(req, res, next) {
  try {
    const data = req.body;
    delete data.id;

    const { insertId } = await db.User.create(data);
    const user = await db.User.findById(insertId);

    const payload = createPayload(user);
    const accessToken = createToken(payload, "access");
    const refreshToken = createToken(payload, "refresh");

    // Remove secure info
    delete user.password;

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
};
