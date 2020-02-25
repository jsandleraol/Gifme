const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//  imports default.json
const config = require('config');
const connectDB = require('../../config/db');
const User = require('../../models/Users');
const auth = require('../../middleware/auth');

// @route   GET api/users
// @desc    Returns user information
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await User.findOne({ user: req.id });
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    try {
        //  See if user exists
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ errors: [{ msg: 'User already exists' }]});
        }
        user = new User({
            name,
            email,
            password
        });
        //  Encrypt password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        //  Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            });
        //  Sends response outward
    
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;