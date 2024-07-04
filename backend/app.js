//Dependencies
require("dotenv").config();

const dbRetriever = require("./dbretriever.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Transform } = require('stream');

//local modules
const authController = require('./authController.js')
const bookingController = require('./bookingController.js')
const reviewController = require('./reviewController.js')
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

//root path to wake up the server or check status
app.get('/', (req, res) => {
    console.log(" --- Root path ---")
    res.send('Service is running');
})

//app routes
app.post("/login", authController.handleLogin);
app.post("/reset-password", authController.resetPassword);
app.get("/bookings", bookingController.getBookings);
app.get("/bookingsfilter", bookingController.getFilteredBookings);

app.get("/admin/reviews", reviewController.getReviews);
app.post("/reviews", reviewController.submitReview)
app.post("/admin/availability", bookingController.handleUpdateAvailability);
app.post("/admin/update-account-info", authController.updateAccountInfo);
app.post("/book-slot", bookingController.bookSlot);
app.post("/admin/generate-review-link", bookingController.generateReviewLink);

app.listen(PORT, () => {
  console.log("Backend server running at http://localhost:" + PORT);
  console.log("CORS configured to allow requests from " + process.env.FRONT_ORIGIN)
  console.log("Specified timezone: ", process.env.TZ);
});
