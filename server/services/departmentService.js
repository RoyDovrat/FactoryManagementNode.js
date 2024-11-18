const depatmentRepository = require('../repositories/depatmentRepository');
const employeeRepository = require('../repositories/employeeRepository')
const employeeShiftRepository = require('../repositories/employeeShiftRepository')

const getAllDepartments = (filters) => {
  return depatmentRepository.getAllDepartments(filters);
};

const getDepartmentById = async (id) => {
  const department = await depatmentRepository.getDepartmentById(id);
  const employees = await employeeRepository.getAllEmployees();
  const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

  const manager = employees.find(emp => emp._id.toString() === department.Manager.toString());
  const managerName = manager ? `${manager.FirstName} ${manager.LastName}` : 'Unknown';

  const departmentEmployees = employees.filter(employee => employee.DepartmentID.toString() === id);
  const employeeIds = departmentEmployees.map(employee => employee._id.toString());

  return {
    _id: department._id,
    name: department.Name,
    managerId: department.Manager,
    managerName
  };
};

const addDepartment = (obj) => {
  return depatmentRepository.addDepartment(obj);
};

const updateDepartment = (id, obj) => {
  return depatmentRepository.updateDepartment(id, obj);
};

/*
const deleteDepartment = (id) => {
  return depatmentRepository.deleteDepartment(id);
};
*/

const deleteDepartment = async (id) => {
  const employees = await employeeRepository.getAllEmployees();
  const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

  const departmentEmployees = employees.filter(employee => employee.DepartmentID.toString() === id);
  const employeeIds = departmentEmployees.map(employee => employee._id.toString());

  // Delete employee shifts
  const shiftIdsToDelete = employeesShifts
      .filter(shift => employeeIds.includes(shift.EmployeeID.toString()))
      .map(shift => shift._id);

  await employeeShiftRepository.deleteMultipleEmployeeShifts(shiftIdsToDelete);

  // Delete employees in the department
  await Promise.all(departmentEmployees.map(employee => employeeRepository.deleteEmployee(employee._id)));

  // Delete the department itself
  await depatmentRepository.deleteDepartment(id);

  return { message: "Department and associated data deleted successfully." };
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
