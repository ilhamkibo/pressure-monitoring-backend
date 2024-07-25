// modbusClient.js
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const client2 = new ModbusRTU();

async function connectModbus() {
  try {
    await client.connectTCP("127.0.0.1", { port: 502 });
    await client.setID(1);
    console.log("Modbus connected");
  } catch (err) {
    console.error("Error connecting to Modbus:", err);
  }
}

async function connectModbus2() {
  try {
    await client2.connectTCP("127.0.0.1", { port: 502 });
    await client2.setID(1);
    console.log("Modbus 2 connected");
  } catch (err) {
    console.error("Error connecting to Modbus:", err);
  }
}

async function readModbusData() {
  try {
    if (!client.isOpen) {
      await connectModbus();
    }
    // Contoh membaca register
    const data = await client.readHoldingRegisters(0, 10);
    return data.data;
  } catch (err) {
    console.error("Modbus Error:", err);
    return [];
  }
}

//read integer
// async function readModbusData2() {
//   try {
//     if (!client2.isOpen) {
//       await connectModbus2();
//     }
//     // Contoh membaca register
//     const data = await client2.readHoldingRegisters(0, 10);
//     return data.data;
//   } catch (err) {
//     console.error("Modbus Error:", err);
//     return [];
//   }
// }

//read float
async function readModbusData() {
  try {
    if (!client.isOpen) {
      await connectModbus();
    }

    // Read two registers starting from address 0 (adjust the address as needed)
    const data = await client.readHoldingRegisters(0, 4);

    // Combine the two registers into a float
    const floatValues = [];
    for (let i = 0; i < data.data.length; i += 2) {
      const high = data.data[i]; // High register
      const low = data.data[i + 1]; // Low register

      // Combine high and low into a 32-bit integer
      const combined = (high << 16) | low;

      // Convert to float using DataView
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, combined);
      const float = view.getFloat32(0);

      // Limit to 2 decimal places
      const roundedFloat = parseFloat(float.toFixed(2));

      floatValues.push(roundedFloat);
    }

    return floatValues;
  } catch (err) {
    console.error("Modbus Error:", err);
    return [];
  }
}

async function readModbusData2() {
  try {
    if (!client2.isOpen) {
      await connectModbus2();
    }

    // Read two registers starting from address 0 (adjust the address as needed)
    const data = await client2.readHoldingRegisters(4, 2);

    // Combine the two registers into a float
    const floatValues = [];
    for (let i = 0; i < data.data.length; i += 2) {
      const high = data.data[i]; // High register
      const low = data.data[i + 1]; // Low register

      // Combine high and low into a 32-bit integer
      const combined = (high << 16) | low;

      // Convert to float using DataView
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, combined);
      const float = view.getFloat32(0);

      // Limit to 2 decimal places
      const roundedFloat = parseFloat(float.toFixed(2));

      floatValues.push(roundedFloat);
    }

    return floatValues;
  } catch (err) {
    console.error("Modbus Error:", err);
    return [];
  }
}

module.exports = { connectModbus, readModbusData, readModbusData2 };
