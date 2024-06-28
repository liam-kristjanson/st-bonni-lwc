import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";

const EditBookingForm = ({ booking, onUpdate, onClose }) => {
  const [editedBooking, setEditedBooking] = useState(booking);

  useEffect(() => {
    // Format the initial times to ensure they're in HH:mm format
    setEditedBooking((prev) => ({
      ...prev,
      startTime: formatTime(prev.startTime),
      endTime: formatTime(prev.endTime),
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

    // Ensure the times are in the correct format before submitting
    const updatedBooking = {
      ...editedBooking,
      startTime: `${editedBooking.date}T${editedBooking.startTime}:00`,
      endTime: `${editedBooking.date}T${editedBooking.endTime}:00`,
    };

    onUpdate(updatedBooking);
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={editedBooking.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={editedBooking.startTime}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={editedBooking.endTime}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Available"
              name="isAvailable"
              checked={editedBooking.isAvailable}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Booking
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditBookingForm;
