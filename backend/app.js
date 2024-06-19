require('dotenv').config();

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
<<<<<<< Updated upstream
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
=======
app.use(bodyParser.json({}));
//app.use(bodyParser.urlencoded({extended: true}));
>>>>>>> Stashed changes

app.post('/login', (req, res) => {
    console.log(req.body);
    res.json({message: "Login processing..."})
})

app.listen(PORT, () => {
    console.log("Backend server running at http://localhost:" + PORT)
})

