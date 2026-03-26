const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected");
});

socket.on("power-data", (data) => {
  console.log("LIVE:", data);
});