const userMongoController=require('../controllers/user.js')

class userDaoMongo extends userMongoController{
    constructor(){
        super ('users',{
            id: { type: Number, required: true },
            mail: {type: String},
            password: {type: String},
            name: {type: String},
            address: {type: String},
            age: {type: String},
            phone: {type: String},
            avatar: {type: String},
        })
    }
}

module.exports= userDaoMongo