const employeeShiftRepository = require('../repositories/employeeShiftRepository');

const getAllEmployeeShift = (filters) => {
  return employeeShiftRepository.getAllEmployeeShift(filters);
};

const getEmployeeShiftById = (id) => {
  return employeeShiftRepository.getEmployeeShiftById(id);
};

const addEmployeeShift = (obj) => {
  return employeeShiftRepository.addEmployeeShift(obj);
};

const updateEmployeeShift = (id, obj) => {
  return employeeShiftRepository.updateEmployeeShift(id, obj);
};

const deleteMultipleEmployeeShifts = (shiftIds) => {
  return employeeShiftRepository.deleteMultipleEmployeeShifts(shiftIds);
};

module.exports = {
    getAllEmployeeShift,
    getEmployeeShiftById,
    addEmployeeShift,
    updateEmployeeShift,
    deleteMultipleEmployeeShifts

};
