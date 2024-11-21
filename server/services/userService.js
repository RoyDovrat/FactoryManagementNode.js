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
/*
const decrementUserActions = async (userId) => {
  const user = await usersDBrepository.getUserById(userId);
  if (user && user.RemainingAllowdActions > 0) {
    user.RemainingAllowdActions -= 1;
    return user.save();
  }
  return null; 
};

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


const decrementUserActions = async (user, externalUserId) => {
  user.RemainingAllowdActions -= 1;

  addUserActionToFile(user, externalUserId);

  return user.save();

};
*/
const addUserActionToFile = async (user, externalUserId) => {
  try {
    const usersActions = await userActionRepository.getUsersActions();

    // Ensure the external user entry is unique
    const existingAction = usersActions.actions.find(action => action.id === externalUserId);
    if (!existingAction) {
      const newUserAction = {
        id: externalUserId,
        maxAction: user.NumOfActions,
        actionsAllowd: user.RemainingAllowdActions,
      };

      usersActions.actions.push(newUserAction);
      await userActionRepository.setUsersActions(usersActions);

      console.log('Logged user action:', newUserAction);
    } else {
      console.log('Action already logged for this user.');
    }
  } catch (error) {
    console.error('Error in addUserActionToFile:', error.message);
    throw error;
  }
};

const decrementUserActions = async (userId) => {
  try {
    const user = await usersDBrepository.getUserById(userId);

    if (user.RemainingAllowdActions > 0) {
      const updatedUser = await usersDBrepository.updateUser(userId, {
        RemainingAllowdActions: user.RemainingAllowdActions - 1,
      });

      console.log(`Decremented actions for user ${user.FullName}. Remaining: ${updatedUser.RemainingAllowdActions}`);
      return updatedUser;
    } else {
      throw new Error('User has no remaining actions.');
    }
  } catch (error) {
    console.error('Error in decrementUserActions:', error.message);
    throw error;
  }
};


// get user from DB by id
const getUserById = (id) => {
  return usersDBrepository.getUserById(id);
};

module.exports = {
  resetDailyActions,
  getAllUsersDetails,
  decrementUserActions,
  getUserById,
  addUserActionToFile
};



