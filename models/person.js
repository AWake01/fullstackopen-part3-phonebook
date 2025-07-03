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
      name: {type: String, minLength: 3},
      number: {type: String, minLength: 8,
      validate: {
        validator: function(v) {
          console.log('Test: ', v)
          return /^\d{2,3}-\d*$/.test(v)
        },
        message: props => `${props.value} is not a valid phone number`
      }
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
