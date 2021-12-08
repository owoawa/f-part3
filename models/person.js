const mongoose = require('mongoose')

const url = "mongodb://test:test@cluster0-shard-00-00.mlsx3.mongodb.net:27017,cluster0-shard-00-01.mlsx3.mongodb.net:27017,cluster0-shard-00-02.mlsx3.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-9igbcr-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose.connect(url).then(() => console.log("Connected to DB")).catch(err => console.log(err))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)