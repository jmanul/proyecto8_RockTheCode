require('dotenv').config();
const express = require('express');
const { conectDDBB } = require('./src/config/db');


const bandsRouter = require('./src/api/routes/bands');
const leadersRouter = require('./src/api/routes/leaders');


const app = express();

app.use(express.json());

conectDDBB();

app.use('/api/v1/bands', bandsRouter);
app.use('/api/v1/leaders', leadersRouter);
                         

app.use('*', (req, res, next) => {
     
     return res.status(200).json('route not found 👽')

});

app.listen('3000', () => {

     console.log('listening on port http://localhost:3000 😎');

});

