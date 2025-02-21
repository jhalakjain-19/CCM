const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (to, subject, content) => {
  try {
    console.log("Sending email...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use `true` for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },

      debug: true, // Enable debugging
    });
    console.log("Transport...");

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to,
      subject,
      html: content,
    };
    console.log("Mail options...");

    const info = await transporter.sendMail(mailOptions);
    console.log("msgg", info);
    //console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendMail;
