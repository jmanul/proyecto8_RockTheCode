

const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({

     name: { type: String, required: true },
     image: { type: String, required: false },
     leaderId: { type: mongoose.Types.ObjectId, ref: 'leaders', required: false, trim: true },
     styleId: { type: mongoose.Types.ObjectId, ref: 'styles', required: false, trim: true },
     isVerified: { type: Boolean, default: false }
},
     
     {
          timestamps: true,
          collection: 'bands'
     });


const Band = mongoose.model('bands', bandSchema, 'bands');

module.exports = Band;