
const deleteCloudinaryImage = require('../../utils/deleteImage');
const Band = require('../models/bands');
const Leader = require('../models/leaders');



const getLeaders = async (req, res, next) => {

     try {
          const leaders = await Leader.find().populate('bandsId', 'name');

          res.status(200).json(leaders);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener los líderes', details: error.message });
     }
};

const getLeaderById = async (req, res, next) => {

     try {
          const { id } = req.params;
          const leader = await Leader.findById(id).populate('bandsId', 'name');

          if (!leader) {
               return res.status(404).json({ error: 'Líder no encontrado' });
          }

          res.status(200).json(leader);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener el líder', details: error.message });
     }
};

const getVerifiedLeaders = async (req, res, next) => {

     try {

          const verifiedLeaders = await Leader.find({ isVerified: true });

          res.status(200).json(verifiedLeaders);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener las bandas verificadas', details: error.message });
     }
};

const postLeader = async (req, res, next) => {

     try {
          const { name, bandsId, ...rest } = req.body;

          let existingLeader = await Leader.findOne({ name });

          if (existingLeader) {

               return res.status(409).json({ error: `El líder ${name} ya existe` });
          }

          let image = null;
          if (req.file) {

               image = {

                    url: req.file.path,
                    public_id : req.file.filename
               }
          }

          const validBands = await Band.find({ _id: { $in: bandsId } });
      
          const newLeader = await Leader.create({
               name,
               image,
               bandsId: [...new Set(validBands.map(band => band._id))],
               ...rest
          });

          const populatedLeader = await Leader.findById(newLeader._id)
               .populate('bandsId', 'name image');


          res.status(200).json({
               message: 'Líder creado',
               populatedLeader
          });

     } catch (error) {
          res.status(500).json({ error: 'Error al crear el líder', details: error.message });
     }
};

const putLeader = async (req, res, next) => {

     try {
          const { id } = req.params;
          const { name, bandsId, ...rest } = req.body;

          let leader = await Leader.findById(id);
          if (!leader) {
               return res.status(404).json({ error: 'El líder no existe' });
          };

          const existingLeader = await Leader.findOne({ name });

          if (existingLeader) {
               return res.status(409).json({ error: `${name} ya existe` });
          }

          const validBands = await Band.find({ _id: { $in: bandsId } });

          if (req.file) {
               // elimina la imagen anterior si la hay
               await deleteCloudinaryImage(leader.image);

               // actualiza la nueva imagen con su URL y public_id (que guardaremos para poder eliminarla o actualizarla)
               
               leader.image = {
                    url: req.file.path,
                    public_id: req.file.filename
               }
          }

          leader.name = name || leader.name;
     
          Object.assign(leader, rest);

          const updatedLeader = await leader.save();

          await Leader.findByIdAndUpdate(
               id,
               {
                    $addToSet: {

                         bandsId: validBands.map(band => band._id)
                      
                    }
               }
          );

          const populatedLeader = await Leader.findById(updatedLeader._id)
               .populate('bandsId', 'name image');


          res.status(200).json({
               message: 'Líder actualizado',
               populatedLeader
          });

     } catch (error) {

          res.status(500).json({ error: 'Error al actualizar el líder', details: error.message });
     }
};

const deleteLeader = async (req, res, next) => {

     try {
          const { id } = req.params;

          const leader = await Leader.findById(id);

          if (!leader) {
               return res.status(404).json({ message: 'Lider no encontrada' });
          }

          await deleteCloudinaryImage(leader.image);

          await Leader.findByIdAndDelete(id);

          await Band.updateMany({ leadersId: id }, { $pull: { leadersId: id } });

          res.status(200).json({ message: 'Lider eliminado correctamente', leader });

     } catch (error) {

          res.status(500).json({ error: 'Error al eliminar la banda', details: error.message });
     }
};





module.exports = {

     getLeaders,
     getVerifiedLeaders,
     getLeaderById,
     postLeader,
     putLeader,
     deleteLeader
};
