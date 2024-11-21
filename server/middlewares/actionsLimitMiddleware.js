
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

const userService = require('../services/userService')

const checkUserActionsLimit = async (req, res, next)  => {
   
  const userDBid = req.user.userDBid;
  const externalUserId = req.user.externalUserId

  const user = await userService.getUserById(userDBid);

  if (user && user.RemainingAllowdActions > 0){

    console.log('before dec', user.RemainingAllowdActions)
    
    await userService.decrementUserActions(user, externalUserId);

    const updatedUser = await userService.getUserById(userDBid);

    console.log('after dec', updatedUser.RemainingAllowdActions);
    
    next();

  }  else {
    res.status(403).json('Action limit reached. Try again tomorrow.');
  }

}
  
module.exports = checkUserActionsLimit;
*/

const userService = require('../services/userService')

const checkUserActionsLimit = async (req, res, next) => {
  try {
    const userDBid = req.user.userDBid;
    const externalUserId = req.user.externalUserId;

    // Fetch and decrement user actions
    const updatedUser = await userService.decrementUserActions(userDBid);

    // Log user action only after a successful decrement
    await userService.addUserActionToFile(updatedUser, externalUserId);

    next();
  } catch (error) {
    console.error('Error in checkUserActionsLimit middleware:', error.message);

    if (error.message === 'User has no remaining actions.') {
      res.status(403).json({ message: 'Action limit reached. Try again tomorrow.' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = checkUserActionsLimit;
