const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    Name: String,
    Manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
  },
  { versionKey: false }
);

const Department = mongoose.model('department', departmentSchema);

module.exports = Department;