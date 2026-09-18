"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpSms = void 0;
const sendOtpSms = async (phone, otp) => {
    const apiKey = process.env.FAST2SMS_API_KEY;
    // Development / Staging fallback: Print OTP to console if no API key is set
    if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
        console.log('\n====================================================');
        console.log(`📱 [KRUSHI CONNECT OTP]`);
        console.log(`📞 Mobile: +91 ${phone}`);
        console.log(`🔑 Verification Code: [ ${otp} ]`);
        console.log(`⏰ Valid for 5 minutes.`);
        console.log('====================================================\n');
        return {
            success: true,
            message: 'OTP sent! (In development mode, check your server console)'
        };
    }
    try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: 'otp',
                variables_values: otp,
                numbers: phone
            })
        });
        const data = await response.json();
        if (data && data.return === true) {
            return { success: true, message: 'OTP sent successfully to your mobile number.' };
        }
        else {
            console.error('Fast2SMS Error Response:', data);
            return {
                success: false,
                message: data.message?.[0] || data.message || 'Failed to dispatch SMS through gateway.'
            };
        }
    }
    catch (error) {
        console.error('Fast2SMS Network Exception:', error);
        return { success: false, message: 'SMS service is currently unreachable. Please try again.' };
    }
};
exports.sendOtpSms = sendOtpSms;
