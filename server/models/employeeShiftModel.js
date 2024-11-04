const mongoose = require('mongoose');

const employeeShiftsSchema = new mongoose.Schema(
  {
    EmployeeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    ShiftID: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }
  },
  { versionKey: false }
);

const EmployeeShift = mongoose.model('employeeShift', employeeShiftsSchema, 'employeeShifts');

module.exports = EmployeeShift;