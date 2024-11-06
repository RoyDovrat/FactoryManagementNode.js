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


const updateUser = (id, userObj) => {
  return userRepository.updateUser(id, userObj);
};

// Decrement remaining Num Of Actions after performing an action
const decrementUserActions = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (user && user.RemainingAllowdActions > 0) {
    user.RemainingAllowdActions -= 1;
    return user.save();
  }
  return null; 
};

// Reset user's action count (at the end of the day)
const resetUserActions = async () => {
  const users = await getAllUsers();
  const resetUsersActions = users.map(user => {
    user.RemainingAllowdActions = user.NumOfActions;
    return user.save();
  });
  return resetUsersActions;;
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