function checkUser(req, res, next) {
    const newUser = req.body;

    if (newUser.hasOwnProperty('username') && newUser.hasOwnProperty('password')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Wrong data properties.' });
    }
}

function checkOrderStatus(req, res, next) {
    const order = req.body;

    if (order.hasOwnProperty('userID') && order.hasOwnProperty('orderNumber')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Wrong data properties.' });
    }
}

// Kollar hur lång tid det är kvar
function checkDelivery(order) {
    const timestamp = order.delivery;

    const milliseconds = Date.parse(timestamp) - Date.now();
    const minutes = Math.floor(milliseconds / 60000);

    return minutes;
}

// Kollar diff mellan leveranstid och nu
function isDelivered(order) {
    const diff = Date.parse(order.delivery) - Date.now();
    if (diff > 0) {
        return false;
    } else {
        return true;
    }
}

// Skapar leveranstid
function plannedDelivery() {
    const delivery = new Date(Date.now() + (20 * 60 * 1000)).toLocaleString();
    return delivery;
}

module.exports = {
    checkUser,
    checkOrderStatus,
    checkDelivery,
    plannedDelivery,
    isDelivered
}