const { start } = require('repl');
const dateHelpers = require('./dateHelpers.js')
const dbRetriever = require('./dbretriever.js')
const helpers = require('./helpers.js');

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