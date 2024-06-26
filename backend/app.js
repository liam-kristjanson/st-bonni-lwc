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

app.post("/reset-password", authController.resetPassword);

app.get("/bookings", (req, res) => {
    dbRetriever.fetchDocuments("bookings", {})
    .then(bookingData => {
        res.json(bookingData);
    });
});
app.post("/availability", bookingController.handleUpdateAvailability);

app.listen(PORT, () => {
  console.log("Backend server running at http://localhost:" + PORT);
});
