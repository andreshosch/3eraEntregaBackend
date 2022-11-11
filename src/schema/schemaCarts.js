const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
            id: { type: Number, required: true },
	        timestamp: { type: Number},
	        productos: { type: Array },
});


const cart = mongoose.model('Carts', cartSchema);

module.exports = cart;