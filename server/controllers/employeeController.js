const express = require('express');
const employeeService = require('../services/employeeService');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'some_key';

// Entry point: http://localhost:3000/employees

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
      const departmentId = req.query.departmentId;
      const filters = departmentId ? { DepartmentID: departmentId } : {};
      const employees = await employeeService.getAllEmployees(filters);
      res.json(employees); 
    } catch (error) {
      res.json(error);
    }
  });
});

router.get('/:id', async (req, res) => {
  
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
      const employee = await employeeService.getEmployeeById(id);
      res.json(employee);
    } catch (error) {
      res.json(error);
    }
  });
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
      const result = await employeeService.addEmployee(obj);
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
      const result = await employeeService.updateEmployee(id, obj);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

});

router.delete('/:id', async (req, res) => {

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
      const result = await employeeService.deleteEmployee(id);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

});

module.exports = router;
