const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  country: { type: String, required: true },
  fuelType: { type: String, required: true },
  category: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  maximumSpeed: { type: Number, required: true },
  linkImage: { type: String, required: true },
  description: { type: String, required: true },
  acceleration: { type: Number, required: true },
  manufactureYear: { type: Number, required: true },
  tractionType: { type: String, required: true },
  motorType: { type: String, required: true },
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;