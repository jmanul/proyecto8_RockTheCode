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

          console.log('Datos previos eliminados');


          const leaders = await Leader.insertMany(leadersData);
          const styles = await Style.insertMany(stylesData);


          for (let band of bandsData) {

               const leader = leaders.find(l => l.name === band.leaderId);
          
               const style = styles.find(s => s.name === band.styleId);

               if (leader && style) {
                    band.leaderId = leader._id;
                    band.styleId = style._id;
               }
          }

          await Band.insertMany(bandsData);

          console.log('Datos de bandas insertados');

     } catch (error) {

          console.error('Error al insertar datos de bandas', error);
     }
};

module.exports = seedBands;
