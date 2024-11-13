const Band = require('../models/bands');
const Leader = require('../models/leaders');
const Style = require('../models/styles');



const getBands = async (req, res, next) => {

     try {
          const bands = await Band.find()
               .populate('leadersId', 'name image')
               .populate('styleId', 'name description');

          res.status(200).json(bands);

     } catch (error) {
          res.status(500).json({ error: 'Error al obtener las bandas', details: error.message });
     }
};

const getbandById = async (req, res, next) => {

     try {
          const { id } = req.params;
          const band = await Band.findById(id).populate('leadersId', 'name image').populate('styleId', 'name description');

          if (!band) {
               return res.status(404).json({ message: 'banda no encontrada' });
          }

          res.status(200).json(band);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener la banda', details: error.message });
     }
}

const getVerifiedBands = async (req, res, next) => {

     try {

          const verifiedBands = await Band.find({ isVerified: true });

          res.status(200).json(verifiedBands);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener las bandas verificadas', details: error.message });
     }
};


const postBand = async (req, res, next) => {

     try {
          const { name, image, leadersId = [], leaderNames = [], styleId, styleName, ...rest } = req.body;

          const existingBand = await Band.findOne({ name });

          if (existingBand) {
               return res.status(400).json({ error: `La banda ${name} ya existe` });
          }

          // si enviamos leaderName  y no leaderId, busca un lider por su nombre o crea un nuevo lider con leaderName si no existe, despues lo introduce en el array de liders en cualquier caso

          const leadersArray = [];

          if (leaderNames.length > 0) {
              
               for (let leaderName of leaderNames) {
                    const leader = await Leader.findOneAndUpdate(
                         { name: leaderName },
                         { name: leaderName },
                         { new: true, upsert: true }
                    );
                    leadersArray.push(leader._id);
               }
          } else if (leadersId.length > 0) {
         
               for (let leaderId of leadersId) {

                    const leader = await Leader.findById(leaderId);

                    if (leader) {

                         leadersArray.push(leader._id);
                    }
               }
          }

     
          if (leadersArray.length === 0) {
               return res.status(404).json({ error: 'Se requiere al menos un lider' });
          }

          //   si enviamos styleName en lugar de styleId buscara el stilo por el nombre y si no existe lo creara 

          let style;

          if (styleName) {
               style = await Style.findOneAndUpdate(
                    { name: styleName },
                    { name: styleName },
                    { new: true, upsert: true }
               );
          } else if (styleId) {
               style = await Style.findById(styleId);
          }

          if (!style) {
               return res.status(404).json({ error: 'Estilo necesario' });
          }

        
          const newBand = await Band.create({
               name,
               image,
               styleId: style._id,
               leadersId: leadersArray,  
               isVerified: false,
               ...rest
          });

          // Actualiza los arrays de bandsId en cada lider y estilo

          await Leader.updateMany(
               { _id: { $in: leadersArray } },
               { $addToSet: { bandsId: newBand._id } }
          );

          await Style.findByIdAndUpdate(
               style._id,
               {
                    $addToSet: {
                         bandsId: newBand._id,
                         leadersId: { $each: leadersArray } 
                    }
               }
          );

          const populatedBand = await Band.findById(newBand._id)
               .populate('leadersId', 'name')
               .populate('styleId', 'name description');

          res.status(201).json({
               message: 'Banda añadida',
               populatedBand
          });
     } catch (error) {
          res.status(500).json({ error: 'Error al crear la banda', details: error.message });
     }
};


const putBand = async (req, res, next) => {

     try {
          const { id } = req.params;
          const { name, image, leaderId, leaderName, styleId, styleName, ...rest } = req.body;

          const band = await Band.findById(id);

          if (!band) {
               return res.status(404).json({ message: 'Banda no encontrada' });
          }

          const existingBandName = await Band.findOne({ name });

          if (existingBandName) {
               return res.status(409).json({ error: `${name} ya existe` });
          }

          // TODO: añadir codigo para subir image

          band.name = name || band.name;
          band.image = image || band.image;

          let leader = band.leadersId;

          if (leaderName) {

               leader = await Leader.findOneAndUpdate(
                    { name: leaderName },
                    { name: leaderName },
                    { new: true, upsert: true }
               );

          } else if (leaderId) {

               leader = await Leader.findById(leaderId);
          }

          let style = band.styleId;

          if (styleName) {

               style = await Style.findOneAndUpdate(
                    { name: styleName },
                    { name: styleName },
                    { new: true, upsert: true }
               );

          } else if (styleId) {

               style = await Style.findById(styleId);
          }


          band.styleId = style;
          // band.leaderId = leader; 

          await Band.findByIdAndUpdate(
               id,
               {
                    $addToSet: {
                         leadersId: leader
                    }
               }
          );

          Object.assign(band, rest);
          await band.save();

          await Leader.findByIdAndUpdate(
               leader._id,
               { $addToSet: { bandsId: band._id } }
          );

          await Style.findByIdAndUpdate(
               style._id,
               {
                    $addToSet: {
                         bandsId: band._id,
                         leadersId: leader._id
                    }
               }
          );

          const populatedBand = await Band.findById(band._id)
               .populate('leadersId', 'name image')
               .populate('styleId', 'name description');

          res.status(200).json(populatedBand);

     } catch (error) {

          res.status(500).json({ error: 'Error al actualizar la banda', details: error.message });
     }
};


const deleteBand = async (req, res, next) => {
     try {
          const { id } = req.params;

          const band = await Band.findById(id);

          if (!band) {
               return res.status(404).json({ message: 'Banda no encontrada' });
          }


          await Band.findByIdAndDelete(id);

          // buscamos el lider de la banda por el id y actualizamos su array de bandas, eliminando la referencia a la banda

          if (band.leadersId) {
               await Leader.updateMany({bandsId : id}, { $pull: { bandsId: id } });
          }

          // buscamos el estilo de la banda por el id y actualizamos su array de bandas y el de líderes, eliminando las referencias de cada uno a la banda

          if (band.styleId) {
               await Style.findByIdAndUpdate(band.styleId, {
                    $pull: {
                         bandsId: id,
                         leadersId: band.leadersId //todo: hacer lo mismompara los lideres de styles
                    }
               });
          }


          res.status(200).json({ message: 'Banda eliminada correctamente', band });

     } catch (error) {

          res.status(500).json({ error: 'Error al eliminar la banda', details: error.message });
     }
};




module.exports = {

     getBands,
     getbandById,
     getVerifiedBands,
     postBand,
     putBand,
     deleteBand
};