const employeeService = require('../services/employeeService');
const verifyToken = require('../middlewares/authMiddleware');
const checkUserActionsLimit = require('../middlewares/actionsLimitMiddleware')

const express = require('express');
const router = express.Router();

// Entry point: http://localhost:3000/employees

router.get('/', verifyToken, async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees(); // URL: http://localhost:3000/employees
    res.json(employees);

  } catch (error) {
    res.json(error);
  }

});

router.get('/withDetails', verifyToken, checkUserActionsLimit, async (req, res) => {
  try {

    const { departmentId } = req.query;
    const employees = await employeeService.getEmployeesWithDetails(departmentId);

    const departmentSet = new Set();

    employees.forEach(emp => {
      departmentSet.add(JSON.stringify({
        departmentId: emp.departmentId,
        departmentName: emp.departmentName
      }));
    });

    // Convert the Set back to an array of objects
    const uniqueDepartments = Array.from(departmentSet).map(dept => JSON.parse(dept))

    res.json({ employees, uniqueDepartments });

  } catch (error) {
    res.status(500).json(error.message);
  }
});


router.get('/:id', verifyToken, async (req, res) => {

  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    res.json(employee);
  } catch (error) {
    res.json(error);
  }

});


router.post('/', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const obj = req.body;
    const result = await employeeService.addEmployee(obj);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }

});

router.patch('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await employeeService.updateEmployee(id, obj);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});

router.delete('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const { id } = req.params;
    console.log('in controller, id', id)
    const result = await employeeService.deleteEmployee(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});

module.exports = router;
