

const mongoose = require('mongoose');

const stylesSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     description: { type: String, required: true }, 
     bandsId: [{ type: mongoose.Types.ObjectId, ref: 'bands', required: false}], 
     leadersId: [{ type: mongoose.Types.ObjectId, ref: 'leaders', required: false }],
     isVerified: { type: Boolean, default: false }
},

     {
          timestamps: true,
          collection: 'styles'
     });

const Style = mongoose.model('styles', stylesSchema, 'styles');

module.exports = Style;