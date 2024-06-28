import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";

const EditIndividualBookingForm = ({ booking, onUpdate, onClose }) => {
  const [editedBooking, setEditedBooking] = useState({
    ...booking,
    completed: booking.completed || false,
  });

  useEffect(() => {
    // Format the initial booking time when the component mounts
    setEditedBooking((prev) => ({
      ...prev,
      bookingTime: formatTime(prev.bookingTime),
    }));
  }, [booking]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toTimeString().slice(0, 5); // Returns time in HH:mm format
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedBooking((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure the booking time is in the correct format before submitting
    const updatedBooking = {
      ...editedBooking,
      bookingTime: `${booking.bookingTime.split("T")[0]}T${
        editedBooking.bookingTime
      }:00`,
    };

    onUpdate(updatedBooking);
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Individual Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={editedBooking.customerName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Booking Time</Form.Label>
            <Form.Control
              type="time"
              name="bookingTime"
              value={editedBooking.bookingTime}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={editedBooking.duration}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Mark as Completed"
              name="completed"
              checked={editedBooking.completed}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Individual Booking
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditIndividualBookingForm;
