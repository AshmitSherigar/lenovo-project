const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ananths4798@gmail.com",
    pass: "bqhq traf nfrr lkgs",
  },
});

const sendAlertEmail = async (alert) => {
  try {
    await transporter.sendMail({
      from: "ananths4798@gmail.com",
      to: "2024is_ananths_a@nie.ac.in",
      subject: "Power Alert Detected",
      text: `
            Server: ${alert.serverId}
            Message: ${alert.message}
            Time: ${new Date().toLocaleString()}
      `,
    });
    console.log("Email sent");
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

module.exports = { sendAlertEmail };
