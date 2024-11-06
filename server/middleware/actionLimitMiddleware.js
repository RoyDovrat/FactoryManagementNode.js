const usersDBservice = require('../services/userDBservice');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'some_key';

const checkUserActionsLimit = async (req, res, next)  => {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json('No token provided');
    }

    jwt.verify(token, SECRET_KEY, async (err, data) => {

        if (err) {
            return res.status(500).json('Failed to authenticate token');
          }

          const userId = data.id;
          const user = await usersDBservice.getUserById(userId);

          if (user && user.RemainingAllowdActions > 0){
            console.log('before dec', user.RemainingAllowdActions)
            await usersDBservice.decrementUserActions(userId);
            console.log('after RemainingAllowdActions',user.RemainingAllowdActions)
            next();
          }  else {
            res.status(403).json('Action limit reached. Try again tomorrow.');
          }

    })
        
    

}

module.exports = checkUserActionsLimit;