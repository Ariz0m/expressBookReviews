class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

const users = [];

module.exports = {
    addUser(username, password) {
       const userIndex = users.push(new User(username, password));
       return users[userIndex];
    },

    getUsers() {
        return users;
    }
};