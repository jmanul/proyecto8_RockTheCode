
const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({

     name: { type: String, required: true },
     image: { type: String, required: true}, 
     bands: [{ type: Schema.Types.ObjectId, ref: 'bands', required: true}]
},

     {
          timestamps: true,
          collection: 'leaders'
     });

const Leader = mongoose.model('leaders', leaderSchema, 'leaders');

module.exports = Leader;