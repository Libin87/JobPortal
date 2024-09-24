
const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const userData = require('../model/userData');
const authController = require('../controller/forgotResetController');

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        const user = await userData.findOne({ email: email });
        
        if (!user) {
            return res.json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ message: "Password is wrong" });
        } else {
            return res.json({ message: "Login successfully!!", role: user.role,_id: user._id });
        }
    } catch (error) {
        console.log(error);
        return res.json({ message: "Error logging in" });
    }
});

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        var item = req.body;
        const newUser = new userData(item);
        const saveData = await newUser.save();
        res.json({ message: "Registered successfully" });
    } catch (error) {
        res.json('Unable to post');
        console.log(error);
    }
});

router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword/:token', authController.resetPassword);

module.exports = router;
