// Format date to YYYY-MM-DD
export const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split("T")[0];
};

// Format time to 12-hour format
export const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};



// Sort bookings by key and direction
export const sortBookings = (bookings, key, direction) => {
  return [...bookings].sort((a, b) => {
    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
};

// Filter bookings by time period---not working as of now
export const filterBookings = (bookings, period) => {
  if (period === "all") return bookings;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of day for consistent comparisons

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(today);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0); // Set time to start of day for consistent comparisons

    switch (period) {
      case "week":
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      case "month":
        return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
      case "active":
        // Check if the booking has any uncompleted individual bookings
        return (
          booking.bookings &&
          booking.bookings.some(
            (individualBooking) => !individualBooking.isCompleted
          )
        );
      default:
        return true;
    }
  });
};
// Get completed and remaining booking counts
export const getBookingCounts = (booking) => {
  const completedBookings =
    booking.bookings?.filter((b) => b.isCompleted).length || 0;
  const remainingBookings = (booking.bookings?.length || 0) - completedBookings;
  return { completedBookings, remainingBookings };
};

// Update an individual booking within a group booking
export const updateIndividualBooking = (
  groupBooking,
  index,
  updatedIndividualBooking
) => {
  const updatedBookings = [...groupBooking.bookings];
  updatedBookings[index] = updatedIndividualBooking;

  const allCompleted = updatedBookings.every((b) => b.isCompleted);

  return {
    ...groupBooking,
    bookings: updatedBookings,
    isCompleted: allCompleted,
  };
};
