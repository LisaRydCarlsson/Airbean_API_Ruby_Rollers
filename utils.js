function checkUser(req, res, next) {
    const newUser = req.body;

    if (newUser.hasOwnProperty('username') && newUser.hasOwnProperty('password')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Wrong data properties.' });
    }
}

// Kollar om det gått 20 min
function checkDelivery(order) {
    const timestamp = order.date;

    const milliseconds = Date.now() - Date.parse(timestamp);
    const minutes = Math.floor(milliseconds / 60000);

    if (minutes < 20) {
        return false;
    } else {
        return true;
    }
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
    checkDelivery,
    plannedDelivery,
    isDelivered
}