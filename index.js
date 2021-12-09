require('dotenv').config()
// const { response } = require('express')
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
    // response.send(`phonebook has info for ${Person.count({}, )} people <br /> ` + new Date())
    Person.count({}, (err, count) => {
        response.send(`phonebook has info for ${count} people <br /> ${new Date()}`)
    })
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(p => response.json(p))
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)
    // person ? response.json(person) : response.status(404)

    Person.findById(request.params.id).then(p => response.json(p)).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(p => p.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id).then(() => response.status(204).end()).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // if(!body.name || !body.number) return response.status(400).json({ error: 'name or number are missing'})
    // if(Person({}).find(p => p.name === body.name)) return response.status(400).json({ error: 'name must be unique' })

    

    const person = new Person({
        name: body.name,
        number: body.number
    })

    // persons = persons.concat(person)
    person.save().then(savedPerson => response.json(savedPerson)).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(r => response.json(r)).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') return response.status(400).send({error: 'malformatted id'})
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server is running')
})