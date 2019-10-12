const express = require("express");
const router = express.Router();

const logger = require("../middleware/routeLogger");
const auth = require("../middleware/authentication");
const checkReqBody = require("../middleware/checkReqBody");

const authRoutes = require("./auth");
const userRoutes = require("./users");
const noteRoutes = require("./notes");
const tagRoutes = require("./tags");

// Logs all incoming requests
router.use(logger);

// Validates request body
router.post("*", checkReqBody);
router.put("*", checkReqBody);

router.use("/auth", authRoutes);

// Routes requiring authentication
router.use(auth);
router.use("/users", userRoutes);
router.use("/notes", noteRoutes);
router.use("/tags", tagRoutes);

module.exports = router;
