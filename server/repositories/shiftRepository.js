const Shift = require('../models/shiftModel');

const getAllShift = (filters) => {
  return Shift.find(filters);
};

const getShiftById = (id) => {
  return Shift.findById(id);
};

const addShift = (obj) => {
  const shift = new Shift(obj);
  return shift.save();
};

const updateShift = (id, obj) => {
  return Shift.findByIdAndUpdate(id, obj);
};

// Delete
const deleteShift = (id) => {
  return Shift.findByIdAndDelete(id);
};

module.exports = {
    getAllShift,
    getShiftById,
    addShift,
    updateShift,
    deleteShift

};
