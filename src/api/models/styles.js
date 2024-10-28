

const mongoose = require('mongoose');

const stylesSchema = new mongoose.Schema({

     name: { type: String, required: true },
     image: { type: String, required: true }, 
     bands: [{ type: Schema.Types.ObjectId, ref: 'bands', required: true}]
},

     {
          timestamps: true,
          collection: 'styles'
     });

const Style = mongoose.model('styles', stylesSchema, 'styles');

module.exports = Style;