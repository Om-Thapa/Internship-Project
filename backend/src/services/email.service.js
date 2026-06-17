const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <div style="background-color: #030303; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #1a1a1a; border-radius: 12px;">
      <h2 style="color: #ffffff; font-weight: 300; letter-spacing: 2px;">PUREPUFF</h2>
      <p style="color: #888888; font-size: 16px;">Welcome to absolute purity, ${name}. Verify your profile using the authorization node below.</p>
      <div style="margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #ffffff; color: #000000; padding: 14px 30px; font-weight: bold; text-decoration: none; border-radius: 4px; letter-spacing: 1px; display: inline-block;">VERIFY ACCESS NODE</a>
      </div>
      <p style="color: #444444; font-size: 12px; margin-top: 40px;">If this route was not initialized by your profile, please discard this secure signature.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "PurePuff Access Token Signature",
    html: htmlContent,
  });
};
