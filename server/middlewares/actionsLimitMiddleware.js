
/*
const checkUserActionsLimit = async (req, res, next)  => {
   
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (user && user.RemainingAllowdActions > 0){

      console.log('before dec', user.RemainingAllowdActions)
      
      await userService.decrementUserActions(userId);

      const updatedUser = await userService.getUserById(userId);

      console.log('after dec', updatedUser.RemainingAllowdActions);
      
      next();

    }  else {
      res.status(403).json('Action limit reached. Try again tomorrow.');
    }

}
    module.exports = checkUserActionsLimit;
    */
/*
const userService = require('../services/userService')

const checkUserActionsLimit = async (req, res, next) => {

 const { userDBid, externalUserId } = req.user;

  const user = await userService.getUserById(userDBid);

  if (user && user.RemainingAllowdActions > 0) {

    console.log('before dec', user.RemainingAllowdActions)

    await userService.decrementUserActions(user, externalUserId);

    const updatedUser = await userService.getUserById(userDBid);

    console.log('after dec', updatedUser.RemainingAllowdActions);

    next();

  } else {
    res.status(403).json('Action limit reached. Try again tomorrow.');
  }

}

module.exports = checkUserActionsLimit;
*/




const userService = require('../services/userService');

const checkUserActionsLimit = async (req, res, next) => {
  const {userDBid} = req.user;

  try {
    const user = await userService.getUserById(userDBid);

    if (user && user.RemainingAllowdActions > 0) {
      console.log('before decrement:', user.RemainingAllowdActions);

      // Decrement the user's remaining actions
      await userService.decrementUserActions(userDBid);

      const updatedUser = await userService.getUserById(userDBid);
      console.log('after decrement:', updatedUser.RemainingAllowdActions);

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




