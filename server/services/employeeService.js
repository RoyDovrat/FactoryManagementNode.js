const employeeRepository = require('../repositories/employeeRepository');

const getAllEmployees = async (filters) => {
  const employees = await employeeRepository.getAllEmployees(filters);

  return employees.map(emp => ({
    ...emp.toObject(), 
    fullName: `${emp.FirstName} ${emp.LastName}`
  }));
};

const getEmployeeById = (id) => {
  return employeeRepository.getEmployeeById(id);
};

const addEmployee = (obj) => {
  return employeeRepository.addEmployee(obj);
};

const updateEmployee = (id, obj) => {
  return employeeRepository.updateEmployee(id, obj);
};

const deleteEmployee = (id) => {
  return employeeRepository.deleteEmployee(id);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
