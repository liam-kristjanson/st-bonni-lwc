import React from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Plus } from "lucide-react";

const CreateAvailabilityForm = ({ newBooking, onSubmit, onChange }) => {
  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const bookingDateTime = new Date(
      newBooking.date + "T" + newBooking.startTime
    );

    if (bookingDateTime < now) {
      newErrors.date = "Booking time must be in the future";
    }

    // Check if end time is after start time
    if (newBooking.startTime && newBooking.endTime) {
      const start = new Date(`2000-01-01T${newBooking.startTime}`);
      const end = new Date(`2000-01-01T${newBooking.endTime}`);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (newBooking.startTime && newBooking.endTime) {
      const start = new Date(`2000-01-01T${newBooking.startTime}`);
      const end = new Date(`2000-01-01T${newBooking.endTime}`);
      const durationInMinutes = (end - start) / (1000 * 60);

      if (durationInMinutes > 1440 || durationInMinutes % 60 !== 0) {
        newErrors.duration =
          "Duration must be less than or equal to 24 hours and a multiple of 60 minutes";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <Card.Title>Create New Availability</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={newBooking.date}
              onChange={onChange}
              isInvalid={!!errors.date}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.date}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={newBooking.startTime}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={newBooking.endTime}
              onChange={onChange}
              isInvalid={!!errors.endTime}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.endTime}
            </Form.Control.Feedback>
          </Form.Group>
          {errors.duration && <Alert variant="danger">{errors.duration}</Alert>}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Available"
              name="isAvailable"
              checked={newBooking.isAvailable}
              onChange={onChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            <Plus className="mr-2" /> Create Availability
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateAvailabilityForm;
