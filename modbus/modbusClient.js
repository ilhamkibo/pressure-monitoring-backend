const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// Fungsi untuk membaca data dari perangkat Modbus
async function readModbusData() {
  try {
    await client.connectTCP("127.0.0.1", { port: 8502 });
    await client.setID(1);

    // Contoh membaca register
    const data = await client.readHoldingRegisters(0, 10);
    return data.data;
  } catch (err) {
    console.error("Modbus Error:", err);
    return [];
  }
}

module.exports = { readModbusData };
