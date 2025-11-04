import nodemailer from "nodemailer";

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    // Fallback to a console transporter if SMTP is not configured
    transporter = {
      sendMail: async (opts) => {
        console.log("[MAILER] SMTP not configured. Email payload:", opts);
        return { messageId: "console-transport" };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Boolean(process.env.SMTP_SECURE === "true"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendVerificationEmail({ to, code }) {
  const transport = getTransporter();
  const appName = process.env.APP_NAME || "InstaChat";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>${appName} - Email Verification</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</div>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  await transport.sendMail({
    from: process.env.MAIL_FROM || `no-reply@${(process.env.DOMAIN || "instachat.local")}`,
    to,
    subject: `${appName} - Verify your email`,
    html,
  });
}


