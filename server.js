const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const modbusRouter = require("./routes/modbus");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use("/api/modbus", modbusRouter);

io.on("connection", (socket) => {
  console.log("New client connected");

  setInterval(async () => {
    const data = await readModbusData();
    socket.emit("modbusData", data);
  }, 5000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
