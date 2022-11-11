const ProdMongoController=require('../controllers/products.js')

class ProductosDaoMongo extends ProdMongoController{
    constructor(){
        super ('products',{
            timestamp: {type: String, required: true, max:50},
            nombre: {type: String, required: true, max:100},
            descripcion: {type: String, required: true, max:400},
            codigo: {type: String, required: true},
            precio: {type: Number, required: true},
            stock: {type: Number, required: true},
            imagen:{type:String,required:true}
            
        })
    }
}

module.exports= ProductosDaoMongo