

const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({

     name: { type: String, required: true },
     image: { type: String, required: false },
     leader: { type: mongoose.Types.ObjectId, ref: 'leaders', required: false, trim: true },
     style: { type: mongoose.Types.ObjectId, ref: 'styles', required: false, trim: true },
},
     
     {
          timestamps: true,
          collection: 'bands'
     });


const Band = mongoose.model('bands', bandSchema, 'bands');

module.exports = Band;