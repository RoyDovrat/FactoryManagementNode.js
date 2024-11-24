
const jf = require('jsonfile');

const FILE = 'data/usersActions.json';

const getUsersActions = async () => {
    return await jf.readFile(FILE);
};

const setUsersActions = async (userAction) => {
    await jf.writeFile(FILE, userAction);
};



module.exports = {
    getUsersActions,
    setUsersActions,

};
