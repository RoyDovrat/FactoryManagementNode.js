const userService = require('../services/userService');
const verifyToken = require('../middlewares/authMiddleware');
const checkUserActionsLimit = require('../middlewares/actionsLimitMiddleware')

const express = require('express');
const router = express.Router();

// Entry point: http://localhost:3000/users

router.get('/', verifyToken, checkUserActionsLimit, async (req, res) => {
    try {
      const users = await userService.getAllUsersDetails(); 
      res.json(users);
  
    } catch (error) {
      res.json(error);
    }
  
  });

  module.exports = router;
  