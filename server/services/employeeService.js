const employeeRepository = require('../repositories/employeeRepository');
const departmentRepository = require('../repositories/depatmentRepository');
const shiftRepository = require('../repositories/shiftRepository');
const employeeShiftRepository = require('../repositories/employeeShiftRepository')

const getAllEmployees = async (filters) => {
  return employeeRepository.getAllEmployees(filters);
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepository.getEmployeeById(id);
  const departments = await departmentRepository.getAllDepartments();
  const shifts = await shiftRepository.getAllShift();
  const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

  // Find department name for the employee
  const department = departments.find(dep => dep._id.toString() === employee.DepartmentID.toString());
  const departmentName = department ? department.Name : 'Unknown';

  // Find employee shifts
  const employeeShiftsId = employeesShifts.filter(es => es.EmployeeID.toString() === employee._id.toString()).map(es => es.ShiftID);;
  const employeeShiftsDate = employeeShiftsId.map(employeeShift => {
      const shift = shifts.find(s => s._id.toString() === employeeShift.toString());
      if (shift) {
        const date = new Date(shift.Date).toLocaleDateString('en-US');
        return `${date}, ${shift.StartingHour}:00 - ${shift.EndingHour}:00`;
      }
      return 'No shift info';
    });

    //console.log('employeeShiftsId', employeeShiftsId)
    //console.log('employeeShiftsDate', employeeShiftsDate)
/*
  const employeeData = {
    _id: employee._id, FirstName: employee.FirstName, LastName: employee.LastName, StartWorkYear: employee.StartWorkYear,
    //...employee,
    employeeDepartmentName: departmentName,
    employeeDepartmentId: employee.DepartmentID,
    employeeShiftsId,
    employeeShiftsDate,
    allDerpartments: departments,
    allShifts: shifts
  }
  console.log(employeeData)
  */
 
  

  return {
    _id: employee._id, FirstName: employee.FirstName, LastName: employee.LastName, StartWorkYear: employee.StartWorkYear,
    //...employee,
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


const getEmployeesWithDetails = async () => {
  try {
    
    const employees = await getAllEmployees();
    const departments = await departmentRepository.getAllDepartments();
    const shifts = await shiftRepository.getAllShift();
    const employeesShifts = await employeeShiftRepository.getAllEmployeeShift();

    const employeesDetails = employees.map(employee => {
    const employeeFullName = `${employee.FirstName} ${employee.LastName}`;

    // Find department name for the employee
    const department = departments.find(dep => dep._id.toString() === employee.DepartmentID.toString());
    const departmentName = department ? department.Name : 'Unknown';

    // Find employee shifts
    const employeeShiftsId = employeesShifts.filter(es => es.EmployeeID.toString() === employee._id.toString());
    const employeeShiftsDate = employeeShiftsId.map(employeeShift => {
      const shift = shifts.find(s => s._id.toString() === employeeShift.ShiftID.toString());
      if (shift) {
        const date = new Date(shift.Date).toLocaleDateString('en-US');
        return `${date}, ${shift.StartingHour}:00 - ${shift.EndingHour}:00`;
      }
      return 'No shift info';
    }).join('<br>');

      return {
        _id: employee._id,
        fullName: employeeFullName,
        departmentName: departmentName,
        departmentId: department ? department._id : null,
        shifts: employeeShiftsDate
      };
    });

    //console.log('Processed Employee Details:', employeesDetails);
    return employeesDetails;

  } catch (error) {
    //console.error('Error in getEmplyeesWithDetails:', error.message);
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
