const EmployeeShift = require('../models/employeeShiftModel');

const getAllEmployeeShift = (filters) => {
  return EmployeeShift.find(filters);
};

const getEmployeeShiftById = (id) => {
  return EmployeeShift.findById(id);
};

const addEmployeeShift = (obj) => {
  const employeeShift = new EmployeeShift(obj);
  return employeeShift.save();
};

const updateEmployeeShift = (id, obj) => {
  return EmployeeShift.findByIdAndUpdate(id, obj);
};


const deleteEmployeeShift = (id) => {
  return EmployeeShift.findByIdAndDelete(id);
};

module.exports = {
    getAllEmployeeShift,
    getEmployeeShiftById,
    addEmployeeShift,
    updateEmployeeShift,
    deleteEmployeeShift

};
