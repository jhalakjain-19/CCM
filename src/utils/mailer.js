const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure environment variables are loaded

const sendMail = async (email, subject, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT, // Ensure PORT is a number
      secure: false, // Use `true` for port 465, `false` for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: `
        <p>Click the button below to reset your password:</p>
<p>
  <a href="${resetLink}" target="_blank" style="
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
  ">
    Reset Password
  </a>
</p>
<p>If you didn't request this, please ignore it.</p>

      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendMail;
