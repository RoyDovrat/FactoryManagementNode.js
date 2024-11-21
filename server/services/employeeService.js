const employeeRepository = require('../repositories/employeeRepository');
const departmentRepository = require('../repositories/departmentRepository');
const shiftRepository = require('../repositories/shiftRepository');
const employeeShiftRepository = require('../repositories/employeeShiftRepository')
const { findEmployeeShifts, findDepartmentNameById, findShiftIds, isEmployeeManager } = require('../utils/utils');

const fetchData = async () => {
  return {
    departments: await departmentRepository.getAllDepartments(),
    shifts: await shiftRepository.getAllShift(),
    employeesShifts: await employeeShiftRepository.getAllEmployeeShift(),
  };
};


const getAllEmployees = async (filters) => {
  return employeeRepository.getAllEmployees(filters);
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepository.getEmployeeById(id);

  const { departments, shifts, employeesShifts } = await fetchData();
  const { departmentName } = findDepartmentNameById(departments, employee.DepartmentID);
  const { employeeShiftsId, employeeShiftsDate } = findEmployeeShifts(shifts, employeesShifts, employee._id);


  return {
    _id: employee._id,
    FirstName: employee.FirstName,
    LastName: employee.LastName,
    StartWorkYear: employee.StartWorkYear,
    employeeDepartmentName: departmentName,
    employeeDepartmentId: employee.DepartmentID,
    employeeShiftsId,
    employeeShiftsDate,
    data: {
      allDerpartments: departments,
      allShifts: shifts
    }
  }

};

const checkEmployeeExists = async (obj) => {
  const existingEmployees = await getAllEmployees();

  return existingEmployees.some(emp =>
    emp.FirstName.toLowerCase() === obj.FirstName.toLowerCase() &&
    emp.LastName.toLowerCase() === obj.LastName.toLowerCase()
  );
}

const addEmployee = async (obj) => {
  const employeeExists = await checkEmployeeExists(obj);

  if (employeeExists) {
    throw new Error('Employee with the same name already exists.');
  }

  return employeeRepository.addEmployee(obj);
};

const updateEmployee = (id, obj) => {
  return employeeRepository.updateEmployee(id, obj);
};


const deleteEmployee = async (id) => {
  const { departments } = await fetchData();
  const isManager = await isEmployeeManager(departments, id);
  console.log('isManager', isManager)
  if (isManager) {
    throw new Error("This employee is a manager and cannot be deleted.");
}

  // delete employee shifts
  const { employeesShifts } = await fetchData();
  const employeeShiftToDelete = findShiftIds(employeesShifts, [id]);
  if (employeeShiftToDelete.length > 0) {
    await employeeShiftRepository.deleteMultipleEmployeeShifts(employeeShiftToDelete);
  }

  //delete employee
  await employeeRepository.deleteEmployee(id);

  return { message: "Employees and associated data deleted successfully." };
};


const getEmployeesWithDetails = async (departmentId) => {

  try {
    const employees = await getAllEmployees();
    const { departments, shifts, employeesShifts } = await fetchData();

    const employeesDetails = employees
      .filter(employee => !departmentId || employee.DepartmentID.toString() === departmentId) // Filter by departmentId if provided
      .map(employee => {
        const employeeFullName = `${employee.FirstName} ${employee.LastName}`;
        const { departmentId, departmentName } = findDepartmentNameById(departments, employee.DepartmentID);
        const { employeeShiftsDate } = findEmployeeShifts(shifts, employeesShifts, employee._id);

        return {
          _id: employee._id,
          fullName: employeeFullName,
          departmentName,
          departmentId,
          shifts: employeeShiftsDate
        };
      });

    return employeesDetails;

  } catch (error) {
    throw error;
  }
};


module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesWithDetails
};
