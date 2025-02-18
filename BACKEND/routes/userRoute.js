const express = require('express');
const router = express.Router();
const userData = require('../model/userData');
const authController = require('../controller/forgotResetController');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/Guser');
const Profile = require('../model/profile');
const Job = require('../model/job');
const Application = require('../model/applicationModel');

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userData.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is suspended
        if (user.accountStatus === 'suspended') {
            // Get the latest suspension notification
            const suspensionNotification = user.notifications
                ?.filter(n => n.type === 'suspension')
                .sort((a, b) => b.createdAt - a.createdAt)[0];

            return res.status(403).json({ 
                isSuspended: true,
                message: suspensionNotification?.message || "Your account has been suspended. Please contact admin for support.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successfully!!", role: user.role, name: user.name, _id: user._id,email:user.email,phone:user.phone });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { email, phone, password } = req.body;

        // Check if the email or phone already exists
        const existingEmail = await userData.findOne({ email });
        const existingPhone = await userData.findOne({ phone });

        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Hash the password
        const saltRounds = 10; // Adjust salt rounds as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const newUser = new userData({
            ...req.body,
            password: hashedPassword, // Store the hashed password
        });

        await newUser.save();
        res.json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json('Unable to post');
        console.log(error);
    }
});


// Forgot Password and Reset Password Routes
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword/:token', authController.resetPassword);

// Fetch All Users Route
router.get('/users', async (req, res) => {
    try {
        const users = await userData.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await userData.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Assuming you have userData defined and bcrypt imported as in your signup route

router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phone } = req.body;
        console.log('Request body:', req.body); // Add this line to check the incoming data

        // Check if the email or phone already exists, excluding the current user
        const existingPhone = await userData.findOne({ phone, _id: { $ne: userId } });

       

        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Update user information
        const updatedUser = await userData.findByIdAndUpdate(userId, req.body, {
            new: true, // Return the updated document
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to update user' });
    }
});

// In your routes/userRoute.js

router.get('/checkPhoneNumber', async (req, res) => {
    try {
        const { phone } = req.query;
        const existingUser = await userData.findOne({ phone });

        if (existingUser) {
            res.json({ exists: true, userId: existingUser._id });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking phone number:", error);
        res.status(500).json({ message: "Error checking phone number" });
    }
});


//google


// Route to handle Google Sign-In data
router.post('/google-signin', async (req, res) => {
    const { name, email, role, googleId } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Update existing user's Google ID if it's not set
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create a new user if one doesn't exist
            user = new User({ name, email, role, googleId });
            await user.save();
        }

        // Send back user info to the client if needed
        res.status(201).json({ message: 'User saved successfully', user });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: 'Error saving user data' });
    }
});

// Update the status update route
router.put('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        // Create the notification object
        const notification = {
            message: status === 'suspended' 
                ? `Your account has been suspended. Reason: ${reason || 'Violation of terms'}`
                : 'Your account has been reactivated.',
            type: status === 'suspended' ? 'suspension' : 'activation',
            createdAt: new Date(),
            read: false
        };

        // Update user with new status and add notification
        const updatedUser = await userData.findByIdAndUpdate(
            id,
            {
                $set: { accountStatus: status },
                $push: { notifications: notification }
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ 
            message: 'Error updating user status',
            error: error.message 
        });
    }
});

// Add this route to handle user status updates
router.put('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, message } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user status
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            accountStatus: status,
            statusMessage: message || ''
          }
        },
        { new: true, session }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      // If user is an employer and being suspended, update related data
      if (updatedUser.role === 'employer' && status === 'suspended') {
        // Update employer profile
        await Profile.findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              verificationStatus: 'suspended',
              verificationMessage: message || 'Account suspended by admin'
            }
          },
          { session }
        );

        // Update all jobs by this employer
        await Job.updateMany(
          { userId: userId },
          { 
            $set: { 
              status: 'suspended',
              verificationMessage: 'Employer account suspended'
            }
          },
          { session }
        );

        // Update all applications for jobs by this employer
        const employerJobs = await Job.find({ userId: userId }, null, { session });
        if (employerJobs.length > 0) {
          const jobIds = employerJobs.map(job => job._id);
          await Application.updateMany(
            { jobId: { $in: jobIds } },
            { 
              $set: { 
                approvalStatus: 'suspended',
                statusMessage: 'Job suspended due to employer account suspension'
              }
            },
            { session }
          );
        }
      }

      await session.commitTransaction();
      res.json({
        message: `User ${status} successfully`,
        user: updatedUser
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      message: 'Error updating user status',
      error: error.message 
    });
  }
});

module.exports = router;
