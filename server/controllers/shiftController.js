const shiftService = require('../services/shiftService');
const verifyToken = require('../middlewares/authMiddleware');

const express = require('express');
const router = express.Router();


// Entry point: http://localhost:3000/shifts

router.get('/', verifyToken, async (req, res) => {
  try {
      const { withEmployees } = req.query;
      let shiftsAndEmployees;

      if (withEmployees === 'true') {
          shiftsAndEmployees = await shiftService.getAllShiftsAndEmployees();
      } else {
          shiftsAndEmployees = await shiftService.getAllShift();
      }

      res.json(shiftsAndEmployees);
  } catch (error) {
      res.json(error);
  }
});


router.get('/:id', verifyToken, async (req, res) => {
  try {
    const {id} = req.params;
    const shift = await shiftService.getShiftById(id);
    res.json(shift);
  } catch (error) {
    res.json(error);
  }
});

router.post('/', verifyToken, async (req, res) => {

    try {
      const obj = req.body;
      const result = await shiftService.addShift(obj);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }

});

router.patch('/:id', verifyToken, async (req, res) => {

    try {
      const {id} = req.params;
      const obj = req.body;
      const result = await shiftService.updateShift(id, obj);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
 

});

router.delete('/:id', verifyToken, async (req, res) => {

  try {
    const {id} = req.params;
    const result = await shiftService.deleteShift(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
  
});

module.exports = router;
