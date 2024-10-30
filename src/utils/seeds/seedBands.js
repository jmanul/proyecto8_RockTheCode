const mongoose = require('mongoose');
const Band = require('../../api/models/bands');
const Leader = require('../../api/models/leaders');
const Style = require('../../api/models/styles');
const bandsData = require('../../data/bands');
const stylesData = require('../../data/styles');
const leadersData = require('../../data/leaders');

const seedBands = async () => {

     try {
          
          await Band.deleteMany({});
           await Leader.deleteMany({});
           await Style.deleteMany({});

           console.log('Datos previos eliminados correctamente.');

       
           const leaders = await Leader.insertMany(leadersData);
           const styles = await Style.insertMany(stylesData);


          for (let band of bandsData) {

               const leader = leaders.find(l => l.name === band.leader);
               const style = styles.find(s => s.name === band.style);

               if (leader && style) {
                    band.leader = leader._id;
                    band.style = style._id;
               }
          }

          await Band.insertMany(bandsData);

          console.log('Datos de bandas insertados correctamente.');

     } catch (error) {

          console.error('Error al insertar datos de bandas:', error);
     }
};

module.exports = seedBands;
