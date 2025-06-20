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
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`@Server running on ${PORT}`)
})
