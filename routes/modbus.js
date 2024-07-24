const express = require("express");
const { readModbusData } = require("../modbus/modbusClient");
const router = express.Router();

router.get("/data", async (req, res) => {
  const data = await readModbusData();
  res.json(data);
});

module.exports = router;
