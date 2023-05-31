const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { checkUser, checkDelivery, plannedDelivery, isDelivered, checkOrderData, middleware } = require('./utils');

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
// Borde vi använda användar id istället för username?
app.post('/api/beans/order', middleware, (req, res) => {
    const userID = req.body.userID;
    const date = new Date().toLocaleString();
    const newOrder = {
        orderNumber: uuidv4(),
        timeOfOrder: date,
        delivery: plannedDelivery(),
        order: req.body.order,
        totalPrice: res.locals.totalPrice
    }

    // Om gäst så kanske man bara ska ersätta ordern? Ska den tas bort sen?

    usersDB.update({ _id: userID }, { $push: { orders: newOrder } });

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
    const userID = req.body.userID;
    const [ user ] = await usersDB.find({ _id: userID });
    const responseObj = {
        message: 'Previous orders',
        orders: user.orders
    }

    res.json(responseObj);
});

// Hämta status för order
app.get('/api/beans/order/status', checkOrderData, async (req, res) => {
    const userID = req.body.userID;
    const orderNumber = req.body.orderNumber;
    const [ user ] = await usersDB.find({ _id: userID });
    let status = { message: 'No orders.' };

    // Kolla om user och user.orders finns
    if (user && user.orders) {
        user.orders.forEach(order => {
            if (order.orderNumber === orderNumber) {
                status.delivered = isDelivered(order);
                status.message = 'Order has been delivered.';
                
                if (!status.delivered) {
                    const minutes = checkDelivery(order);
                    status.message = `Will be delivered in ${minutes} min.`;
                }

            } else {
                status.message = 'The ordernumber does not exists.';
            }
        })
    } else {
        status.message = 'The username does not exists.';
    }
    
    res.json(status);
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});