import React, { useState } from 'react';
import { Modal, Button, ListGroup } from "react-bootstrap";
import { FaEdit, FaCheck } from "react-icons/fa";

const ViewBookingModal = ({
  booking,
  onClose,
  onEditIndividualBooking,
  formatDate,
  formatTime,
}) => {
  // State to manage individual bookings
  const [individualBookings, setIndividualBookings] = useState(booking.bookings || []);

  // Function to mark an individual booking as complete
  const handleMarkComplete = (index) => {
    const updatedBookings = [...individualBookings];
    updatedBookings[index].isCompleted = true;
    setIndividualBookings(updatedBookings);
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Booking Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display main booking details */}
        <p><strong>Date:</strong> {formatDate(booking.date)}</p>
        <p><strong>Start Time:</strong> {formatTime(booking.startTime)}</p>
        <p><strong>End Time:</strong> {formatTime(booking.endTime)}</p>
        <p><strong>Status:</strong> {booking.isCompleted ? "Completed" : "Not Completed"}</p>

        <h5>Individual Bookings:</h5>
        <ListGroup>
          {individualBookings.map((individualBooking, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {/* Display individual booking details */}
              <div>
                <p><strong>Customer:</strong> {individualBooking.customerName}</p>
                <p><strong>Time:</strong> {formatTime(individualBooking.bookingTime)}</p>
                <p><strong>Duration:</strong> {individualBooking.duration} minutes</p>
                <p><strong>Phone Number:</strong> {individualBooking.phoneNumber}</p>
                <p><strong>Status:</strong> {individualBooking.isCompleted ? "Completed" : "Not Completed"}</p>
              </div>
              {/* Action buttons */}
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEditIndividualBooking(booking, index)}
                >
                  <FaEdit /> Edit
                </Button>
                {!individualBooking.isCompleted && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMarkComplete(index)}
                  >
                    <FaCheck /> Mark Complete
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewBookingModal;