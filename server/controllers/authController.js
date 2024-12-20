
const express = require('express');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const router = express.Router();
const SECRET_KEY = 'some_key';
const MAX_ACTIONS = 10;

// Entry Point: http://localhost:3000/auth

router.post('/login', async (req, res) => {
    const { username, email } = req.body;
    try {

        const allUsers = await userService.getAllUsersDetails();

        const matchedUser = allUsers.find(user => user.username === username && user.email === email);

        if (!matchedUser) {
            return res.status(401).json('Invalid username or email');
        }

        const token = jwt.sign({
            userDBid: matchedUser.UserDBid,
            externalUserId: matchedUser.externalUserId,
            fullName: matchedUser.name
        },
            SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, fullName: matchedUser.name });

    } catch (error) {
        console.log(error);
        res.status(500).json('Server error. Please try again later.');
    }
});

module.exports = router;
