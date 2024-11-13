const shiftRepository = require('../repositories/shiftRepository');
const employeeRepository = require('../repositories/employeeRepository');

const getAllShift = (filters) => {
  return shiftRepository.getAllShift(filters);
};

const getAllShiftsAndEmployees = async () => {
  const shifts = await getAllShift();
  const employees = await employeeRepository.getAllEmployees();

  return {
    allShifts: shifts,
    allEmployees: employees
  };
};

const getShiftById = (id) => {
  return shiftRepository.getShiftById(id);
};

const addShift = (obj) => {
  return shiftRepository.addShift(obj);
};

const updateShift = (id, obj) => {
  return shiftRepository.updateShift(id, obj);
};

const deleteShift = (id) => {
  return shiftRepository.deleteShift(id);
};

module.exports = {
    getAllShift,
    getAllShiftsAndEmployees,
    getShiftById,
    addShift,
    updateShift,
    deleteShift

};
