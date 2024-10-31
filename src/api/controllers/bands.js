const Band = require('../models/bands');
const Leader = require('../models/leaders');
const Style = require('../models/styles');



const getBands = async (req, res, next) => {
     try {
          const bands = await Band.find()
               .populate('leader', 'name image')
               .populate('style', 'name description');

          res.status(200).json(bands);
     } catch (error) {
          res.status(500).json({ error: 'Error al obtener las bandas', details: error.message });
     }
};


const postBand = async (req, res) => {
     try {
          const { name, image, leaderId, leaderName, styleId, styleName } = req.body;

          // 1. crea un nuevo leader con leaderName si aun no existe leaderId

          let leader;

          if (!leaderId && leaderName) {

               leader = await Leader.create({ name: leaderName, bandsId: [] });

          } else {

               leader = await Leader.findById(leaderId);
          }

          if (!leader) {
               return res.status(404).json({ error: 'Líder no encontrado' });
          }

          // 2. crea un nuevo style con styleName si aun no existe styleId

          let style;

          if (!styleId && styleName) {

               style = await Style.create({ name: styleName, bandsId: [], leadersId: [] });

          } else {

               style = await Style.findById(styleId);
          }

          if (!style) {
               return res.status(404).json({ error: 'Estilo no encontrado' });
          }

          const newBand = await Band.create({

               name,
               image,
               leaderId: leader._id,
               styleId: style._id
          });

          // 4. actualiza leader y style para evitar duplicados

          await Leader.findByIdAndUpdate(
               leader._id,
               { $addToSet: { bandsId: newBand._id } }
          );

          await Style.findByIdAndUpdate(
               style._id,
               {
                    $addToSet: {
                         bandsId: newBand._id,
                         leadersId: leader._id
                    }
               }
          );

     
          const populatedBand = await Band.findById(newBand._id)
               .populate('leader', 'name image')
               .populate('style', 'name description');

          res.status(201).json({
               message: 'banda añadida',
               populatedBand
          });
     } catch (error) {
          res.status(500).json({ error: 'Error al crear la banda', details: error.message });
     }
};

module.exports = {

     postBand,
     getBands
};