
const Band = require('../models/bands');
const Style = require('../models/styles');


const getStyles = async (req, res, next) => {

     try {
          const styles = await Style.find().populate('bandsId', 'name');

          res.status(200).json(styles);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener los estilos', details: error.message });
     }
};

const getStyleById = async (req, res, next) => {

     try {
          const { id } = req.params;
          const style = await Style.findById(id).populate('bandsId', 'name');

          if (!style) {
               return res.status(404).json({ error: 'Estilo no encontrado' });
          }

          res.status(200).json(style);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener el estilo', details: error.message });
     }
};

const getVerifiedStyles = async (req, res, next) => {

     try {

          const verifiedStyles = await Style.find({ isVerified: true });

          res.status(200).json(verifiedStyles);

     } catch (error) {

          res.status(500).json({ error: 'Error al obtener los estilos verificados', details: error.message });
     }
};

const postStyle = async (req, res, next) => {

     try {
          const { name, leadersId, bandsId, ...rest } = req.body;

          let existingStyle = await Style.findOne({ name });

          if (existingStyle) {
               return res.status(409).json({ error: `El estilo ${name} ya existe` });
          }

          const validBands = await Band.find({ _id: { $in: bandsId } });
         
          const newStyle = await Style.create({
               name,
               bandsId: [...new Set(validBands.map(band => band._id))],
               ...rest
          });


          const populatedStyle = await Style.findById(newStyle._id).populate('bandsId', 'name');

          res.status(200).json(populatedStyle);

     } catch (error) {
          res.status(500).json({ error: 'Error al crear el estilo', details: error.message });
     }
};

const putStyle = async (req, res, next) => {

     try {
          const { id } = req.params;
          const { name, leadersId, bandsId, ...rest } = req.body;

          let style = await Style.findById(id);
          if (!style) {
               return res.status(404).json({ error: 'El estilo no existe' });
          };

          const existingStyle = await Style.findOne({ name });

          if (existingStyle) {
               return res.status(409).json({ error: `${name} ya existe` });
          }

          const validBands = await Band.find({ _id: { $in: bandsId } });
         
          style.name = name || style.name;
          style.description = description || style.description;
          
          Object.assign(style, rest);

          const updatedStyle = await style.save();

          await Style.findByIdAndUpdate(
               id,
               {
                    $addToSet: {
                         bandsId: validBands.map(band => band._id)
                    }
               }
          );

          const populatedStyle = await Style.findById(updatedStyle._id)
               .populate('bandsId', 'name');
          
          res.status(200).json(populatedStyle);

     } catch (error) {

          res.status(500).json({ error: 'Error al actualizar el estilo', details: error.message });
     }
};

const deleteStyle = async (req, res, next) => {

     try {
          const { id } = req.params;

          const style = await Style.findById(id);

          if (!style) {
               return res.status(404).json({ message: 'Estilo no encontrado' });
          }

          await Style.findByIdAndDelete(id);

          await Band.updateMany({ stylesId: id }, { $pull: { stylesId: id } });

          res.status(200).json({ message: 'Estilo eliminado correctamente', style });

     } catch (error) {

          res.status(500).json({ error: 'Error al eliminar el estilo', details: error.message });
     }
};


module.exports = {
     getStyles,
     getVerifiedStyles,
     getStyleById,
     postStyle,
     putStyle,
     deleteStyle
};
