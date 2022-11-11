const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    timestamp: {type: String, required: true, max:50},
    nombre: {type: String, required: true, max:100},
    descripcion: {type: String, required: true, max:400},
    codigo: {type: String, required: true},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true},
    imagen:{type:String,required:true}
});


const producto = mongoose.model('Products', productsSchema);

module.exports = producto;