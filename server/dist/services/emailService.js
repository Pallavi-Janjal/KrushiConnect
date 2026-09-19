"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Creates and returns a Nodemailer transporter configured via environment variables.
 */
const getTransporter = () => {
    const user = (process.env.SMTP_USER || process.env.STMP_USER || '').trim();
    const pass = (process.env.SMTP_PASS || process.env.STMP_PASS || '').trim().replace(/\s+/g, '');
    if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_gmail_app_password') {
        return null;
    }
    const cleanUser = user;
    const cleanPass = pass;
    const host = (process.env.SMTP_HOST || process.env.STMP_HOST || 'smtp.gmail.com').trim();
    const port = Number(process.env.SMTP_PORT || process.env.STMP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    if (host.includes('gmail.com')) {
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: cleanUser,
                pass: cleanPass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: {
            user: cleanUser,
            pass: cleanPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};
/**
 * Dispatches an email containing the 6-digit verification code using Nodemailer.
 */
const sendOtpEmail = async (email, otp) => {
    const transporter = getTransporter();
    if (!transporter) {
        return {
            success: false,
            message: 'SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASS.'
        };
    }
    try {
        const effectiveUser = (process.env.SMTP_USER || process.env.STMP_USER || '').trim();
        const fromAddress = process.env.EMAIL_FROM || `"KrushiConnect" <${effectiveUser}>`;
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KrushiConnect Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f4; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560px" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px 24px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                      🌾 KrushiConnect
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #dcfce7; font-size: 14px;">
                      Empowering Farmers Through Modern Agricultural Machinery
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 16px 0; color: #15803d; font-size: 20px;">
                      Verify Your Email Address
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                      Hello, thank you for joining <strong>KrushiConnect</strong>. Use the 6-digit verification code below to complete your registration:
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 18px 36px;">
                        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace;">
                          ${otp}
                        </span>
                      </div>
                    </div>

                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; text-align: center;">
                      ⏱ This code is valid for <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
                      If you did not request this verification code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
                    © ${new Date().getFullYear()} KrushiConnect. All rights reserved.<br>
                    Connecting Farmers & Equipment Owners Across India.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        const textContent = `KrushiConnect Verification Code: ${otp}\n\nValid for 10 minutes. If you did not request this code, please ignore this email.`;
        await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `Your KrushiConnect Verification Code: ${otp}`,
            text: textContent,
            html: htmlContent
        });
        return {
            success: true,
            message: 'Verification code sent successfully to your email.'
        };
    }
    catch (error) {
        console.error('Nodemailer error dispatching email:', error);
        return {
            success: false,
            message: error.message || 'Failed to dispatch email. Please check your SMTP configuration.'
        };
    }
};
exports.sendOtpEmail = sendOtpEmail;
