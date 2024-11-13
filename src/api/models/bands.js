

const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({

     name: { type: String, required: true, unique: true, trim: true },
     image: { type: String, required: false },
     leadersId: [{ type: mongoose.Types.ObjectId, ref: 'leaders', required: true}],
     styleId: { type: mongoose.Types.ObjectId, ref: 'styles', required: true, trim: true },
     isVerified: { type: Boolean, default: false }
},
     
     {
          timestamps: true,
          collection: 'bands'
     });


const Band = mongoose.model('bands', bandSchema, 'bands');

module.exports = Band;