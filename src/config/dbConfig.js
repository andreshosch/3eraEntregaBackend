
// //CONEXION A LA DB EN MONGO

const config = {
    mongoDb: {
        url: process.env.DB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}

module.exports=config;
