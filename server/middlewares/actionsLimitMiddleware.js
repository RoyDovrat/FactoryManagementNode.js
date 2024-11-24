
const userService = require('../services/userService');

const checkUserActionsLimit = async (req, res, next) => {
  const {userDBid, externalUserId} = req.user;

  try {
    const user = await userService.getUserById(userDBid);

    if (user && user.RemainingAllowdActions > 0) {
      console.log('before decrement:', user.RemainingAllowdActions);

      // decrement the user's remaining actions
      await userService.decrementUserActions(userDBid);

      const updatedUser = await userService.getUserById(userDBid);
      console.log('after decrement:', updatedUser.RemainingAllowdActions);

      // write the user's action to file
      await userService.addUserActionToFile(updatedUser, externalUserId);

      next();

    } else {
      res.status(403).json('Action limit reached. Try again tomorrow.');
    }
  } catch (error) {
    console.error('Error in action limit middleware:', error.message);
    res.status(500).json('Internal server error');
  }
};

module.exports = checkUserActionsLimit;




