const express = require('express');

const beansRoutes = require('./routes/beansRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();
const PORT = 1337;

app.use(express.json());
app.use(beansRoutes);
app.use(userRoutes);


app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
