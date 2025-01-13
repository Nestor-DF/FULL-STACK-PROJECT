const mongoose = require('mongoose');

const carListSchema = new mongoose.Schema({
  listName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  posted: { type: Boolean, default: false },
  comments: [{
    user: { type: String, required: true },
    comment: { type: String, required: true },
  }],
  ratings: { type: Number, default: 0, min: [0, 'El rating no puede ser negativo'] },
  createdAt: { type: Date, default: Date.now },
});

const CarList = mongoose.model('CarList', carListSchema);
module.exports = CarList;