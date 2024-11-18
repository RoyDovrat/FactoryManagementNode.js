const usersDBrepository = require('../repositories/usersDBrepository');
const usersWSrepository = require('../repositories/usersWSrepository');

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
        _id: UserDB._id,
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

module.exports = { getAllUsersDetails };
