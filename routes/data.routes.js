const express = require("express");
const router = express.Router();
const { getAlarmData } = require("../controllers/data.controller");

// Define routes and their corresponding controllers
router.get("/alarm", getAlarmData);

module.exports = router;
