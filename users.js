const fs = require('fs');
const nedb = require('nedb-promise');
const usersDB = new nedb({ filename: 'users.db', autoload: true });
const { createDB } = require('./utils')

// createDB('users.json', menuDB);

function updateUserOrder(userID, newOrder) {
    usersDB.update({ _id: userID }, { $push: { orders: newOrder } });
}

function createUser(newUser) {
    usersDB.insert(newUser);
}

async function findUsers(property, value) {
    // const users = await usersDB.find({ property: value });
    // return users;
    const query = {};
    query[property] = value;
    const users = await usersDB.find(query);
    return users;
}

module.exports = {
    updateUserOrder,
    createUser,
    findUsers
}