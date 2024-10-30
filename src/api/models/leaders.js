
const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     image: { type: String, required: false}, 
     bands: [{ type: mongoose.Types.ObjectId, ref: 'bands', required: false}]
},

     {
          timestamps: true,
          collection: 'leaders'
     });

const Leader = mongoose.model('leaders', leaderSchema, 'leaders');

module.exports = Leader;