const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({

     cloudinary: cloudinary,
     params: async (req, file) => {

          // asignamos ala carpeta en funcion de la coleccion
          const defaultFolder = nameFolder(req);

          return {
               folder: defaultFolder,
               allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
          };
     }
    
});

const upload = multer({ storage: storage });

module.exports = upload;

// funcion para determinar la carpeta donde se subira la imagen buscando el nombre de la coleccion en la ruta
const nameFolder = (req) => {

     const route = req.baseUrl; 

     if (route.includes('bands')) return 'grupos-Rock';
     if (route.includes('styles')) return 'estilos-Rock';
     if (route.includes('leaders')) return 'lideres-Rock';
     return 'rock-folder'; // carpeta por defecto si no coincide ninguna
};