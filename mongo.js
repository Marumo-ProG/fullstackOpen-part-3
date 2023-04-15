const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://admin:${password}@redflag.9o0eshd.mongodb.net/?retryWrites=true&w=majority`


mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', noteSchema)

if (process.argv.length == 5) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    contact.save().then(result => {
        console.log("added "+process.argv[3] + " number "+process.argv[4]+" to the Phonebook");
        mongoose.connection.close()
    })
}
if(process.argv.length == 3){
    Contact.find({})
    .then(data => {
        console.log("Phonebook:");
        for(let i=0; i < data.length; i ++){
            console.log(data[i].name + " " +data[i].number);
        }
        mongoose.connection.close();
    })
    .catch(error => {
        console.log(error);
    })

}

