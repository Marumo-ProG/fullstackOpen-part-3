const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require('dotenv').config();
const Contact = require('./models/Phone');



let app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let port = process.env.PORT;

/*
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
] */


app.get("/", (req, res) => {
    res.contentType("application/json");
    res.json({ code: 200, message: "Welcome to the persons api" });
})
app.get("/info", (req, res) => {
    res.contentType("html");
    let d = new Date;
    res.send("<div> <h3>Phone book has info for " + persons.length + " people</h3> <br> <br> " + d + " </div>")
})
app.get("/api/persons", (req, res) => {
    Contact.find({}).then(notes => {
        res.json(notes)
    })
        .catch(err => { console.log(err) });
})

app.get("/api/persons/:id", (req, res) => {
    let id = req.params.id;
    Contact.find({ _id: id })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        })

})

app.delete("/api/persons/:id", (req, res) => {
    Contact.deleteOne({ _id: req.params.id })
        .then(data => {
            console.log("user deleted from the database");
        })
        .catch(err => {
            console.error(err);
        })
    res.status(204).end();
})

app.put("/api/persons/:id", (req, res) => {
    const body = req.body;

    const contact = {
        content: body.content,
        important: body.important,
    }

    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(error => next(error));
})

app.post("/api/persons", (req, res) => {
    let body = req.body;
    if (body.name && body.number) {

        Contact.find({ name: body.name })
            .then(data => {

                if (data.length > 0) {
                    console.log("ERROR, User exists in the Database");
                    res.end();
                } else {
                    let contact = new Contact({ name: body.name, number: body.number });
                    contact.save()
                        .then(data => {
                            console.log("Added " + body.name + " " + body.number + " to the phonebook");
                            res.end();
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            })

    } else {
        console.log("error adding user... no name or number specified");
        res.status(401);
    }

    res.end();
})

app.listen(port, console.log(`server listening on port ${port}`));