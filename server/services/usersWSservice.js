const usersWSrepo = require('../repositories/usersWSrepository')

const getAllUsers = async () => {
    // data from WS
    const { data: usersWS } = await usersWSrepo.getAllUsers(); 
    return usersWS;
}
module.exports = { getAllUsers };