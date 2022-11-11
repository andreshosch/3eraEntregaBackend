const dotenv =require ('dotenv')
dotenv.config()

let productoDao
let cartDao


switch (process.env.DATABASE){
    case 'mongo':{
        const  ProductosDaoMongo =  require('./ProductsDao.js')
        const cartDaoMongo =  require('./cartDao.js')
        
        
       productoDao=ProductosDaoMongo
       cartDao=cartDaoMongo
       
       break;
    }
}
module.exports= {
    productoDao, cartDao
    }
