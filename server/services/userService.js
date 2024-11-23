const usersDBrepository = require('../repositories/usersDBrepository');
const usersWSrepository = require('../repositories/usersWSrepository');
const userActionRepository = require('../repositories/userActionRepository')

const getAllUsersDetails = async () => {
  try {
    const UsersDB = await usersDBrepository.getAllUsers();

    const externalUsersResponse = await usersWSrepository.getAllUsers();
    const externalUsers = externalUsersResponse.data;

    // combine data for each user
    const combinedUsers = UsersDB.map(UserDB => {
      const externalUser = externalUsers.find(user => user.name === UserDB.FullName);

      if (!externalUser) {
        console.log(`No matching external data for user: ${UserDB.FullName}`);
        return null;
      }

      return {
        UserDBid: UserDB._id,
        externalUserId: externalUser.id,
        username: externalUser.username,
        name: UserDB.FullName,
        email: externalUser.email,
        maxActionsAllowed: UserDB.NumOfActions,
        currentActionsAllowed: UserDB.RemainingAllowdActions,
      };
    });


    return combinedUsers.filter(user => user !== null); // filter out any unmatched users 
  } catch (error) {
    console.log(`Error in getAllUsersDetails: ${error.message}`);
    //throw error;
  }
};

// Reset user's action count (at the end of the day)
const resetDailyActions = async () => {
  try {
    const users = await usersDBrepository.getAllUsers();


    for (const user of users) {
      await usersDBrepository.updateUser(user._id, {
        RemainingAllowdActions: user.NumOfActions,
      });
    }

    console.log('Successfully reset daily actions for all users.');
  } catch (error) {
    console.error('Error resetting daily actions:', error.message);
  }
};

// Decrement remaining Num Of Actions after performing an action
const decrementUserActions = async (userId) => {
  try {
    const user = await usersDBrepository.getUserById(userId);
    if (user && user.RemainingAllowdActions > 0) {
      const RemainingAllowdActions = user.RemainingAllowdActions - 1;

      await usersDBrepository.updateUser(user._id, {
        RemainingAllowdActions
      });
    }
    console.log('Successfully decrement User Actions.');
  } catch (error) {
    console.error('Error resetting daily actions:', error.message);
  }

};

/*
const addUserActionToFile = async (user, externalUserId) => {
  const usersActions = await userActionRepository.getUsersActions();
  const newUserAction = {
    id: externalUserId,
    maxAction: user.NumOfActions,
    actionsAllowd: user.RemainingAllowdActions
  };
  usersActions.actions.push(newUserAction);
  userActionRepository.setUsersActions(usersActions);
  return newUserAction.id;
};

*/


// get user from DB by id
const getUserById = (id) => {
  return usersDBrepository.getUserById(id);
};

module.exports = {
  resetDailyActions,
  getAllUsersDetails,
  decrementUserActions,
  getUserById,
};



