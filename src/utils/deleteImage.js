
const cloudinary = require('cloudinary').v2;

const deleteCloudinaryImage = async (image) => {

     try {
          if (!image) {
               console.log('No hay imagen para eliminar');
               return;
          }
          // extrae el public_id de la URL de la imagen
          // const public_id = image.url.split('/').slice(-2).join('/').split('.')[0];
          

          // con el public_id eliminamos la imagen en Cloudinary
          await cloudinary.uploader.destroy(image.public_id);
          console.log('Imagen eliminada de Cloudinary');

     } catch (error) {

          console.error('Error al eliminar la imagen de Cloudinary:', error);
         
     }
};

module.exports = deleteCloudinaryImage;
