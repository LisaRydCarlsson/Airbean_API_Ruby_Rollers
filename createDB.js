const fs = require('fs');
const { join } = require('path');

function createDB(filename, database) {
    filename = join(__dirname, filename);
    const file = JSON.parse(fs.readFileSync(filename));

    file.items.forEach(item => {
        database.insert(item);
    });
}

module.exports = {
    createDB
}