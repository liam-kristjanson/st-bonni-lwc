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
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//login route
app.post("/login", authController.handleLogin);

app.get('/user', (req, res) => {
    dbRetriever.fetchOneDocument('users', {username: 'admin'}).then(user => {
        res.send(user);
    })
})
app.post("/reset-password", authController.resetPassword);

app.get("/bookings", (req, res) => {
    dbRetriever.fetchDocuments("bookings", {})
    .then(bookingData => {
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

function setTimeOnDate(date, time) {
    timeHours = parseInt(time.substring(0, 2));
    timeMinutes = parseInt(time.substring(3,5));

    console.log("TIME HOURS:", timeHours);
    console.log("TIME MINUTES", timeMinutes)

    let returnDate = new Date(date);

    returnDate.setHours(timeHours);
    returnDate.setMinutes(timeMinutes);
    returnDate.setSeconds(0);
    returnDate.setMilliseconds(0);

    return returnDate;
}



app.put("/bookings/:id", bookingController.handleUpdateBooking);

app.listen(PORT, () => {
  console.log("Backend server running at http://localhost:" + PORT);
});
