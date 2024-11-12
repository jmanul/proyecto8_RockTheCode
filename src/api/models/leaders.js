
const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     image: { type: String, required: false}, 
     bandsId: [{ type: mongoose.Types.ObjectId, ref: 'bands', required: true }],
     isVerified: { type: Boolean, default: false }
},

     {
          timestamps: true,
          collection: 'leaders'
     });

const Leader = mongoose.model('leaders', leaderSchema, 'leaders');

module.exports = Leader;