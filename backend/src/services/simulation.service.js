const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');

const filePath = path.join(__dirname, "../data/data.csv");

let data = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    data.push({
      serverId: row["Server_ID"],
      cpu: Number(row["CPU_Utilization_%"]),
      memory: Number(row["Memory_Utilization_%"]),
      power: Number(row["Power_Usage_Watts"]),
      timestamp: new Date(row["Timestamp"])
    });
  })
  .on('end', () => {
    console.log("CSV Loaded");

    let i = 0;

    setInterval(async () => {
      const row = data[i];

      try {
        await axios.post('http://localhost:5000/api/metrics', row);
      } catch (err) {
        console.error("POST error:", err.response?.data || err.message);
      }

      i = (i + 1) % data.length;
    }, 5000);
  });