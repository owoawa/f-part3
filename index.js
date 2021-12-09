require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('web'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))

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

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)
    // person ? response.json(person) : response.status(404)

    Person.findById(request.params.id).then(p => response.json(p)).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(p => p.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id).then(() => response.status(204).end()).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
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
    if (error.name === 'CastError') return response.status(400).send({ error: 'malformatted id' })
    if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
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