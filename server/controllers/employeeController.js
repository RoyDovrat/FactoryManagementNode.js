const employeeService = require('../services/employeeService');
const verifyToken = require('../middlewares/authMiddleware');

const express = require('express');
const router = express.Router();

// Entry point: http://localhost:3000/employees

router.get('/', verifyToken, async (req, res) => {

  try {

    const { details } = req.query;
    let employees;

    if (details === 'true') {
        
        employees = await employeeService.getEmployeesWithDetails(); // URL: http://localhost:3000/employees?details=true
    } else {
        
        employees = await employeeService.getAllEmployees(); // URL: http://localhost:3000/employees
    }
    res.json(employees);
  } catch (error) {
    res.json(error);
  }

});

router.get('/:id', verifyToken, async (req, res) => {
  
    try {
      const {id} = req.params;
      const employee = await employeeService.getEmployeeById(id);
      res.json(employee);
    } catch (error) {
      res.json(error);
    }

});


router.post('/', verifyToken, async (req, res) => {

    try {
      const obj = req.body;
      const result = await employeeService.addEmployee(obj);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }

});

router.patch('/:id', verifyToken, async (req, res)=> {

    try {
      const {id} = req.params;
      const obj = req.body;
      const result = await employeeService.updateEmployee(id, obj);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
 
});

router.delete('/:id', verifyToken, async (req, res) => {

    try {
      const {id} = req.params;
      const result = await employeeService.deleteEmployee(id);
      res.json(result);
    } catch (error) {
      res.json(error);
    }

});

module.exports = router;
