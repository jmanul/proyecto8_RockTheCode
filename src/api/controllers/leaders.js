
const Band = require('../models/bands');
const Leader = require('../models/leaders');
const Style = require('../models/styles');


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

const postLeader = async (req, res, next) => {

     try {
          const { name, image, bandsId , ...rest} = req.body;

          let existingLeader = await Leader.findOne({ name });

          if (existingLeader) {

               return res.status(409).json({ error: `El líder ${name} ya existe` });
          }

          // TODO: imagen el leader

          const validBands = await Band.find({ _id: { $in: bandsId } });
          const validBandsId = validBands.map(band => band._id.toString());

          const newLeader = await Leader.create({
               name,
               image,
               bandsId: [...new Set(validBandsId)],
               ...rest
          });

          const populatedLeader = await Leader.findById(newLeader._id)
               .populate('bandsId', 'name image');


          res.status(200).json(populatedLeader);

     } catch (error) {
          res.status(500).json({ error: 'Error al crear el líder', details: error.message });
     }
};

const putLeader = async (req, res, next) => {

     try {
          const { id } = req.params;
          const { name, image, bandsId, ...rest } = req.body;

          let leader = await Leader.findById(id);
          if (!leader) {
               return res.status(404).json({ error: 'El líder no existe' });
          };

          const existingLeader = await Leader.findOne({ name });

          if (existingLeader) {
               return res.status(409).json({ error: `${name} ya existe` });
          }

          const validBands = await Band.find({ _id: { $in: bandsId } });

          leader.name = name || leader.name;
          leader.image = image || leader.image;
          Object.assign(leader, rest);
      
          const updatedLeader = await leader.save();
          await Leader.findByIdAndUpdate(
               id,
               {
                    $addToSet: {
                         bandsId: validBands
                    }
               }
          );

          const populatedLeader = await Leader.findById(updatedLeader._id)
               .populate('bandsId', 'name image');


          res.status(200).json(populatedLeader);

     } catch (error) {

          res.status(500).json({ error: 'Error al actualizar el líder', details: error.message });
     }
};




module.exports = {

     getLeaders,
     getLeaderById,
     postLeader,
     putLeader
};
