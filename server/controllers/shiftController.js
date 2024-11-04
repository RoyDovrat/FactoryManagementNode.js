const express = require('express');
const shiftService = require('../services/shiftService');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'some_key';

// Entry point: http://localhost:3000/shifts

router.get('/', async (req, res) => {
  
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(500).json('Failed to authenticate token');
    }

    try {
      const filters = req.query;
      const shifts = await shiftService.getAllShift(filters);
      res.json(shifts);
    } catch (error) {
      res.json(error);
    }
  });
});


router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const shift = await shiftService.getShiftById(id);
    res.json(shift);
  } catch (error) {
    res.json(error);
  }
});

router.post('/', async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(500).json('Failed to authenticate token');
    }

    try {
      const obj = req.body;
      const result = await shiftService.addShift(obj);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

});

router.patch('/:id', async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(500).json('Failed to authenticate token');
    }

    try {
      const {id} = req.params;
      const obj = req.body;
      const result = await shiftService.updateShift(id, obj);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

});

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const result = await shiftService.deleteShift(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
