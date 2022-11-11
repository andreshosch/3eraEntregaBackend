const dotenv =require ('dotenv')
dotenv.config()

let productoDao
let cartDao
let userDao


switch (process.env.DATABASE){
    case 'mongo':{
        const  ProductosDaoMongo =  require('./ProductsDao.js')
        const cartDaoMongo =  require('./cartDao.js')
        const userDaoMongo =  require('./userDao.js')
        
        
        
       productoDao=ProductosDaoMongo
       cartDao=cartDaoMongo
       userDao=userDaoMongo;
       break;
    }
}
module.exports= {
    productoDao, cartDao,userDao
    }
