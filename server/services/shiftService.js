const shiftRepository = require('../repositories/shiftRepository');

const getAllShift = (filters) => {
  return shiftRepository.getAllShift(filters);
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
    getShiftById,
    addShift,
    updateShift,
    deleteShift

};
