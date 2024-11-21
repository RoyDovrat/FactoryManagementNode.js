const findManagerNameById = (managerId, employees) => {
  const manager = employees.find(emp => emp._id.toString() === managerId.toString());
  return manager ? `${manager.FirstName} ${manager.LastName}` : 'Unknown';
};

const findShiftIds = (employeesShifts, employeeIds) => {
  return employeesShifts
    .filter(shift => employeeIds.includes(shift.EmployeeID.toString()))
    .map(shift => shift._id);
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

  return { employeeShiftsId, employeeShiftsDate }
}

const findDepartmentNameById = (departments, departmentId) => {
  const department = departments.find(dep => dep._id.toString() === departmentId.toString());
  const departmentName = department ? department.Name : 'Unknown';

  return { departmentId, departmentName }
};

const isEmployeeManager = async (departments, employeeId) => {
  return departments.some(department => department.Manager === employeeId);
};

module.exports = {
  findManagerNameById,
  findShiftIds,
  findEmployeeShifts,
  findDepartmentNameById,
  isEmployeeManager
};