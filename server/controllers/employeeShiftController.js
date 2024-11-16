const EmployeeShiftService = require('../services/employeeShiftService');
const verifyToken = require('../middlewares/authMiddleware');
const checkUserActionsLimit = require('../middlewares/actionsLimitMiddleware')

const express = require('express');
const router = express.Router();


// Entry point: http://localhost:3000/employeeShifts

router.get('/', verifyToken,checkUserActionsLimit, async (req, res) => {

    try {
      const filters = req.query;
      const employeeShift = await EmployeeShiftService.getAllEmployeeShift(filters);
      res.json(employeeShift);
    } catch (error) {
      res.json(error);
    }
  
});


router.get('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {
    
    try {
      const {id} = req.params;
      const employeeShift = await EmployeeShiftService.getEmployeeShiftById(id);
      res.json(employeeShift);
    } catch (error) {
      res.json(error);
    }
    
});

router.post('/', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const obj = req.body;
    const result = await EmployeeShiftService.addEmployeeShift(obj);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }

});

router.patch('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const {id} = req.params;
    const obj = req.body;
    const result = await EmployeeShiftService.updateEmployeeShift(id, obj);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});


router.delete('/', verifyToken, async (req, res) => {

  try {
    const {shiftIds} = req.body;
    const result = await EmployeeShiftService.deleteMultipleEmployeeShifts(shiftIds);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});


module.exports = router;
