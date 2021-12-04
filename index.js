const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(`phonebook has info for ${persons.reduce((sum,n) => sum += 1 ,0)} people <br /> ` + new Date())
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    person ? response.json(person) : response.status(404)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) return response.status(400).json({ error: 'name or number are missing'})
    if(persons.find(p => p.name === body.name)) return response.status(400).json({ error: 'name must be unique' })

    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)

})

app.listen(3001, () => {
    console.log('Server is running')
})