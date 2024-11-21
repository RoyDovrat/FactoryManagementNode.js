const departmentRepository = require('../repositories/departmentRepository');
const employeeRepository = require('../repositories/employeeRepository')
const employeeShiftRepository = require('../repositories/employeeShiftRepository')
const { findManagerNameById, findShiftIds } = require('../utils/utils');

const getAllDepartments = (filters) => {
  return departmentRepository.getAllDepartments(filters);
};

const getDepartmentById = async (id) => {
  const department = await departmentRepository.getDepartmentById(id);
  const employees = await employeeRepository.getAllEmployees();

  const managerName = findManagerNameById(department.Manager, employees);

  return {
    _id: department._id,
    name: department.Name,
    managerId: department.Manager,
    managerName
  };
};


const checkDepartmentExists = async (obj) => {
  const existingEmployees = await getAllDepartments();

  return existingEmployees.some(dep =>
    dep.Name.toLowerCase() === obj.Name.toLowerCase() 
  );
}

const addDepartment = async (obj) => {
  const DepartmentExists = await checkDepartmentExists(obj);

  if (DepartmentExists) {
    throw new Error('Department with the same name already exists.');
  }

  return departmentRepository.addDepartment(obj);
};

/*
const addDepartment = (obj) => {
  return departmentRepository.addDepartment(obj);
};
*/


const updateDepartment = (id, obj) => {
  return departmentRepository.updateDepartment(id, obj);
};

const deleteDepartment = async (id) => {
  const employees = await employeeRepository.getAllEmployees();
  const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

  const departmentEmployees = employees.filter(employee => employee.DepartmentID.toString() === id);
  const employeeIds = departmentEmployees.map(employee => employee._id.toString());

  // Delete employee shifts
  const shiftIdsToDelete = findShiftIds(employeesShifts, employeeIds);

  await employeeShiftRepository.deleteMultipleEmployeeShifts(shiftIdsToDelete);

  // Delete employees in the department
  await Promise.all(departmentEmployees.map(employee => employeeRepository.deleteEmployee(employee._id)));

  // Delete the department itself
  await departmentRepository.deleteDepartment(id);

  return { message: "Department and associated data deleted successfully." };
};

//Fetch departments with manager and employees details
const getDepartmentsWithEmployees = async () => {
  const departments = await getAllDepartments();
  const employees = await employeeRepository.getAllEmployees();

  const DepartmentsWithEmployees = departments.map(department => {
    const managerName = findManagerNameById(department.Manager, employees)

    // find employees who belong to this department
    const departmentEmployees = employees.filter(employee => employee.DepartmentID.toString() === department._id.toString());
    const employeesDetails = departmentEmployees.map(employee => ({
      employeeId: employee._id,
      employeeName: `${employee.FirstName} ${employee.LastName}`
    }));

    return {
      _id: department._id,
      Name: department.Name,
      manager: {
        managerName,
        managerId: department.Manager
      },

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
