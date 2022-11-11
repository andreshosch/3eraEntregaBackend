const mongoose=require("mongoose")

module.exports=class CartMongoController {
    constructor(collection,schema) {
        this.collection = mongoose.model(collection, schema);
    }

    getAllCart = async () => {
        try {
            return await this.collection.find();
        } catch (err) {
            throw new Error('Error');
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
        } catch {
            throw new Error('Error');
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
        } catch (error) {
            console.log(error);
            throw new Error('Error adding product');
        }
    }


    getById = async (id) => {
        try {
            const cart = await this.collection.findOne({ id: id });
            const products = cart?.productos;
            if (products) {
                return products;
            } else {
                throw new Error('No existe el carrito');
            }
        } catch {
            throw new Error('Error pidiendo los datos');
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
        } catch {
            throw new Error('Error borrando el producto')
        }
    }


}

