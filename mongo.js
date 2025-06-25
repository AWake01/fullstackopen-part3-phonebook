const mongoose = require('mongoose')

//[0]: execution path, [1]: js path, [2..]: args
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackSW:${password}@fullstack-open-test.l3ingiu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack-open-test`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

const getAll = () => {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close() //Must be closed here
    })
}

const savePerson = (name, number) => {
    const person = new Person({
        name: name,
        number: number
    })
    console.log(person.name, ' ', person.number)
    person.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}


console.log(process.argv.length)

//Length starts at 1
if (process.argv.length === 3) {
    mongoose.connect(url)
    console.log('password: ', process.argv[2])
    getAll()
}
else if (process.argv.length === 4) {
    console.log('missing number or name')
    process.exit(1)
}
else if (process.argv.length === 5) {
    mongoose.connect(url)
    console.log('password: ',process.argv[2])
    console.log('name: ',process.argv[3])
    console.log('number: ',process.argv[4])
    savePerson(process.argv[3], process.argv[4])
}