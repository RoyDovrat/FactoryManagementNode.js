const jf = require('jsonfile');

const FILE = 'data/usersActions.json';

const getUsersActions = () => {
    return jf.readFile(FILE);
};

const setUsersActions = (userAction) => {
    jf.writeFile(FILE, userAction);
};

module.exports = {
    getUsersActions,
    setUsersActions
};
