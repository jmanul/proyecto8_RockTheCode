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

          console.log('Lideres y estilos insertados');

          // ahora que los datos de styles y leaders ya estan insertados y tienen un id asignado lo buscamos para asignarlo a los parametrso correspondientes de bandas antes de insertalas para asi tener hecha la relacion entre colecciones

          for (let band of bandsData) {

               const leaderIds = leaders.filter(l => band.leadersId.includes(l.name)).map(l => l._id);

               const style = styles.find(s => s.name === band.styleId);

               if (leaderIds && style) {

                    band.leadersId = leaderIds;
                    band.styleId = style._id;

               }

          }

          // inserta todas las bandas para poder acceder a sus ids y poder realizar la asociacion en las otras colecciones

          const insertedBands = await Band.insertMany(bandsData);

          console.log('Datos de bandas insertados');

          const leaderUpdates = [];
          const styleUpdates = [];

          for (const band of insertedBands) {

               // Agrega al array operación de actualización en bulkWrite para hacer la actualizacion de todos los líderes de una sola vez 

               band.leadersId.forEach(leaderId => {
                    leaderUpdates.push({
                         updateOne: {
                              filter: { _id: leaderId },
                              update: { $addToSet: { bandsId: band._id } }
                         }
                    });
               });

               // Agrega operación de actualización en bulkWrite para el estilos

               styleUpdates.push({
                    updateOne: {
                         filter: { _id: band.styleId },
                         update: { $addToSet: { bandsId: band._id } }
                    }

               });

          }

          // ejecuta de una vez las actualizaciones de los lideres y stilos que habia almacenado anteriormente en forma de objetos en los arrays

          await Leader.bulkWrite(leaderUpdates);
          await Style.bulkWrite(styleUpdates);

          console.log('Lideres y estilos actualizados');

     } catch (error) {

          console.error('Error al insertar datos de bandas', error);
     }
};

module.exports = seedBands;
