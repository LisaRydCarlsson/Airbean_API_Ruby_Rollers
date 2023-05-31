function createDB(filename, database) {
    const file = JSON.parse(fs.readFileSync(filename));

    file.items.forEach(item => {
        database.insert(item);
    });
}


// function checkUser(req, res, next) {
//     const newUser = req.body;

//     if (newUser.hasOwnProperty('username') && newUser.hasOwnProperty('password')) {
//         next();
//     } else {
//         res.status(400).json({ success: false, error: 'Wrong data properties.' });
//     }
// }

// function checkOrderData(req, res, next) {
//     const order = req.body;

//     if (order.hasOwnProperty('userID') && order.hasOwnProperty('orderNumber')) {
//         next();
//     } else {
//         res.status(400).json({ success: false, error: 'Wrong data properties.' });
//     }
// }

function checkUsername(req, res, next) {
    const user = req.body;
    if (user.hasOwnProperty('username')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Must have username data.' });
    }
}

function checkPassword(req, res, next) {
    const user = req.body;
    if (user.hasOwnProperty('password')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Must have password data.' });
    }
}

function checkUserID(req, res, next) {
    const user = req.body;
    if (user.hasOwnProperty('userID')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Must have userID data.' });
    }
}

function checkOrderNumber(req, res, next) {
    const order = req.body;
    if (order.hasOwnProperty('orderNumber')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Must have orderNumber data.' });
    }
}

function checkOrder(req, res, next) {
    const order = req.body;
    if (order.hasOwnProperty('order')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Must have order data.' });
    }
}



function middleware(req, res, next) {
    res.locals.totalPrice = "Hej världen!";
    next();
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
    createDB,
    // checkUser,
    // checkOrderData,
    checkOrderNumber,
    checkPassword,
    checkUserID,
    checkUsername,
    checkDelivery,
    checkOrder,
    plannedDelivery,
    isDelivered,
    middleware
}