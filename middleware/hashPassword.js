const bcrypt = require("bcrypt");
const saltRounds = 12;

async function isAdmin(req, res, next) {
  try {
    const data = req.body;
    
    if (data.password)
      data.password = await bcrypt.hash(data.password, saltRounds);

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = isAdmin;
