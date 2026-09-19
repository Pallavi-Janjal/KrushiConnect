"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const buildEmailHtml = (otp) => `
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
            <tr>
              <td style="padding: 36px 32px;">
                <h2 style="margin: 0 0 16px 0; color: #15803d; font-size: 20px;">
                  Verify Your Email Address
                </h2>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                  Hello, thank you for joining <strong>KrushiConnect</strong>. Use the 6-digit verification code below to complete your registration or verify your account:
                </p>
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
/**
 * Sends email via Brevo REST API (HTTP port 443 — NEVER blocked by Render)
 * Works for ANY recipient without needing a custom domain!
 */
const sendViaBrevoApi = async (apiKey, toEmail, otp) => {
    try {
        const senderEmail = process.env.SMTP_USER || 'hondaleshivani@gmail.com';
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey.trim(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'KrushiConnect', email: senderEmail },
                to: [{ email: toEmail }],
                subject: `Your KrushiConnect Verification Code: ${otp}`,
                htmlContent: buildEmailHtml(otp),
                textContent: `KrushiConnect Verification Code: ${otp}\n\nValid for 10 minutes.`
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error('Brevo API error:', data);
            return {
                success: false,
                message: data.message || `Brevo HTTP error ${response.status}`
            };
        }
        console.log(`✅ [Brevo API] Email sent to ${toEmail} (MessageId: ${data.messageId})`);
        return {
            success: true,
            message: 'Verification code sent successfully to your email.'
        };
    }
    catch (err) {
        console.error('Brevo fetch failed:', err);
        return {
            success: false,
            message: err.message || 'Failed to dispatch email via Brevo.'
        };
    }
};
/**
 * Sends email via Resend REST API (HTTP port 443 — bypasses SMTP port blocking)
 */
const sendViaResendApi = async (apiKey, toEmail, otp) => {
    try {
        const fromAddress = process.env.RESEND_FROM || 'KrushiConnect <onboarding@resend.dev>';
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'Content-Type': 'application/json',
                'User-Agent': 'KrushiConnect/1.0'
            },
            body: JSON.stringify({
                from: fromAddress,
                to: [toEmail],
                subject: `Your KrushiConnect Verification Code: ${otp}`,
                html: buildEmailHtml(otp),
                text: `KrushiConnect Verification Code: ${otp}\n\nValid for 10 minutes.`
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error('Resend API error:', data);
            return {
                success: false,
                message: data.message || `Resend error: ${JSON.stringify(data)}`
            };
        }
        console.log(`✅ [Resend API] Email sent to ${toEmail} (id: ${data.id})`);
        return {
            success: true,
            message: 'Verification code sent successfully to your email.'
        };
    }
    catch (err) {
        console.error('Resend fetch failed:', err);
        return {
            success: false,
            message: err.message || 'Failed to dispatch email via Resend.'
        };
    }
};
/**
 * Creates fallback Nodemailer transporter for local development (Gmail SMTP)
 */
const getLocalTransporter = () => {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_gmail_app_password' || pass === 'abcdefghijklmnop') {
        return null;
    }
    const cleanUser = user.trim();
    const cleanPass = pass.trim().replace(/\s+/g, '');
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    if (host.includes('gmail.com')) {
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: { user: cleanUser, pass: cleanPass }
        });
    }
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: { user: cleanUser, pass: cleanPass }
    });
};
/**
 * Dispatches an email containing the 6-digit verification code.
 *
 * Execution Priority:
 *  1. BREVO_API_KEY  → HTTPS REST API (Port 443 — works for ALL recipients without domain, free 300/day)
 *  2. RESEND_API_KEY → HTTPS REST API (Port 443 — works on Render without SMTP blocking)
 *  3. SMTP_USER + PASS → Nodemailer SMTP (Works locally on localhost)
 *  4. Dev Fallback   → Logs code to console
 */
const sendOtpEmail = async (email, otp) => {
    // ── Priority 1: Brevo REST API (Recommended for Render — works for any email recipient) ──
    const brevoKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    if (brevoKey && brevoKey.trim() !== '') {
        console.log('📧 Dispatching OTP via Brevo HTTPS API...');
        return await sendViaBrevoApi(brevoKey, email, otp);
    }
    // ── Priority 2: Resend REST API (HTTPS port 443) ──
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.startsWith('re_')) {
        console.log('📧 Dispatching OTP via Resend HTTPS API...');
        return await sendViaResendApi(resendKey, email, otp);
    }
    // ── Priority 3: Nodemailer SMTP (Localhost) ──
    const transporter = getLocalTransporter();
    if (transporter) {
        try {
            const fromAddress = process.env.EMAIL_FROM || `"KrushiConnect" <${process.env.SMTP_USER}>`;
            await transporter.sendMail({
                from: fromAddress,
                to: email,
                subject: `Your KrushiConnect Verification Code: ${otp}`,
                text: `KrushiConnect Verification Code: ${otp}\n\nValid for 10 minutes.`,
                html: buildEmailHtml(otp)
            });
            console.log(`✅ [Nodemailer SMTP] Email sent to ${email}`);
            return {
                success: true,
                message: 'Verification code sent successfully to your email.'
            };
        }
        catch (err) {
            console.error('Nodemailer SMTP error:', err);
            return {
                success: false,
                message: err.message || 'SMTP delivery failed.'
            };
        }
    }
    // ── Priority 4: Dev Mode Fallback ──
    console.log('\n====================================================');
    console.log('📧 [KRUSHI CONNECT EMAIL OTP - DEV MODE]');
    console.log(`✉️  To: ${email}`);
    console.log(`🔑 Verification Code: [ ${otp} ]`);
    console.log('⏰ Valid for 10 minutes.');
    console.log('💡 Note: Set BREVO_API_KEY or RESEND_API_KEY to send real emails in production.');
    console.log('====================================================\n');
    return {
        success: true,
        message: 'Verification code generated! (Dev mode: check server console)'
    };
};
exports.sendOtpEmail = sendOtpEmail;
