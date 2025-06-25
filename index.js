let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist')) //Static access to frontend production build

//MIDDLEWARE
const requestLogger = (request, response, next) => {
    console.log('method', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
//app.use(unknownEndpoint)

morgan.token('body', function (req, res) { 
    console.log(JSON.stringify(req.body))
    return JSON.stringify(req.body)
})

app.use(express.json())
//app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-time ms :body'))

//GET
//info
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${data.length} people<p> 
        <p>${date}</p>
    `)
})

//all
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
  })
})

//by id
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
        // mongoose.connection.close() //Must be closed here
    })
})

//DELETE
//by id
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)

    response.status(204).end()  //204 No Content
})

//POST
//person
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('body', body)
    if (!body.name) {
        return response.status(400).json({ error: 'content missing' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
 
    newPerson.save().then(savedPerson  => {
         response.json(savedPerson)
         console.log('response', response)
    })
})

//SERVER
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`@Server running on ${PORT}`)
})

