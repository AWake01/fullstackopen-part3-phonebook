require('dotenv').config()

const mongoose = require('mongoose')

const password = process.argv[2]
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)


// Connection test
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch(error => {
        console.log('unable to conenct to mongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
