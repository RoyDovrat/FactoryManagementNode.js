const departmentsService = require('../services/departmentService');
const verifyToken = require('../middlewares/authMiddleware');
const checkUserActionsLimit = require('../middlewares/actionsLimitMiddleware')

const express = require('express');
const router = express.Router();


// Entry point: http://localhost:3000/departments

router.get('/', verifyToken, async (req, res) => {

  try {

    const departments = await departmentsService.getAllDepartments(); // URL: http://localhost:3000/departments
    res.json(departments);

  } catch (error) {
    res.json(error);
  }

});

router.get('/withDetails', verifyToken, checkUserActionsLimit, async (req, res) => {
  try {

    departments = await departmentsService.getDepartmentsWithEmployees();

    res.json(departments);

  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const { id } = req.params;
    const department = await departmentsService.getDepartmentById(id);
    res.json(department);
  } catch (error) {
    res.json(error);
  }

});



router.post('/', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const obj = req.body;
    const result = await departmentsService.addDepartment(obj);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

router.patch('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await departmentsService.updateDepartment(id, obj);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});

router.delete('/:id', verifyToken, checkUserActionsLimit, async (req, res) => {

  try {
    const { id } = req.params;
    const result = await departmentsService.deleteDepartment(id);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

});

module.exports = router;
