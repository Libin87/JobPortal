
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userData = require('../model/userData');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userData.findOne({ email });

        if (!user) {
            return res.json({ message: 'No account with that email address exists.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3001/user/resetpassword/${token}\n\n    
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        // ${req.headers.host}
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('There was an error: ', err);
                return res.json({ message: 'Error sending the email' });
            }
            res.json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body; // Extract newPassword from the request body

        // Find user by reset token and ensure the token is still valid (not expired)
        const user = await userData.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Update the user's password and clear the reset token fields
        user.password = newPassword; // Ideally, hash the password before saving
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: 'Password has been successfully reset!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
