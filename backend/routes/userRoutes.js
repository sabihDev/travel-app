const express = require("express");
const { register, login, getUser } = require("../controllers/userControllers.js");
const { authenticateToken } = require("../utilities.js");

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/get-user", authenticateToken, getUser);

module.exports = router