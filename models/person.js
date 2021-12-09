const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => console.log('Connected to DB')).catch(err => console.log(err))

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)