function checkUser(req, res, next) {
    const newUser = req.body;

    if (newUser.hasOwnProperty('username') && newUser.hasOwnProperty('password')) {
        next();
    } else {
        res.status(400).json({ success: false, error: 'Wrong data properties.' });
    }
}

module.exports = {
    checkUser
}