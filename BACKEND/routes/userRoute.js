
// const express = require('express');
// const router = express.Router();

// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));
// const userData = require('../model/userData');
// const authController = require('../controller/forgotResetController');

// router.post('/login', async (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     try {
//         const user = await userData.findOne({ email: email });
        
//         if (!user) {
//             return res.json({ message: "User not found" });
//         }

//         if (user.password !== password) {
//             return res.json({ message: "Password is wrong" });
//         } else {
//             return res.json({ message: "Login successfully!!", role: user.role,_id: user._id,name:user.name });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.json({ message: "Error logging in" });
//     }
// });


// router.post('/signup', async (req, res) => {
//     try {
//         console.log(req.body);
//         const { email, phone } = req.body;

//         // Check if the email or phone already exists
//         const existingEmail = await userData.findOne({ email });
//         const existingPhone = await userData.findOne({ phone });

//         if (existingEmail) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         if (existingPhone) {
//             return res.status(400).json({ message: 'Phone number already exists' });
//         }

//         const newUser = new userData(req.body);
//         await newUser.save();
//         res.json({ message: 'Registered successfully' });
//     } catch (error) {
//         res.status(500).json('Unable to post');
//         console.log(error);
//     }
// });

// router.post('/forgotpassword', authController.forgotPassword);
// router.post('/resetpassword/:token', authController.resetPassword);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userData = require('../model/userData');
// const authController = require('../controller/forgotResetController');
// const bcrypt = require('bcrypt');

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await userData.findOne({ email });
//         if (!user) {
//             return res.json(404).json({ message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.json(400).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successfully!!", role: user.role, name: user.name, _id: user._id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error logging in" });
//     }
// });

// router.post('/signup', async (req, res) => {
//     const { name, email, phone, password, role } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new userData({ name, email, phone, password: hashedPassword, role });

//         await newUser.save();
//         res.status(201).json({ message: "Registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error signing up" });
//     }
// });

// router.post('/forgotpassword', authController.forgotPassword);
// router.post('/resetpassword/:token', authController.resetPassword);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userData = require('../model/userData');
// const authController = require('../controller/forgotResetController');
// const bcrypt = require('bcrypt');

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await userData.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successfully!!", role: user.role, name: user.name, _id: user._id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error logging in" });
//     }
// });

// router.post('/signup', async (req, res) => {
//     const { name, email, phone, password, role } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new userData({ name, email, phone, password: hashedPassword, role });

//         await newUser.save();
//         res.status(201).json({ message: "Registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error signing up" });
//     }
// });

// router.post('/forgotpassword', authController.forgotPassword);
// router.post('/resetpassword/:token', authController.resetPassword);

// module.exports = router;


const express = require('express');
const router = express.Router();
const userData = require('../model/userData');
const authController = require('../controller/forgotResetController');
const bcrypt = require('bcrypt');

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userData.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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


const User = require('../model/Guser');

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



module.exports = router;
