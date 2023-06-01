const { v4: uuidv4 } = require('uuid');
const { checkDelivery, plannedDelivery, isDelivered, orderValidation, checkProperty } = require('./utils.js');

const express = require('express');
const { getMenu } = require('./menu/menu.js');
const { updateUserOrder, findUsers, createUser } = require('./users/users.js');
const app = express();
const PORT = 1337;

app.use(express.json());

app.get('/api/beans', async (req, res) => {
    try {
        const menu = await getMenu();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' })
    }
});

// Skicka order
app.post('/api/beans/order', checkProperty('userID'), checkProperty('order'), orderValidation, async (req, res) => {
    const userID = req.body.userID;
    const date = new Date().toLocaleString();
    const newOrder = {
        orderNumber: uuidv4(),
        timeOfOrder: date,
        delivery: plannedDelivery(),
        order: req.body.order,
        totalPrice: res.locals.totalPrice
    }

    const [ user ] = await findUsers('_id', userID);

    if (user) {
        if (req.body.order.length > 0) {
            updateUserOrder(userID, newOrder);
            res.json(newOrder);
        } else {
            res.status(400).json({ message: 'Cannot place an empty order.'})
        }
    } else {
        res.status(404).json({ message: 'User not found.'});
    }

});

// Skapa konto
app.post('/api/user/signup', checkProperty('username'), checkProperty('password'), async (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        orders: []
    }
    let responseObj = {
        success: true,
        message: 'Signup ok.'
    }

    const users = await findUsers();

    users.forEach(user => {
        if (user.username === newUser.username) {
            responseObj.success = false;
            responseObj.message = 'User already exists.'
        }
    });

    if (responseObj.success) {
        createUser(newUser);
    }

    res.json(responseObj);
});

// Logga in
app.post('/api/user/login', checkProperty('username'), checkProperty('password'), async (req, res) => {
    const currentUser = req.body;
    let responseObj = {
        success: true,
        message: 'Login ok.'
    }

    const [ user ] = await findUsers('username', currentUser.username);
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

// Hämta orderhistorik, här behövs en orderValidation som kollar userID
app.get('/api/user/history', checkProperty('userID'), async (req, res) => {
    const userID = req.body.userID;
    const [ user ] = await findUsers('_id', userID);
    const responseObj = {
        message: 'Previous orders',
    }

    if (user) {
        responseObj.orders = user.orders;
        res.json(responseObj);
    } else {
        responseObj.message = 'Invalid userID.'
        res.status(400).json(responseObj);
    }

});

// Hämta status för order
app.get('/api/beans/order/status', checkProperty('userID'), checkProperty('orderNumber'), async (req, res) => {
    const userID = req.body.userID;
    const orderNumber = req.body.orderNumber;
    const [ user ] = await findUsers('_id', userID);
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
        status.message = 'This user does not exists.';
    }
    
    res.json(status);
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});