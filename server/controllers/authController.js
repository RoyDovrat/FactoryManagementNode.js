/*
const express = require('express');
const jwt = require('jsonwebtoken');
const usersWSservice = require('../services/usersWSservice');
const usersDBservice = require('../services/userDBservice');

const router = express.Router();
const SECRET_KEY = 'some_key';
const MAX_ACTIONS = 10;
//change to environment variable key??????????????????

// Entry Point: http://localhost:3000/auth

router.post('/login', async (req, res) => {
    const { username, email } = req.body;
    try {

        const externalUsers = await usersWSservice.getAllUsers();
        const matchedUser = externalUsers.find(user => user.username === username && user.email === email);

        if (!matchedUser) {
            return res.status(401).json('Invalid username or email' );
        }

        // Check if the user exists in the MongoDB
        let userDB = await usersDBservice.getUserByUsername(matchedUser.name);

        if (!userDB) {
            // If user does not exist in MongoDB, create new 
            userDB = await usersDBservice.addUser({
                FullName: matchedUser.name,
                NumOfActions: MAX_ACTIONS,
                RemainingAllowdActions: MAX_ACTIONS
            });
        }

        const token = jwt.sign({ id: userDB._id, fullName: matchedUser.name }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, fullName: matchedUser.name });

    } catch(error){
        console.log(error);
        res.json('Server error. Please try again later.');
    }

});

module.exports = router; 
*/

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

        const token = jwt.sign({ id: matchedUser._id, fullName: matchedUser.name }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, fullName: matchedUser.name });

    } catch (error) {
        console.log(error);
        res.status(500).json('Server error. Please try again later.');
    }
});

module.exports = router;
