const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userData = require('../model/userData');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userData.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account with that email address exists.' });
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD // Use App Password here
            }
        });
        console.log(process.env.EMAIL_APP_PASSWORD);
        console.log(process.env.EMAIL);
        // Email content
        const mailOptions = {
            from: `"Job Portal" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="http://localhost:3001/resetpassword/${token}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Password reset email sent successfully' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending reset email', 
            error: error.message 
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await userData.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password reset token is invalid or has expired' 
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error resetting password', 
            error: error.message 
        });
    }
};
