const mongoose = require('mongoose');

const conectDDBB = async () => {
      
     try {

          await mongoose.connect(process.env.DDBB_URL);
          console.log('DDBB conectada 🤖🤖');
          
     } catch (error) {

          console.log('Ha sido imposible conectar 🫣');
          
     }
};

module.exports = { conectDDBB };