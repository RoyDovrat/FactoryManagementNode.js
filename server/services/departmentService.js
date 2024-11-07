const depatmentRepository = require('../repositories/depatmentRepository');
const employeeRepository = require('../repositories/employeeRepository')

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

//Fetch departments with manager and employees details
const getDepartmentsWithEmployees = async () => {
  const departments = await getAllDepartments();
  const employees = await employeeRepository.getAllEmployees();

  const DepartmentsWithEmployees = departments.map(department => {

    // find manager for the department
    const manager = employees.find(emp => emp._id.toString() === department.Manager.toString());
    const managerName = manager ? `${manager.FirstName} ${manager.LastName}` : 'Unknown';

    // find employees who belong to this department
    const departmentEmployees = employees.filter(employee => employee.DepartmentID.toString() === department._id.toString());
    const employeesDetails = departmentEmployees.map(employee => ({
      employeeId: employee._id,
      employeeName :`${employee.FirstName} ${employee.LastName}`
    }));

    return {
      _id: department._id,
      Name: department.Name,
      managerName,
      employeesDetails
    };

  });
  return DepartmentsWithEmployees;
}

module.exports = {
    getAllDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment, 
    getDepartmentsWithEmployees
};
