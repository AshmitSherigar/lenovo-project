const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sherigarashmit@gmail.com",
    pass: process.env.NODE_MAIL_PASS,
  },
});

const sendAlertEmail = async (alert) => {
  try {
    await transporter.sendMail({
      from: "sherigarashmit@gmail.com",
      to: "2024is_ashmitasherigar_a@nie.ac.in",
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
