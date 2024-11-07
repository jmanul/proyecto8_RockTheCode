
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

const postLeader = async (req, res) => {

     try {
          const { name, image, bandsId } = req.body;

          let existingLeader = await Leader.findOne({ name });

          if (existingLeader) {

               return res.status(409).json({ error: 'El líder con ya existe' });
          }

          // TODO: imagen el leader

          const validBands = await Band.find({ _id: { $in: bandsId } });
          const validBandsId = validBands.map(band => band._id.toString());

          const newLeader = await Leader.create({
               name,
               image,
               bandsId: [...new Set(validBandsId)]
          });

          res.status(201).json(newLeader);

     } catch (error) {
          res.status(500).json({ error: 'Error al crear el líder', details: error.message });
     }
};



module.exports = {

     getLeaders,
     getLeaderById,
     postLeader
};
