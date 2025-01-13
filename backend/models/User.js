const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  carsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CarList', required: false }],
  likedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CarList', required: false }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Encriptación de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;