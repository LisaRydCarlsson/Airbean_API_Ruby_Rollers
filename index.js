const fs = require('fs');

const express = require('express');
const app = express();
const PORT = 1337;

// Ska alla ligga i egen mapp?
const nedb = require('nedb-promise');
const { userInfo } = require('os');
// Databas för kaffemenyn
const coffeeDB = new nedb({ filename: 'coffeMenu.db', autoload: true });
// Databas för users och ordrar kopplade till user. Om inte inloggad - lägg order under guest?
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

// Skapa middleware här som kollar om inloggad eller ej
app.post('/api/beans/order', (req, res) => {
    const order = req.body.order;
    const username = req.body.username;

    // Skriver en ny, vi vill att den ska uppdatera?
    usersDB.update({ username: username }, { $push: { orders: order } });

    res.json(order);
});

// Skapa konto
app.post('/api/signup', async (req, res) => {
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

    res.status(201).json(responseObj);
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});