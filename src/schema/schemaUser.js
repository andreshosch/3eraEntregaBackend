const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: Number, required: true },
  mail: {type: String},
  password: {type: String},
  name: {type: String},
  address: {type: String},
  age: {type: String},
  phone: {type: String},
  avatar: {type: String},
});
const User = mongoose.model('User', userSchema);

module.exports = User;