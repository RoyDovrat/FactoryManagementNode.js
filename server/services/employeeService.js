const employeeRepository = require('../repositories/employeeRepository');
const departmentRepository = require('../repositories/depatmentRepository');
const shiftRepository = require('../repositories/shiftRepository');
const employeeShiftRepository = require('../repositories/employeeShiftRepository')

const fetchData = async () => {
  return {
    departments: await departmentRepository.getAllDepartments(),
    shifts: await shiftRepository.getAllShift(),
    employeesShifts: await employeeShiftRepository.getAllEmployeeShift(),
  };
};

const findDepartmentName = (departments, departmentId) => {
  const department = departments.find(dep => dep._id.toString() === departmentId.toString());
  const departmentName = department ? department.Name : 'Unknown';

  return { departmentId,departmentName}
};

const findEmployeeShifts = (shifts, employeesShifts, employeeId) => {
  if (!shifts || !employeesShifts || !employeeId) {
    return { employeeShiftsId: [], employeeShiftsDate: [] };
  }

  const employeeShiftsId = employeesShifts.filter(es => es.EmployeeID.toString() === employeeId.toString()).map(es => es.ShiftID);;
  const employeeShiftsDate = employeeShiftsId.map(employeeShift => {
      const shift = shifts.find(s => s._id.toString() === employeeShift.toString());
      if (shift) {
        const date = new Date(shift.Date).toLocaleDateString('en-US');
        return `${date}, ${shift.StartingHour}:00 - ${shift.EndingHour}:00`;
      }
      return 'No shift info';
    });

    return {employeeShiftsId, employeeShiftsDate}
}

const getAllEmployees = async (filters) => {
  return employeeRepository.getAllEmployees(filters);
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepository.getEmployeeById(id);

  const { departments, shifts, employeesShifts } = await fetchData();
  const {departmentName} = findDepartmentName(departments, employee.DepartmentID);
  const {employeeShiftsId, employeeShiftsDate} = findEmployeeShifts(shifts, employeesShifts, employee._id);


  return {
    _id: employee._id, 
    FirstName: employee.FirstName, 
    LastName: employee.LastName, 
    StartWorkYear: employee.StartWorkYear,
    employeeDepartmentName: departmentName,
    employeeDepartmentId: employee.DepartmentID,
    employeeShiftsId,
    employeeShiftsDate,
    allDerpartments: departments,
    allShifts: shifts,
    allEmployeesShifts: employeesShifts

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
        const {departmentId ,departmentName} = findDepartmentName(departments, employee.DepartmentID);
        const {employeeShiftsDate} = findEmployeeShifts(shifts, employeesShifts, employee._id);

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
