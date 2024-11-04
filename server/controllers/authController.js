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
        let user = await usersDBservice.getUserByUsername(username);

        if (!user) {
            // If user does not exist in MongoDB, create new 
            user = await usersDBservice.addUser({
                FullName: matchedUser.name,
                NumOfActions: MAX_ACTIONS
            });
        }

        const token = jwt.sign({ id: user.id, fullName: user.FullName }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, fullName: user.FullName });
        
    }
    catch(error){
        console.log(error);
        res.json('Server error. Please try again later.');
    }

});

module.exports = router;