const userActionRepository = require('../repositories/userActionRepository');

const getAllAction = () => {
  return userActionRepository.getUsersActions();
};

const addUserAction = async (action) => {
  const data = await getAllAction();
  data.actions.push(action);
  userActionRepository.setUsersActions(data);
  return data.id;
};

module.exports = {
    getAllAction,
    addUserAction
};
