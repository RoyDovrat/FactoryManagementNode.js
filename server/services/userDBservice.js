const userRepository = require('../repositories/usersDBrepository');

const getAllUsers = (filters) => {
  return userRepository.getAllUsers(filters);
};


const getUserById = (id) => {
  return userRepository.getUserById(id);
};

// Get user by username (for login)
const getUserByUsername = (username) => {
  return userRepository.getUserByUsername(username);
};

const addUser = (userObj) => {
  return userRepository.addUser(userObj);
};

// Update user details (for NumOfActions)
const updateUser = (id, userObj) => {
  return userRepository.updateUser(id, userObj);
};

// Decrement NumOfActions after performing an action
const decrementUserActions = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (user && user.NumOfActions > 0) {
    user.NumOfActions -= 1;
    await user.save();
    return user;
  }
  return null; 
};

// Reset user's action count (at the end of the day)
const resetUserActions = (userId, numOfActions) => {
  return userRepository.resetUserActions(userId, numOfActions);
};


const deleteUser = (id) => {
  return userRepository.deleteUser(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUser,
  decrementUserActions,
  resetUserActions,
  deleteUser
};