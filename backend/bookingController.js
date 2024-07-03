const { start } = require('repl');
const dateHelpers = require('./dateHelpers.js')
const dbRetriever = require('./dbretriever.js')
const helpers = require('./helpers.js');
const { ObjectId } = require('mongodb');

module.exports.handleUpdateAvailability = async(req, res) => {
    try{
      console.log("--- handleUpdateAvailability ---");
      console.log(req.body);
  
      //validation
      if (!req.body.startTime || !req.body.endTime || !req.body.date) {
        return res.status(400).json({error: "Start time, date and end time are required"});
      }
  
      let selectedDate, startTimeDate, endTimeDate

      //validate date format for each
      try {
        selectedDate = dateHelpers.getDateFromStub(req.body.date);
        startTimeDate = dateHelpers.setTimeOnDate(req.body.date, req.body.startTime);
        endTimeDate = dateHelpers.setTimeOnDate(req.body.date, req.body.endTime);
      } catch (e) {
        console.error(e);
        return res.status(400).json({error: "Invalid date format for start time, end time, or date"})
      }

      if ( startTimeDate > endTimeDate) {
        return res.status(400).json({error: "Start time must be before end time."})
      }
  
      //check if availability record exists on selected date
      let currentAvailability = await dbRetriever.fetchOneDocument('bookings', {date: selectedDate});
  
      if(currentAvailability) {
        console.log("Found existing availability for " + req.body.date + " updating...")

        const newAvailabilitySlots = expandAvailabilitySlots(currentAvailability.bookings, currentAvailability.endTime, endTimeDate)
        
        const result = await dbRetriever.updateOne('bookings', {date: selectedDate}, {$set: {'date': selectedDate, 'startTime': startTimeDate, 'endTime': endTimeDate, 'bookings': newAvailabilitySlots}})
  
        console.log("Upserted record")
        console.log(result.upsertedCount)
        
        if (result.acknowledged) {
          res.status(200).json({message: "Updated record"});
        } else {
          res.status(500).json({error: "Error updating availability to database"})
        }
      } else {
        console.log("No availability found for " + req.body.date + " creating new...");
        let newAvailability = {
          date: selectedDate,
          startTime: startTimeDate,
          endTime: endTimeDate,
          bookings: generateBookings(startTimeDate, endTimeDate),
          isAvailable: true
        }
  
        const result = await dbRetriever.insertOne('bookings', newAvailability);
  
        if (result.acknowledged) {
          res.status(200).json({message: "Inserted record"});
        } else {
          res.status(500).json({error: "Error inserting availability in database"});
        }
      }
    }catch (err) {
      console.error("booking failed:", err);
      res.status(500).json({ error: "An error occurred while trying to book" });
    }    
}

function generateBookings(startTime, endTime) {
  let generatedBookings = []

  let hourlyTimestamps = helpers.generateHourlyTimeslots(startTime, endTime);

  for (let i = 0; i<hourlyTimestamps.length-1; i++) {

    generatedBookings.push({
      startTime: new Date(hourlyTimestamps[i]),
      endTime: new Date(hourlyTimestamps[i+1]),
      isAvailable: true
    });

  }

  return generatedBookings;
}

module.exports.bookSlot = async (req, res) => {
  let dayRecord = await dbRetriever.fetchOneDocument('bookings', {date: new Date(req.body.selectedDate)});
  console.log(req.body);
  if (dayRecord) {
    for (let i = 0; i < dayRecord.bookings.length; i++) {
      if (new Date(dayRecord.bookings[i].startTime).getTime() === new Date(req.body.selectedTime).getTime())  {
        console.log("Matched record:");
        console.log(dayRecord.bookings[i]);

        dayRecord.bookings[i].isAvailable = false;
        dayRecord.bookings[i].customerName = req.body.name;
        dayRecord.bookings[i].email = req.body.email;
        dayRecord.bookings[i].phoneNumber = req.body.phone;
        dayRecord.bookings[i].address = req.body.address;
        dayRecord.bookings[i].serviceType = req.body.serviceOption;
        

        console.log("Modified record");
        console.log(dayRecord.bookings[i]);
      }
    }

    const result = await dbRetriever.updateOne('bookings', {date: new Date(req.body.selectedDate)}, {$set: {bookings: dayRecord.bookings}})

    if (result.acknowledged) {
      return res.status(200).json({message: "Request Sent"})
    }

    return res.status(500).json({error: "Error occured while writing to database"})
  }
  
  return res.status(400).json({error: "Failed to fetch day record"})
};

function expandAvailabilitySlots(bookingsArr, originalEndTime, newEndTime) {
  let newTimeslots = helpers.generateHourlyTimeslots(originalEndTime, newEndTime);

  for (let i = 1; i<newTimeslots.length-1; i++) {
    bookingsArr.push({
      startTime: new Date(newTimeslots[i]),
      endTime: new Date(newTimeslots[i + 1]),
      isAvailable: true
    })
  }

  return bookingsArr;
}

module.exports.generateReviewLink = (req, res) => {

  //validation
  if (!req.body.customerName || !req.body.customerEmail || !req.body.serviceDate) {
    return res.status(400).json({error: "Customer name, Customer email, and Service Date are required"});
  }

  const serviceDate = new Date(req.body.serviceDate);

  if (isNaN(serviceDate)) {
    return res.status(400).json({error: "Invalid date detected in serviceDate"});
  }

  const reviewObject = {
    _id: new ObjectId(),
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    serviceDate: serviceDate,
    isSubmitted: false
  }

  dbRetriever.insertOne('reviews', reviewObject)
  .then((result) => {
    if (result.acknowledged) {
      const reviewLink = process.env.FRONT_ORIGIN + "?review=true&id=" + result.insertedId
      return res.status(200).json({message: "Created new review link", reviewLink: reviewLink, reviewId: result.insertedId});
    } else {
      throw new Error("Review insertion was not acknowledged");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
  })
}

module.exports.getFilteredBookings = async (req, res) => {
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
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        startDateTime.setHours(0, 0, 0, 0);
        endDateTime.setHours(23, 59, 59, 999);

        query.startTime = { $gte: new Date(startDateTime), $lte: new Date(endDateTime) };
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

    // Execute aggregation
    const bookings = await dbRetriever.aggregateDocuments("bookings", aggregationPipeline);

    res.json({ bookings });
  } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
}