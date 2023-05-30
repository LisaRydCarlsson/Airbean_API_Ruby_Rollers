const fs = require('fs');
const { checkUser, checkDelivery, plannedDelivery, isDelivered } = require('./utils');

const express = require('express');
const app = express();
const PORT = 1337;

// Ska alla ligga i egen mapp?
const nedb = require('nedb-promise');
const menuDB = new nedb({ filename: 'menu.db', autoload: true });
const usersDB = new nedb({ filename: 'users.db', autoload: true });

app.use(express.json());

function createDB(filename, database) {
    const file = JSON.parse(fs.readFileSync(filename));

    file.items.forEach(item => {
        database.insert(item);
    });
}
// createDB('users.json', usersDB);
// createDB('menu.json', menuDB);

app.get('/api/beans', async (req, res) => {
    const menu = await menuDB.find({});
    res.json(menu);
});

// Skapa middleware som kollar om användaren är inloggad?
app.post('/api/beans/order', (req, res) => {
    const username = req.body.username;
    // const order = req.body.order;
    const date = new Date().toLocaleString();
    // const delivery = plannedDelivery();
    const newOrder = {
        orderNumber: username + date,
        date: date,
        delivery: plannedDelivery(),
        order: req.body.order
    }

    // usersDB.update({ username: username }, { $push: { orders: { order: order, date: date, orderNumber: username+date}  } });
    usersDB.update({ username: username }, { $push: { orders: newOrder } });

    res.json(newOrder);
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
});

// Hämta orderhistorik
app.get('/api/user/history', async (req, res) => {
    const username = req.body.username;
    const [ user ] = await usersDB.find({ username: username });
    const responseObj = {
        message: 'Previous orders',
        orders: user.orders
    }

    res.json(responseObj);
});

// Hämta status för order
app.get('/api/beans/order/status', async (req, res) => {
    const username = req.body.username;
    const orderNumber = req.body.orderNumber;
    const [ user ] = await usersDB.find({ username: username });
    let status = {};

    if (user.orders.length > 0) {
        user.orders.forEach(order => {
            if (order.orderNumber === orderNumber) {
                status.message = 'Ordernumber exists.'
                // status.delivered = checkDelivery(order);
                status.delivered = isDelivered(order);
            } else {
                status.message = 'The ordernumber does not exists.';
            }
        })
    }
    
    res.json(status);
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});