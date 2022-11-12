const mongoose=require("mongoose");
const { db } = require("../schema/schemaUser");
const {
    loggerDev,
    loggerProd
  } = require("../../public/js/logger_config.js");
  const NODE_ENV = process.env.NODE_ENV || "development";
  const logger = NODE_ENV === "production"
  ? loggerProd
  : loggerDev
module.exports=class CartMongoController {
    constructor(collection,schema) {
        this.collection = mongoose.model(collection, schema);
    }
    

    getAllCart = async () => {
        try {
            return await this.collection.find();
        }  catch(err) {
            logger.log("error",err)
        }
    }

    createCarrito = async () => {
       
        try {
            const carritos = await this.getAllCart();
            if (carritos.length === 0) {
                const carrito = { id: 1, timestamp: Date.now(),productos: [] };
                const newElement = new this.collection(carrito);
                const result = await newElement.save();
                return result;
            } else {
                const carrito = { id: carritos.length + 1, timestamp: Date.now(),productos: [] };
                const newElement = new this.collection(carrito);
                const result = await newElement.save();
                return result;
            }
        }  catch(err) {
            logger.log("error",err)
            
            
        }
    }

    addProduct = async (id, newElement) => {
        try {

            const cart = await this.getAllCart();
            const cartIndex = cart.findIndex((e) => e.id === Number(id));
            const productsInCart = cart[cartIndex].productos;
            if (cart[cartIndex].productos.length === 0) {
                newElement.id = 1;
            } else {
                newElement.id = cart[cartIndex].productos.length + 1;
            }
            newElement.timestamp = Date.now();
            productsInCart.push(newElement);
            await this.collection.updateOne(
                { id: id },
                {
                    $set: { productos: productsInCart },
                }
            )
        }  catch(err) {
            logger.log("error",err)
        }
    }

    getById = async (id) => {
        try {
            const countCart= await db.collection("carts").countDocuments();
            const cart = await this.collection.findOne({ id: id });
            if (countCart!=0){
                const products = cart?.productos;
                if (products) {
                   return products;
                }    else {
                     throw new Error('No existe el carrito');
                }
            }
        
        }     catch(err) {
             logger.log("error",err)
            
        }
    }
    


    deleteProduct = async (id, prodId) => {
        try {
            const carts = await this.getAllCart()
            const cartIndex = carts.findIndex((e) => e.id == id)

            if (cartIndex >= 0) {
                const productsOnCart = carts[cartIndex].productos
                const prodToDeleteIndex = productsOnCart.findIndex((e) => e.id == prodId)
                if (prodToDeleteIndex >= 0) {
                    productsOnCart.splice(prodToDeleteIndex, 1)
                    await this.collection.updateOne(
                        { id: id },
                        {
                            $set: { productos: productsOnCart },
                        }
                    )
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }  catch(err) {
            logger.log("error",err)
        }
        
    }
    
} 


   


