import { useState, useEffect, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import QuickStatsCard from "./QuickStatsCard";
import CreateBookingForm from "./BookingTableComponents/CreateAvailabilityForm";
import BookingsTable from "./BookingsTable";
import {
  fetchData,
  updateData,
  createData,
} from "../../helpers/adminDashboardHelpers/createAvailabilityTabHelper";

const CreateAvailabilityTab = ({ stats, alert, showAlert }) => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchData(
        `${import.meta.env.VITE_SERVER}/bookings`,
        "Failed to fetch bookings"
      );
      setBookings(data);
    } catch (error) {
      showAlert(error.message, "danger");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (newBooking.startTime >= newBooking.endTime) {
      showAlert("Start time must be earlier than end time", "danger");
      return;
    }

    try {
      const data = await createData(
        `${import.meta.env.VITE_SERVER}/availability`,
        newBooking,
        "Failed to create the availability"
      );
      showAlert(data.message, "success");
      fetchBookings();
      setNewBooking({
        date: "",
        startTime: "",
        endTime: "",
        isAvailable: true,
      });
    } catch (error) {
      showAlert(error.message, "danger");
    }
  };

  const handleNewBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBooking((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateBooking = async (updatedBooking) => {
    try {
      const data = await updateData(
        `${import.meta.env.VITE_SERVER}/bookings/${updatedBooking._id}`,
        updatedBooking,
        "Failed to update booking"
      );
      showAlert(data.message, "success");
      fetchBookings();
    } catch (error) {
      showAlert(error.message, "danger");
    }
  };

  return (
    <Row>
      <Col md={4}>
        <QuickStatsCard stats={stats} />
        <CreateBookingForm
          newBooking={newBooking}
          onSubmit={handleCreateBooking}
          onChange={handleNewBookingChange}
        />
      </Col>
      <Col md={8}>
        <BookingsTable
          bookings={bookings}
          isLoading={isLoading}
          onRefresh={fetchBookings}
          alert={alert}
          onUpdateBooking={handleUpdateBooking}
        />
      </Col>
    </Row>
  );
};

export default CreateAvailabilityTab;
