const dateHelpers = require("./dateHelpers.js");
const dbRetriever = require("./dbretriever.js");
const { ObjectId } = require("mongodb");

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await dbRetriever.find("bookings", {});
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

exports.handleUpdateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = req.body;

    const validatedBooking = {
      date: new Date(updatedBooking.date),
      startTime: new Date(updatedBooking.startTime),
      endTime: new Date(updatedBooking.endTime),
      isAvailable: updatedBooking.isAvailable,
      isCompleted: updatedBooking.isCompleted,
      bookings: updatedBooking.bookings.map(booking => ({
        customerName: booking.customerName,
        phoneNumber: booking.phoneNumber,
        address: booking.address,
        email: booking.email,
        serviceType: booking.serviceType,
        bookingTime: new Date(booking.bookingTime),
        duration: Number(booking.duration),
        isCompleted: Boolean(booking.isCompleted)
      }))
    };

    const result = await dbRetriever.updateOne(
      "bookings",
      { _id: new ObjectId(bookingId) },
      { $set: validatedBooking }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Booking updated successfully" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking" });
  }
};

// ... (keep the handleUpdateAvailability function as is)

exports.handleUpdateAvailability = async (req, res) => {
  try {
    console.log("--- handleUpdateAvailability ---");
    console.log(req.body);

    if (!req.body.startTime || !req.body.endTime || !req.body.date) {
      return res.status(400).json({ error: "Start time, date and end time are required" });
    }

    let selectedDate, startTimeDate, endTimeDate;
    try {
      selectedDate = dateHelpers.getDateFromStub(req.body.date);
      startTimeDate = dateHelpers.setTimeOnDate(req.body.date, req.body.startTime);
      endTimeDate = dateHelpers.setTimeOnDate(req.body.date, req.body.endTime);
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: "Invalid date format for start time, end time, or date" });
    }

    if (startTimeDate > endTimeDate) {
      return res.status(400).json({ error: "Start time must be before end time." });
    }

    let currentAvailability = await dbRetriever.fetchOneDocument("bookings", { date: selectedDate });

    if (currentAvailability) {
      console.log("Found existing availability for " + req.body.date + " updating...");

      const result = await dbRetriever.updateOne(
        "bookings",
        { date: selectedDate },
        {
          $set: {
            startTime: startTimeDate,
            endTime: endTimeDate,
            isCompleted: false,
            bookings: currentAvailability.bookings.map(booking => ({
              customerName: booking.customerName,
              phoneNumber: booking.phoneNumber,
              address: booking.address,
              email: booking.email,
              serviceType: booking.serviceType,
              bookingTime: booking.bookingTime,
              duration: booking.duration,
              isCompleted: Boolean(booking.isCompleted)
            })),
          }
        }
      );

      console.log("Updated record");
      console.log(result.modifiedCount);

      if (result.acknowledged) {
        res.status(200).json({ message: "Updated record" });
      } else {
        res.status(500).json({ error: "Error updating availability in database" });
      }
    } else {
      console.log("No availability found for " + req.body.date + " creating new...");
      let newAvailability = {
        date: selectedDate,
        startTime: startTimeDate,
        endTime: endTimeDate,
        bookings: [],
        isAvailable: true,
        isCompleted: false,
      };

      const result = await dbRetriever.insertOne("bookings", newAvailability);

      if (result.acknowledged) {
        res.status(200).json({ message: "Inserted record" });
      } else {
        res.status(500).json({ error: "Error inserting availability in database" });
      }
    }
  } catch (err) {
    console.error("booking failed:", err);
    res.status(400).json({ error: "An error occurred while trying to book" });
  }
};