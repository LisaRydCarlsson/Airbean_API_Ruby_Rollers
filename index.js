const fs = require('fs');

const express = require('express');
const app = express();
const PORT = 1337;

// Ska alla ligga i egen mapp?
const nedb = require('nedb-promise');
const { checkUser } = require('./utils');
const coffeeDB = new nedb({ filename: 'coffeMenu.db', autoload: true });
const usersDB = new nedb({ filename: 'users.db', autoload: true });

app.use(express.json());

function createDB(filename, database) {
    const file = JSON.parse(fs.readFileSync(filename));

    file.items.forEach(item => {
        database.insert(item);
    });
}
// createDB('users.json', usersDB);
// createDB('menu.json', coffeeDB);

app.get('/api/beans', async (req, res) => {
    const menu = await coffeeDB.find({});
    res.json(menu);
});

// Skapa middleware som kollar om användaren är inloggad?
app.post('/api/beans/order', (req, res) => {
    const order = req.body.order;
    const username = req.body.username;
    const date = new Date().toLocaleString();

    usersDB.update({ username: username }, { $push: { orders: { order: order, date: date } } });

    res.json(order);
});

// Skapa konto
app.post('/api/user/signup', checkUser, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let responseObj = {
        success: true,
        message: 'Signup ok.'
    }

    const users = await usersDB.find({});
    users.forEach(user => {
        if (user.username === username) {
            responseObj.success = false;
            responseObj.message = 'User already exists.'
        }
    });

    if (responseObj.success) {
        usersDB.insert({ username: username, password: password, orders: [] });
    }

    res.json(responseObj);
});

// Logga in
app.post('/api/user/login', checkUser, async (req, res) => {
    const currentUser = req.body;
    let responseObj = {
        success: true,
        message: 'Login ok.'
    }

    const [ user ] = await usersDB.find({ username: currentUser.username });
    if (user) {
        if (currentUser.password !== user.password) {
            responseObj.success = false;
            responseObj.message = 'Wrong password.'
        }
    } else {
        responseObj.success = false;
        responseObj.message = 'Wrong username.'
    }

    res.json(responseObj);
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});