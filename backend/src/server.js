const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socket');
const { setSocket } = require('./controllers/metric.controller');
const { setSocketInstance } = require('./services/system.monitor.service');

connectDB();

const server = http.createServer(app);

const io = initSocket(server);
setSocket(io);
setSocketInstance(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});