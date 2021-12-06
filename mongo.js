const mongoose = require('mongoose')

if (process.argv.length < 2) {
    console.log('provide password')
    process.exit(1)
}



const password = process.argv[2]
const dbName = 'phonebook'


const url = `mongodb://test:${password}@cluster0-shard-00-00.mlsx3.mongodb.net:27017,cluster0-shard-00-01.mlsx3.mongodb.net:27017,cluster0-shard-00-02.mlsx3.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-9igbcr-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url).then(() => console.log('connected to db')).catch(error => console.log(error))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(() => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(r => {
        console.log('phonebook:')
        r.forEach(person =>{   
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}

// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]
// const dbname = 'note-app'

// const url = `mongodb://test:${password}@cluster0-shard-00-00.mlsx3.mongodb.net:27017,cluster0-shard-00-01.mlsx3.mongodb.net:27017,cluster0-shard-00-02.mlsx3.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-9igbcr-shard-0&authSource=admin&retryWrites=true&w=majority`

// mongoose.connect(url).then(() => console.log('db connected')).catch(err => console.log(err))

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// // const note = new Note({
// //   content: 'HTML is Easy',
// //   date: new Date(),
// //   important: true,
// // })

// Note.find({}).then(r => {
//     r.forEach(note =>{
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
// // note.save().then(result => {
// //   console.log('note saved!')
// //   mongoose.connection.close()
// // })