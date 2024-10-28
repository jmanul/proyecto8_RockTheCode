

const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({

     name: { type: String, required: true },
     image: { type: String, required: true },
     leader: { type: Schema.Types.ObjectId, ref: 'leaders' , required: true},
     style: { type: Schema.Types.ObjectId, ref: 'styles', required: true },
},
     
     {
          timestamps: true,
          collection: 'bands'
     });


const Band = mongoose.model('bands', bandSchema, 'bands');

module.exports = Band;