const Department = require('../models/departmentModel');

const getAllDepartments = (filters) => {
  return Department.find(filters);
};

const getDepartmentById = (id) => {
  return Department.findById(id);
};

const addDepartment = (obj) => {
  const department = new Department(obj);
  return department.save();
};

const updateDepartment = (id, obj) => {
  return Department.findByIdAndUpdate(id, obj);
};

const deleteDepartment = (id) => {
  return Department.findByIdAndDelete(id);
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
};
