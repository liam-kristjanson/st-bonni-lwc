require('dotenv').config();

const dbRetriever = require('./dbretriever');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8080;

const corsOptions = {
    origin: process.env.FRONT_ORIGIN,
    optionsSuccessStatus: 200
}

console.log(process.env);

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.post('/login', (req, res) => {
    const exampleUser = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: 'password'
    }

    if (req.body.email === exampleUser.email && req.body.password === exampleUser.password) {
        const authData = {
            id: exampleUser.id,
            name: exampleUser.name,
            email: exampleUser.email,
            authToken: "EXAMPLE-TOKEN"
        }

        res.send(authData);
    } else (
        res.status(401).send({error: "Invalid username or password"})
    )
})

app.get('/user', (req, res) => {
    dbRetriever.fetchOneDocument('users', {username: 'admin'}).then(user => {
        res.send(user);
    })
})

app.listen(PORT, () => {
    console.log("Backend server running at http://localhost:" + PORT)
})

