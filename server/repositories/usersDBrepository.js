const User = require('../models/userModel');

const getAllUsers = (filters) => {
  return User.find(filters);
};

const getUserById = (id) => {
  return User.findById(id);
};

const getUserByUsername = (username) => {
  return User.findOne({ FullName: username });
};

const addUser = (obj) => {
  const user = new User(obj);
  return user.save();
};

const updateUser = (id, obj) => {
  return User.findByIdAndUpdate(id, obj);
};

// Reset user's action count (at the end of the day)
const resetUserActions = (id, numOfActions) => {
  return User.findByIdAndUpdate(id, { NumOfActions: numOfActions });
};

const deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUser,
  resetUserActions,
  deleteUser
};