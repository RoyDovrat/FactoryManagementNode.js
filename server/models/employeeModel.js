const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    NumOfActions: Number,
    StartWorkYear: Number,
    DepartmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
  },
  { versionKey: false }
);

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;