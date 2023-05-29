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

function createMenu() {
    const coffees = JSON.parse(fs.readFileSync('menu.json'));

    coffees.menu.forEach(product => {
        coffeeDB.insert({ product });
    });
}
// createMenu();

app.get('/api/beans', async (req, res) => {
    const menu = await coffeeDB.find({});
    res.json(menu);
});

// Skapa middleware här
app.post('/api/beans/order', (req, res) => {
    const order = req.body;

    usersDB.insert(order);

    res.json(order)
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});