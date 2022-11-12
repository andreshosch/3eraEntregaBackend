// const { faker } = require("@faker-js/faker");

// const createFakeProducts = async() => {

//     let products = [];
//     for (let i = 0; i < 5; i++) {
//         const product = {
//             name: faker.commerce.product(),
//             price: faker.commerce.price(),
//             image: faker.image.image()
//         }
//         products.push(product);
//     }
//     return products;
// }

// module.exports = { createFakeProducts }
const mongoose=require("mongoose")



module.exports=class ProdMongoController {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema);
    }

    save = async (element) => {
        try {
            element.timestamp = new Date().toISOString();
            element.codigo=Math.floor(Math.random() * (10000 - 1) + 1);
            const newElement = new this.collection(element);
            const result = await newElement.save();
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    getAll = async () => {
        try {
            return await this.collection.find();
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            return await this.collection.findById({ _id: id });
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateById(id, element) {
        try {
            return await this.collection.findByIdAndUpdate({ _id: id }, element);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id) {
        try {
            return await this.collection.findByIdAndDelete({ _id: id });
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteAll() {
        try {
            return await this.collection.deleteMany({});
        } catch (error) {
            throw new Error(error);
        }
    }
}
