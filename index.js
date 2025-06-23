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
    response.send(data)
})

//by id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id === id)
    console.log('ID: ', id)

    if(person) { response.json(person) }
    else { response.status(404).end()}  //404 Not Found
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
    const id = Math.floor(Math.random() * 999999)

    const newPerson = request.body

    if(!newPerson.name || !newPerson.number){
        console.log('name or number missing')
        return response.status(400).json({
            error: 'name or number missing'
        })  //400 No Content
    }
    
    if(data.find(person => person.name === newPerson.name)) {
         return response.status(400).json({
            error: 'name must be unique'
        })  //400 No Content
    }

    newPerson.id = id
    data = data.concat(newPerson)
    console.log(newPerson)
})

//SERVER
const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`@Server running on ${PORT}`)
})

