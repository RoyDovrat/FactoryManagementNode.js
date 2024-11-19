const employeeRepository = require('../repositories/employeeRepository');
const departmentRepository = require('../repositories/departmentRepository');
const shiftRepository = require('../repositories/shiftRepository');
const employeeShiftRepository = require('../repositories/employeeShiftRepository')
const { findEmployeeShifts, findDepartmentNameById } = require('../utils/utils');

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
  const { departmentName } = findDepartmentName(departments, employee.DepartmentID);
  const { employeeShiftsId, employeeShiftsDate } = findEmployeeShifts(shifts, employeesShifts, employee._id);


  return {
    _id: employee._id,
    FirstName: employee.FirstName,
    LastName: employee.LastName,
    StartWorkYear: employee.StartWorkYear,
    //employeeDepartmentName: departmentName,
    employeeDepartmentId: employee.DepartmentID,
    employeeShiftsId,
    employeeShiftsDate,
    data: {
      allDerpartments: departments,
      allShifts: shifts,
      allEmployeesShifts: employeesShifts
    }


  }

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
