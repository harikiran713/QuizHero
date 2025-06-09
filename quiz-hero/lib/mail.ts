import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "harikiranl713@gmail.com",
    pass: "ktuj ghhv ldfu qhkz", // app password (not your Gmail password)
  },
});

export default async function sendOtp(email: string, otp: string) {
  const mailOptions = {
    from: "harikiranl713@gmail.com",
    to: email,
    subject: "Quiz Hero App Login OTP",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully.");
  } catch (err) {
    console.error("Failed to send OTP email:", err);
  }
}
