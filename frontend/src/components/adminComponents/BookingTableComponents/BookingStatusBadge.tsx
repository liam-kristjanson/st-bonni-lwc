import { Badge } from "react-bootstrap";

const BookingStatusBadge = ({ booking }) => {
  const completedBookings = booking.bookings?.filter((b) => b.isCompleted).length || 0;
  const totalBookings = booking.bookings?.length || 0;
  const remainingBookings = totalBookings - completedBookings;

  if (totalBookings === 0) {
    return <Badge bg="secondary">No bookings</Badge>;
  } else if (booking.isCompleted) {
    return <Badge bg="success">Complete</Badge>;
  } else {
    return <Badge bg="warning">{remainingBookings} remaining</Badge>;
  }
};

export default BookingStatusBadge;