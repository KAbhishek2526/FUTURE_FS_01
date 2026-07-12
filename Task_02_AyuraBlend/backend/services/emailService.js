/**
 * Email Service helper to simulate or dispatch verification OTPs
 */
exports.sendOtpEmail = async (email, otp) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If live SMTP variables are configured in .env, attempt nodemailer dispatch
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587', 10),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"AyuraBlend Apothecary" <${smtpUser}>`,
        to: email,
        subject: 'Your AyuraBlend Verification Code',
        text: `Your 6-digit verification code is: ${otp}. It is valid for 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px;">
            <h2 style="color: #2C4A3E; margin-top: 0;">AyuraBlend Verification</h2>
            <p style="color: #4b5563;">Thank you for registering or logging in. Use the verification code below to complete your authentication:</p>
            <div style="font-size: 28px; font-weight: bold; tracking-width: 2px; color: #2C4A3E; padding: 12px 24px; background-color: #f4f3ef; border-radius: 6px; text-align: center; margin: 24px 0;">
              ${otp}
            </div>
            <p style="color: #9ca3af; font-size: 11px;">This code was generated securely and will expire in 5 minutes.</p>
          </div>
        `
      });
      console.log(`[SMTP Email Service] OTP verification code successfully sent to ${email}`);
      return true;
    } catch (err) {
      console.error('[SMTP Email Service] Error sending email via SMTP:', err.message);
    }
  }

  // Graceful Fallback: print to console for development environment simplicity
  console.log(`
┌──────────────────────────────────────────────────────────┐
│             📧 EMAIL OTP DISPATCH SIMULATION             │
├──────────────────────────────────────────────────────────┤
│  To:      ${email.padEnd(46)} │
│  Subject: Your AyuraBlend Verification Code             │
│  Code:    ${otp.padEnd(46)} │
│  Expires: 5 minutes                                      │
└──────────────────────────────────────────────────────────┘
  `);
  return true;
};
