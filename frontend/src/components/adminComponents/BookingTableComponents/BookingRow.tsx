import React from "react";
import { Button, Badge } from "react-bootstrap";
import { FaEye, FaCheck } from "react-icons/fa";

const BookingStatusBadge = ({ booking }) => {
  if (!booking.bookings || booking.bookings.length === 0) {
    return <Badge bg="secondary">No Bookings</Badge>;
  }

  const remainingBookings = booking.bookings.filter(b => !b.isCompleted).length;
  
  if (remainingBookings === 0) {
    return <Badge bg="success">All Completed</Badge>;
  }

  return <Badge bg="warning">{remainingBookings} Remaining</Badge>;
};

const BookingRow = ({
  booking,
  onEdit,
  onView,
  onUpdateBooking,
  formatDate,
  formatTime,
}) => {
  const handleMarkComplete = async () => {
    const updatedBookings = booking.bookings.map(b => ({ ...b, isCompleted: true }));
    const updatedBooking = { ...booking, bookings: updatedBookings };
    await onUpdateBooking(updatedBooking);
  };

  const remainingBookings = booking.bookings ? booking.bookings.filter(b => !b.isCompleted).length : 0;

  return (
    <tr>
      <td>{formatDate(booking.date)}</td>
      <td>{formatTime(booking.startTime)}</td>
      <td>{formatTime(booking.endTime)}</td>
      <td>{booking.bookings?.length || 0}</td>
      <td>
        <BookingStatusBadge booking={booking} />
      </td>
      <td>
        <Button
          variant="primary"
          size="sm"
          className="me-2"
          onClick={() => onEdit(booking)}
        >
          Edit
        </Button>
        <Button
          variant="info"
          size="sm"
          className="me-2"
          onClick={() => onView(booking)}
        >
          <FaEye /> View
        </Button>
        {remainingBookings > 0 && (
          <Button variant="success" size="sm" onClick={handleMarkComplete}>
            <FaCheck /> Mark All Complete
          </Button>
        )}
      </td>
    </tr>
  );
};

export default BookingRow;