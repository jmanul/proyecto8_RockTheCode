
const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({

     name: { type: String, required: true, unique: true, trim: true },
     position: { type: String, enum: [
          "Vocalist",
          "Guitarist",
          "Bassist",
          "Drummer",
          "Keyboardist",
          "Percussionist",
          "Multi-instrumentalist",
          "Producer"
     ],
     required: false
     },
     startDate: { type: Date, required: false},
     endDate: { type: String, default: "actuality" },
     image: { type: String, required: false}, 
     bandsId: [{ type: mongoose.Types.ObjectId, ref: 'bands', required: false }],
     isVerified: { type: Boolean, default: false }
},

     {
          timestamps: true,
          collection: 'leaders'
     });

leaderSchema.path('endDate').get((value) => value === "actuality" ? new Date() : value)

const Leader = mongoose.model('leaders', leaderSchema, 'leaders');

module.exports = Leader;