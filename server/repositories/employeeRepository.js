const Employee = require('../models/employeeModel');

const getAllEmployees = (filters) => {
  return Employee.find(filters);
};

const getEmployeeById = (id) => {
  return Employee.findById(id);
};

const addEmployee = (obj) => {
  const employee = new Employee(obj);
  return employee.save();
};

const updateEmployee = (id, obj) => {
  return Employee.findByIdAndUpdate(id, obj);
};

// Delete
const deleteEmployee = (id) => {
  return Employee.findByIdAndDelete(id);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
