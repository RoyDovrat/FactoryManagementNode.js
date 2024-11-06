const usersDBservice = require('../services/userDBservice');

const checkUserActions = async (req, res, next) => {
    
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
            await usersDBservice.decrementUserActions(userId);
            next();
          }  else {
            res.status(403).json('Action limit reached. Try again tomorrow.');
          }
        
      });
    
}