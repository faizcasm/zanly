import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* prettier-ignore */
function generateOtpTemplate(Otp, appName = 'Zanly') {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { margin:0; font-family: Arial, sans-serif; background:#f6f9fc; }
      .container { max-width:600px; margin:20px auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
      h1 { color:#333; font-size:24px; text-align:center; }
      p { color:#555; font-size:16px; line-height:1.5; }
      .otp-box { margin:20px 0; font-size:32px; letter-spacing:8px; font-weight:bold; color:#2563eb; text-align:center; }
      .btn { display:inline-block; margin-top:20px; background:#2563eb; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px; font-size:16px; text-align:center; }
      .footer { margin-top:30px; font-size:12px; color:#888; text-align:center; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🔐 Verify Your Email</h1>
      <p>Hello,</p>
      <p>Thank you for using <b>${appName}</b>. Use the following One-Time Password (OTP) to verify your account. This OTP is valid for <b>10 minutes</b>.</p>
      <div class="otp-box">${Otp}</div>
      <p>If you did not request this, you can safely ignore this email.</p>
      <a href="#" class="btn">Go to ${appName}</a>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
function generateWelcomeTemplate(userName , appName = 'Zanly') {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { margin:0; font-family: Arial, sans-serif; background:#f6f9fc; }
      .container { max-width:600px; margin:20px auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
      h1 { color:#2563eb; font-size:26px; text-align:center; margin-bottom:10px; }
      p { color:#555; font-size:16px; line-height:1.6; }
      .highlight { color:#2563eb; font-weight:bold; }
      .btn { display:inline-block; margin-top:25px; background:#2563eb; color:#fff; padding:12px 28px; text-decoration:none; border-radius:8px; font-size:16px; text-align:center; }
      .footer { margin-top:40px; font-size:12px; color:#888; text-align:center; }
      .logo { text-align:center; font-size:32px; margin-bottom:10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🎉</div>
      <h1>Welcome to ${appName}!</h1>
      <p>Hi <b>${userName}</b>,</p>
      <p>We're thrilled to have you on board! You’ve successfully signed up for <span class="highlight">${appName}</span>.</p>
      <p>Start exploring the features, personalize your experience, and make the most of what ${appName} has to offer.</p>
      <a href="#" class="btn">Get Started</a>
      <p>If you have any questions, feel free to reply to this email — we’re always here to help.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.<br/>
        Sent with ❤️ from the ${appName} Team.
      </div>
    </div>
  </body>
  </html>
  `;
}

const sendMail = async ({ Otp, email, name, emailType }) => {
  const isReset = emailType === 'RESET PASSWORD'; 

  const info = await transporter.sendMail({
    from: `"Zanly" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: isReset 
      ? `Hello ${name}, here is your OTP ✔` 
      : `Hello ${name}, welcome to Zanly 🎉`,
    text: isReset 
      ? `Your OTP is ${Otp} for Zanly (valid for 10 minutes).`
      : `Welcome aboard, ${name}! We're excited to have you on Zanly.`,
    html: isReset 
      ? generateOtpTemplate(Otp, 'Zanly') 
      : generateWelcomeTemplate(name, 'Zanly')
  });

  return info.messageId;
};

export default sendMail;
