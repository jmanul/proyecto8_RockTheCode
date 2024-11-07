const Band = require('../models/bands');
const Leader = require('../models/leaders');
const Style = require('../models/styles');



const getBands = async (req, res, next) => {

     try {
          const bands = await Band.find()
               .populate('leaderId', 'name image')
               .populate('styleId', 'name description');

          res.status(200).json(bands);

     } catch (error) {
          res.status(500).json({ error: 'Error al obtener las bandas', details: error.message });
     }
};

const getbandById = async (req, res, next) => {

     try {
          const { id } = req.params;
          const band = await Band.findById(id).populate('leaderId', 'name image').populate('styleId', 'name description');

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
          const { name, image, leaderId, leaderName, styleId, styleName } = req.body;

          const existingBand = await Band.findOne({ name });

          if (existingBand) {

               return res.status(400).json({ error: 'La banda ya existe' });
          }

          // si enviamos leaderName  y no leaderId, busca un lider por su nombre o crea un nuevo lider con leaderName si no existe

          let leader;

          if (!leaderId && leaderName) {

               leader = await Leader.findOneAndUpdate(
                    { name: leaderName },
                    { name: leaderName },
                    { new: true, upsert: true }
               );

          } else {

               leader = await Leader.findById(leaderId);
          }

          if (!leader) {
               return res.status(404).json({ error: 'Líder no encontrado' });
          }

          //   si enviamos styleName en lugar de styleId buscara el stilo por el nombre y si no existe lo creara 

          let style;

          if (!styleId && styleName) {

               style = await Style.findOneAndUpdate(
                    { name: styleName },
                    { name: styleName },
                    { new: true, upsert: true }
               );

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

          // actualizamos los arrays del lider y el estilo, añadiendoles si no existen ya en la lista 

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
               .populate('leaderId', 'name')
               .populate('styleId', 'name description');

          res.status(201).json({
               message: 'banda añadida',
               populatedBand
          });
     } catch (error) {

          res.status(500).json({ error: 'Error al crear la banda', details: error.message });
     }
};


const putBand = async (req, res, next) => {

     try {
          const { id } = req.params;
          const { name, image, leaderId, leaderName, styleId, styleName, isVerified } = req.body;

          const band = await Band.findById(id);

          if (!band) {
               return res.status(404).json({ message: 'Banda no encontrada' });
          }

          // TODO: añadir codigo para subir image

          band.name = name || band.name;
          band.image = image || band.image;

          let leader;

          if (!leaderId && leaderName) {

               leader = await Leader.findOneAndUpdate(
                    { name: leaderName },
                    { name: leaderName },
                    { new: true, upsert: true }
               );

          } else {

               leader = await Leader.findById(leaderId);
          }

          if (!leader) {
               return res.status(404).json({ error: 'Líder no encontrado' });
          }

          let style;

          if (!styleId && styleName) {

               style = await Style.findOneAndUpdate(
                    { name: styleName },
                    { name: styleName },
                    { new: true, upsert: true }
               );

          } else {

               style = await Style.findById(styleId);
          }

          if (!style) {
               return res.status(404).json({ error: 'Estilo no encontrado' });
          }


          if (typeof isVerified === 'boolean') {
               band.isVerified = isVerified;
          }

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
               .populate('leaderId', 'name image')
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

          if (band.leaderId) {
               await Leader.findByIdAndUpdate(band.leaderId, { $pull: { bandsId: id } });
          }

          // buscamos el estilo de la banda por el id y actualizamos su array de bandas y el de líderes, eliminando las referencias de cada uno a la banda

          if (band.styleId) {
               await Style.findByIdAndUpdate(band.styleId, {
                    $pull: {
                         bandsId: id,
                         leadersId: band.leaderId
                } });
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