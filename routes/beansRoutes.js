const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getMenu } = require('../menu/menu.js');
const { checkProperty, plannedDelivery, isDelivered, checkDelivery, orderValidation } = require('../utils.js');
const { updateUserOrders, findUsers } = require('../users/users.js');
const router = express.Router();

router.get('/api/beans', async (req, res) => {
    try {
        const menu = await getMenu();
        return res.json(menu);
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })
    }
});

// Skicka order
router.post('/api/beans/order', checkProperty('userID'), checkProperty('order'), orderValidation, async (req, res) => {
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
            updateUserOrders(userID, newOrder);
            return res.json(newOrder);
        } else {
            return res.status(400).json({ message: 'Cannot place an empty order.'});
        }
    } else {
        return res.status(404).json({ message: 'User not found.'});
    }

});

// Hämta status för order
router.get('/api/beans/order/status', checkProperty('userID'), checkProperty('orderNumber'), async (req, res) => {
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
        });
    } else {
        status.message = 'This user does not exists.';
    }
    
    return res.json(status);
});

module.exports = router;