import React, { useState, useMemo, useCallback } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import FilterSelect from "./BookingTableComponents/FilterSelect";
import SortableHeader from "./BookingTableComponents/SortableHeader";
import BookingRow from "./BookingTableComponents/BookingRow";
import ViewBookingModal from "./BookingTableComponents/ViewBookingModal";
import EditBookingForm from "./BookingTableComponents/EditBookingForm";
import EditIndividualBookingForm from "./BookingTableComponents/EditIndividualBookingForm";
import {
  formatDate,
  formatTime,
  sortBookings,
  filterBookings,
} from "../../helpers/adminDashboardHelpers/bookingsTableHelper";

interface Booking {
  _id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
  bookings: IndividualBooking[];
}

interface IndividualBooking {
  customerName: string;
  bookingTime: Date;
  duration: number;
  phoneNumber: string;
  isCompleted: boolean;
}

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onRefresh: () => void;
  alert: { show: boolean; variant: string; message: string };
  onUpdateBooking: (updatedBooking: Booking) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings = [],
  isLoading,
  onRefresh,
  alert,
  onUpdateBooking,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [editingIndividualBooking, setEditingIndividualBooking] = useState<{ booking: Booking; index: number } | null>(null);

  // Sort and filter bookings
  const sortedBookings = useMemo(() => sortBookings(bookings, sortConfig.key, sortConfig.direction), [bookings, sortConfig]);
  const filteredBookings = useMemo(() => filterBookings(sortedBookings, filterPeriod), [sortedBookings, filterPeriod]);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle editing a booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
  };

  // Handle updating a booking
  const handleUpdateBooking = useCallback((updatedBooking: Booking) => {
    // If the overall booking is marked as completed, mark all individual bookings as completed
    if (updatedBooking.isCompleted) {
      updatedBooking.bookings = updatedBooking.bookings.map(booking => ({
        ...booking,
        isCompleted: true,
      }));
    } else {
      // If the overall booking is marked as not completed, check if all individual bookings are still completed
      updatedBooking.isCompleted = updatedBooking.bookings.every(booking => booking.isCompleted);
    }
    onUpdateBooking(updatedBooking);
    setEditingBooking(null);
    if (viewBooking && viewBooking._id === updatedBooking._id) {
      setViewBooking(updatedBooking);
    }
  }, [onUpdateBooking, viewBooking]);

  // Handle viewing a booking
  const handleViewBooking = (booking: Booking) => {
    setViewBooking(booking);
  };

  // Handle editing an individual booking
  const handleEditIndividualBooking = (booking: Booking, individualBookingIndex: number) => {
    setEditingIndividualBooking({ booking, index: individualBookingIndex });
  };

  // Handle updating an individual booking
 // Handle updating an individual booking
const handleUpdateIndividualBooking = useCallback(async (updatedIndividualBooking: CustomerBooking) => {
  if (!editingIndividualBooking) return;

  const updatedBooking = {
    ...editingIndividualBooking.booking,
    bookings: editingIndividualBooking.booking.bookings.map((booking, index) => 
      index === editingIndividualBooking.index ? updatedIndividualBooking : booking
    )
  };

  // Check if all individual bookings are completed
  updatedBooking.isCompleted = updatedBooking.bookings.every(booking => booking.isCompleted);

  await onUpdateBooking(updatedBooking);
  setEditingIndividualBooking(null);

  if (viewBooking && viewBooking._id === updatedBooking._id) {
    setViewBooking(updatedBooking);
  }
}, [editingIndividualBooking, onUpdateBooking, viewBooking]);

  // Handle marking all individual bookings as complete
  const handleMarkAllComplete = useCallback((bookingId: string) => {
    const updatedBooking = bookings.find(b => b._id === bookingId);
    if (updatedBooking) {
      updatedBooking.isCompleted = true;
      updatedBooking.bookings = updatedBooking.bookings.map(b => ({
        ...b,
        isCompleted: true,
      }));
      handleUpdateBooking(updatedBooking);
    }
  }, [bookings, handleUpdateBooking]);

  return (
    <div>
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}
      <div className="d-flex justify-content-between mb-3">
        <Button onClick={onRefresh} disabled={isLoading}>
          Refresh
        </Button>
        <FilterSelect value={filterPeriod} onChange={setFilterPeriod} />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <SortableHeader name="date" label="Date" sortConfig={sortConfig} requestSort={requestSort} />
            <SortableHeader name="startTime" label="Start Time" sortConfig={sortConfig} requestSort={requestSort} />
            <SortableHeader name="endTime" label="End Time" sortConfig={sortConfig} requestSort={requestSort} />
            <th>Bookings</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center">Loading...</td>
            </tr>
          ) : filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">No bookings found</td>
            </tr>
          ) : (
            filteredBookings.map((booking) => (
              <BookingRow
                key={booking._id}
                booking={booking}
                onEdit={handleEditBooking}
                onView={handleViewBooking}
                onUpdateBooking={onUpdateBooking}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          )}
        </tbody>
      </Table>
      {editingBooking && (
        <EditBookingForm
          booking={editingBooking}
          onUpdate={handleUpdateBooking}
          onClose={() => setEditingBooking(null)}
        />
      )}
      {viewBooking && (
        <ViewBookingModal
          booking={viewBooking}
          onClose={() => setViewBooking(null)}
          onEditIndividualBooking={handleEditIndividualBooking}
          onMarkIndividualComplete={(index) =>
            handleUpdateIndividualBooking({
              ...viewBooking.bookings[index],
              isCompleted: true,
            })
          }
          onMarkAllComplete={handleMarkAllComplete}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
      {editingIndividualBooking && (
        <EditIndividualBookingForm
          booking={editingIndividualBooking.booking.bookings[editingIndividualBooking.index]}
          onUpdate={handleUpdateIndividualBooking}
          onClose={() => setEditingIndividualBooking(null)}
          allBookings={editingIndividualBooking.booking.bookings}
        />
      )}
    </div>
  );
};

export default BookingsTable;