const axios = require('axios');

const checkMLAnomaly = async (features) => {
  try {
    const res = await axios.post('http://localhost:5001/predict', features);
    return res.data;
  } catch (err) {
    console.error("ML error:", err.message);
    return null;
  }
};

module.exports = { checkMLAnomaly };