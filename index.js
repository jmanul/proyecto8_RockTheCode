require('dotenv').config();
const express = require('express');
const { conectDDBB } = require('./src/config/db');


const app = express();

app.use(express.json());

conectDDBB();


app.use('*', (req, res, next) => {
     
     return res.status(200).json('route not found 👽')

});

app.listen('3000', () => {

     console.log('listening on port http://localhost:3000 😎');

});

