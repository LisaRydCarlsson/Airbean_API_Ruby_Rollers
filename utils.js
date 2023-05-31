function createDB(filename, database) {
    const file = JSON.parse(fs.readFileSync(filename));

    file.items.forEach(item => {
        database.insert(item);
    });
}

function checkProperty(property) {
    return function(req, res, next) {
        if (req.body.hasOwnProperty(property)) {
            next();
        } else {
            res.status(400).json({ success: false, error: `Must have ${property} data.` });
        }
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
    checkProperty,
    checkDelivery,
    plannedDelivery,
    isDelivered,
    middleware
}