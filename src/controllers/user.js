module.exports=class userMongoController {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema);
    }
}