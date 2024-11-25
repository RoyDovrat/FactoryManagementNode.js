const departmentRepository = require('../repositories/departmentRepository');
const employeeRepository = require('../repositories/employeeRepository')
const employeeShiftRepository = require('../repositories/employeeShiftRepository')
const { findManagerNameById, findShiftIds } = require('../utils/utils');

const findEmployeesInDepartment = (departmentId, employees) => {
  return employees.filter(employee => employee.DepartmentID.toString() === departmentId.toString())};

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
  const departmentExists = await checkDepartmentExists(obj);
  if (departmentExists) {
    throw new Error('Department with the same name already exists.');
  }

  // find manager in employees, check if exists
  const employees = await employeeRepository.getAllEmployees();
  const manager = employees.find(emp => `${emp.FirstName} ${emp.LastName}` === obj.ManagerName);
  if (!manager) {
    throw new Error('Manager not found. Please ensure the name is correct.');
  }

  const newDepartment = await departmentRepository.addDepartment({
    Name: obj.Name,
    Manager: manager._id,
  });

  // update the manager's DepartmentID with the newly created department's _id
  await employeeRepository.updateEmployee(manager._id, { DepartmentID: newDepartment._id });

  return newDepartment;
};


const updateDepartment = async (id, obj) => {
  const department = await departmentRepository.getDepartmentById(id);

  if (!department) {
    throw new Error('Department not found.');
  }

  const employees = await employeeRepository.getAllEmployees();
  const newManager = employees.find(emp => emp._id.toString() === obj.Manager.toString());

  if (!newManager) {
    throw new Error('Manager not found.');
  }

  // update the previous manager's DepartmentID to null if the manager has changed
  if (department.Manager.toString() !== newManager._id.toString()) {
    await employeeRepository.updateEmployee(department.Manager, { DepartmentID: null });
  }

  // update the new manager's DepartmentID
  await employeeRepository.updateEmployee(newManager._id, { DepartmentID: id });

  return departmentRepository.updateDepartment(id, {
    Name: obj.Name,
    Manager: newManager._id
  });
};


const deleteDepartment = async (id) => {
  const employees = await employeeRepository.getAllEmployees();
  const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

  const departmentEmployees = findEmployeesInDepartment(id, employees);
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
    const departmentEmployees =  findEmployeesInDepartment(department._id, employees);
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
