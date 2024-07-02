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

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.FRONT_ORIGIN,
  optionsSuccessStatus: 200,
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
    dbRetriever.fetchDocuments("bookings", {})
    .then(bookingData => {
        res.json(bookingData);
    });
});


//admin Dashboard 
app.get("/bookingsFilter", async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.query;
        
        let query = {};
        let aggregationPipeline = [];

        // Date filtering
        if (filter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            query.startTime = { $gte: today, $lt: tomorrow };
        } else if (filter === 'dateRange' && startDate && endDate) {
            query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Availability filtering
        if (filter === 'available') {
            query.isAvailable = true;
            query['bookings.isAvailable'] = true;
        } else if (filter === 'booked') {
            query.$or = [{ isAvailable: false }, { 'bookings.isAvailable': false }];
        }

        // Base aggregation stages
        aggregationPipeline = [
            { $match: query },
            { $sort: { startTime: 1 } }
        ];

        // Conditional $unwind and $group only if filtering on bookings
        if (filter === 'available' || filter === 'booked') {
            aggregationPipeline.splice(1, 0, 
                { $unwind: "$bookings" },
                { $match: query },  // Re-apply the filter after unwinding
                { 
                    $group: {
                        _id: "$_id",
                        date: { $first: "$date" },
                        startTime: { $first: "$startTime" },
                        endTime: { $first: "$endTime" },
                        isAvailable: { $first: "$isAvailable" },
                        bookings: { $push: "$bookings" }
                    }
                }
            );
        }

        // Get the aggregation cursor
        const cursor = dbRetriever.getAggregateCursor("bookings", aggregationPipeline);

        // Set the response header for streaming JSON
        res.setHeader('Content-Type', 'application/json');
        res.write('{"bookings":[');

        // Create a transform stream to process documents
        const processDocument = new Transform({
            objectMode: true,
            transform(doc, encoding, callback) {
                this.push(JSON.stringify(doc));
                callback();
            }
        });

        let isFirstDocument = true;

        // Pipe the cursor through the transform stream to the response
        cursor.stream()
            .pipe(processDocument)
            .on('data', (data) => {
                if (!isFirstDocument) {
                    res.write(',');
                } else {
                    isFirstDocument = false;
                }
                res.write(data);
            })
            .on('error', (error) => {
                console.error("Error in stream:", error);
                res.status(500).end(']}');
            })
            .on('end', () => {
                res.write(']}');
                res.end();
            });

    } catch (error) {
        console.error("Error setting up booking stream:", error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

app.get('/log-auth-token', (req, res) => {
    let verifiedAuthToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    console.log('Unverified auth token:')
    console.log(req.headers.authorization);

    console.log('Verified auth token');
    console.log(verifiedAuthToken);

    res.send('Auth token has been logged in the backend');
}) 

app.post("/admin/availability", bookingController.handleUpdateAvailability);

app.listen(PORT, () => {
  console.log("Backend server running at http://localhost:" + PORT);
});
