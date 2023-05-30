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
    const minutes = Math.floor(parseInt(milliseconds) / 60000);

    if (minutes < 20) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    checkUser,
    checkDelivery
}