const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: 587,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    text: `Click on the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  sendPasswordResetEmail
};