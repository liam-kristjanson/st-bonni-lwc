//Dependencies
require("dotenv").config();
const dbRetriever = require("./dbretriever.js");
const express = require("express");
const bodyParser = require("body-parser");
const encrypt = require("./encrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

//local modules
const authController = require('./authController.js')
const bookingController = require('./bookingController.js')

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.FRONT_ORIGIN,
  optionsSuccessStatus: 204,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
};

const app = express();

//all-route middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authController.jwtParser)

//route-groupe middleware
app.use('/admin/', authController.verifyAdmin);

//login route
app.post("/login", authController.handleLogin);

app.get('/', (req, res) => {
    res.send('Service is running');
})

app.get('/user', (req, res) => {
    dbRetriever.fetchOneDocument('users', {username: 'admin'}).then(user => {
        res.send(user);
    })
})
app.post("/reset-password", authController.resetPassword);

app.get("/bookings", (req, res) => {
    let retrieveDoc = [];

    if (req.query.date) {
        console.log("Fetching records for date " + new Date(req.query.date + " 00:00"))
        retrieveDoc = dbRetriever.fetchOneDocument("bookings", {date: new Date(req.query.date + " 00:00")})
    } else {
        console.log("Fetching records for any date");
        retrieveDoc = dbRetriever.fetchDocuments("bookings", {})
    }

    retrieveDoc.then(bookingData => {
        res.json(bookingData);
    });
});

app.post("/availability", bookingController.handleUpdateAvailability);

app.get('/log-auth-token', (req, res) => {
    let verifiedAuthToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    console.log('Unverified auth token:')
    console.log(req.headers.authorization);

    console.log('Verified auth token');
    console.log(verifiedAuthToken);

    res.send('Auth token has been logged in the backend');
}) 

app.post("/admin/availability", bookingController.handleUpdateAvailability);
app.post("/book-slot", bookingController.bookSlot);

app.listen(PORT, () => {
  console.log("Backend server running at http://localhost:" + PORT);
  console.log("CORS configured to allow requests from " + process.env.FRONT_ORIGIN)
  console.log("Specified timezone: ", process.env.TZ);
});
