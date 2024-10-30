
require("dotenv").config();
const mongoose = require('mongoose');
const seedBands = require('./seedBands');


const seedData = async () => {
     try {
       
          await mongoose.connect(process.env.DDBB_URL);
          console.log('Conectado a la base de datos.');

          await seedBands();

          console.log('Seeding completado.');

     } catch (error) {

          console.error('Error en el seeding:', error);

     } finally {

          await mongoose.disconnect();
          console.log('Conexión cerrada.');
     }
};

seedData();
