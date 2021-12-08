const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('phonebook_backend'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/info', (request, response) => {
    response.send(`phonebook has info for ${persons.reduce((sum,n) => sum += 1 ,0)} people <br /> ` + new Date())
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(p => response.json(p))
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)
    // person ? response.json(person) : response.status(404)

    Person.findById(request.params.id).then(p => response.json(p))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // if(!body.name || !body.number) return response.status(400).json({ error: 'name or number are missing'})
    // if(Person({}).find(p => p.name === body.name)) return response.status(400).json({ error: 'name must be unique' })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    // persons = persons.concat(person)
    person.save().then(savedPerson => response.json(savedPerson))

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server is running')
})