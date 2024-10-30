

const mongoose = require('mongoose');

const stylesSchema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     description: { type: String, required: true }, 
     bands: [{ type: mongoose.Types.ObjectId, ref: 'bands', required: false}], 
     leaders: [{ type: mongoose.Types.ObjectId, ref: 'leaders', required: false}]
},

     {
          timestamps: true,
          collection: 'styles'
     });

const Style = mongoose.model('styles', stylesSchema, 'styles');

module.exports = Style;