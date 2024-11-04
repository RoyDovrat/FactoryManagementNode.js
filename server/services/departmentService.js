const depatmentRepository = require('../repositories/depatmentRepository');

const getAllDepartments = (filters) => {
  return depatmentRepository.getAllDepartments(filters);
};

const getDepartmentById = (id) => {
  return depatmentRepository.getDepartmentById(id);
};

const addDepartment = (obj) => {
  return depatmentRepository.addDepartment(obj);
};

const updateDepartment = (id, obj) => {
  return depatmentRepository.updateDepartment(id, obj);
};

const deleteDepartment = (id) => {
  return depatmentRepository.deleteDepartment(id);
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
};
