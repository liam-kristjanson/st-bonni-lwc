const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for individual bookings
const CustomerBookingSchema = new Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  serviceType: { type: String, required: true },
  bookingTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false }
});

// Define the main booking schema
const BookingSchema = new Schema({
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bookings: [CustomerBookingSchema],
  isAvailable: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false }
});

// Create indexes for faster querying
BookingSchema.index({ date: 1 });
BookingSchema.index({ startTime: 1 });
BookingSchema.index({ endTime: 1 });

// Create the model
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;