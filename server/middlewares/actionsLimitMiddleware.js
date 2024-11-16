const usersDBservice = require('../services/userDBservice');

const checkUserActionsLimit = async (req, res, next)  => {
   
    const userId = req.user.id;
    const user = await usersDBservice.getUserById(userId);

    if (user && user.RemainingAllowdActions > 0){

      console.log('before dec', user.RemainingAllowdActions)
      
      await usersDBservice.decrementUserActions(userId);

      const updatedUser = await usersDBservice.getUserById(userId);

      console.log('after dec', updatedUser.RemainingAllowdActions);
      
      next();

    }  else {
      res.status(403).json('Action limit reached. Try again tomorrow.');
    }

}

module.exports = checkUserActionsLimit;