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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

morgan.token('body', function (req, res) { 
    console.log(JSON.stringify(req.body))
    return JSON.stringify(req.body)
})

app.use(express.json())
//app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-time ms :body'))
app.use(errorHandler)    //Loaded last

//ROUTES

//GET
//info
app.get('/api/info', async (request, response) => {
    const date = new Date()

     const count = await Person.countDocuments()
        .then((count) => {
            console.log("Count :", count)
            return count
        })
        .catch((error) => {
            console.log('Error: ', error)
        });

    response.send(`
        <p>Phonebook has info for ${count} people<p> 
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
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error =>  next(error))
})

//DELETE
//by id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//PUT
//update
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                console.log('no person found')
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedperson) => {
                response.json(updatedperson)
            })
        })
        .catch(error => next(error))
})

//POST
//create
app.post('/api/persons', (request, response, next) => {
    const person  = new Person({
        name: request.body.name,
        number: request.body.number
    })
    
    return person.save().then((updatedperson) => {
        //response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//SERVER
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`@Server running on ${PORT}`)
})

