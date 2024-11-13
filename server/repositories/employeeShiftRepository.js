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

/*
const deleteEmployeeShift = (id) => {
  return EmployeeShift.findByIdAndDelete(id);
};
*/
const deleteMultipleEmployeeShifts = (shiftIds) => {
  return EmployeeShift.deleteMany({ _id: { $in: shiftIds } }); //$in: match any document whose _id is in the shiftIds array
};

module.exports = {
    getAllEmployeeShift,
    getEmployeeShiftById,
    addEmployeeShift,
    updateEmployeeShift,
    deleteMultipleEmployeeShifts

};
