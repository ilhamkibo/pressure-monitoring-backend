const express = require("express");
const { createServer } = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { readModbusData, readModbusData2 } = require("./modbus/modbusClient");
const modbusRouter = require("./routes/modbus");
const dataRouter = require("./routes/data.routes");
const {
  insertLog,
  updateLogTimestamp,
} = require("./controllers/data.controller");

const app = express();
const server = createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Atur ke asal yang diizinkan, "*" untuk mengizinkan semua asal
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let lastInsertedDifference = null;
let lastInsertedDifference2 = null;

// Middleware CORS
app.use(cors());

app.use("/api/modbus", modbusRouter);
app.use("/api", dataRouter);

io.on("connection", (socket) => {
  console.log(`Client connected with ID: ${socket.id}`);

  setInterval(async () => {
    const data = await readModbusData();
    const data2 = await readModbusData2();
    const data3 = [...data, ...data2];
    // console.log("🚀 ~ setInterval ~ data2:", data3);
    socket.emit("modbusData", data3);
  }, 100); // Kirim data setiap 5 detik

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const intervalId = setInterval(async () => {
  try {
    // Fungsi untuk membaca data Modbus
    const data = await readModbusData();
    const data2 = await readModbusData2();
    const data3 = [...data, ...data2];

    const address0 = data3[0];
    const address1 = data3[1];
    const address2 = data3[2];
    const difference = Math.abs(address0 - address1);
    const difference2 = Math.abs(address1 - address2);

    if (difference <= 5 && difference > 0) {
      if (lastInsertedDifference == null) {
        const insertedId = await insertLog(difference.toFixed(2));
        lastInsertedDifference = insertedId;
      }
    } else if (difference > 5 && lastInsertedDifference !== null) {
      await updateLogTimestamp(lastInsertedDifference);
      lastInsertedDifference = null;
    }

    if (difference2 <= 5 && difference2 > 0) {
      if (lastInsertedDifference2 == null) {
        const insertedId = await insertLog(difference2.toFixed(2));
        lastInsertedDifference2 = insertedId;
      }
    } else if (difference2 > 5 && lastInsertedDifference2 !== null) {
      await updateLogTimestamp(lastInsertedDifference2);
      lastInsertedDifference2 = null;
    }
  } catch (error) {
    console.error("Failed to read modbus data or log data:", error);
  }
}, 500);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
