import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiCalendarBlankOutline } from "@mdi/js";
import Calendar from "react-calendar";
import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";
import "../components/styles/ReactCalendar.css";

// Type definitions
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Booking {
  _id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  bookings: Array<CustomerBooking>;
  isAvailable: boolean;
  isCompleted: boolean;
}

interface CustomerBooking {
  customerName: string;
  phoneNumber: string;
  address: string;
  email: string;
  serviceType: string;
  bookingTime: Date;
  duration: number;  // in minutes
  isCompleted: boolean;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

interface CustomerInfo {
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  serviceType: string;
}

const SERVICE_TYPES = ["Lawn", "Glass"];
const API_BASE_URL = import.meta.env.VITE_SERVER;

export default function BookingAvail() {
  const { showMenu, handleMenuShow, handleMenuHide } = useNavbar();


  // State declarations
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("----");
  const [availStatus, setAvailStatus] = useState<string>("unavailable");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [maxDuration, setMaxDuration] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
    serviceType: "",
  });

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

    // Helper functions
  

  
 

  // Fetch bookings from the server
  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const bookingData: Booking[] = await response.json();
      const parsedBookings = bookingData.map(booking => ({
        ...booking,
        date: new Date(booking.date),
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        bookings: booking.bookings.map(b => ({
          ...b,
          bookingTime: new Date(b.bookingTime)
        }))
      }));
      setBookings(parsedBookings);
      const availableDates = [...new Set(parsedBookings
        .filter((booking: Booking) => booking.isAvailable)
        .map((booking: Booking) => booking.date.toISOString().split('T')[0]))];
      setAvailableDates(availableDates);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // TODO: Show an error message to the user
    }
  }, []);

  // Handle calendar date change
  const handleCalendarChange = useCallback((value: Value) => {
    if (!Array.isArray(value) && value) {
      const dateData = new Date(value);
      const dateValue = dateData.toISOString().split('T')[0];
      const displayDate = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(dateData);
  
      setSelectedDate(value);
      setModalText(displayDate);
  
      if (availableDates.includes(dateValue)) {
        setAvailStatus("available");
        const dailyBooking = bookings.find((booking) =>
          booking.date.toISOString().startsWith(dateValue)
        );
        if (dailyBooking) {
          const timeSlots = generateTimeSlots(dailyBooking);
          setAvailableTimeSlots(timeSlots);
        }
        setShowModal(true);
      } else {
        setAvailStatus("unavailable");
        setAvailableTimeSlots([]);
        setShowModal(true);
      }
    }
  }, [availableDates, bookings]);

  // Generate time slots for a given booking
  const generateTimeSlots = useCallback((dailyBooking: Booking): TimeSlot[] => {
    const startTime = new Date(dailyBooking.startTime);
    const endTime = new Date(dailyBooking.endTime);
    const slots: TimeSlot[] = [];

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const slotStartTime = new Date(currentTime);
      currentTime.setHours(currentTime.getHours() + 1);
      const slotEndTime = new Date(currentTime);

      const isBooked = dailyBooking.bookings.some((booking) => {
        const bookingStartTime = new Date(booking.bookingTime);
        const bookingEndTime = new Date(bookingStartTime.getTime() + booking.duration * 60000);
        return slotStartTime >= bookingStartTime && slotStartTime < bookingEndTime;
      });

      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        isBooked: isBooked,
      });
    }

    return slots;
  }, []);

  // Reset modal state
  const handleModalHide = useCallback(() => {
    setShowModal(false);
    setSelectedStartTime(null);
    setSelectedDuration(1);
    setMaxDuration(1);
    setCustomerInfo({
      name: "",
      phoneNumber: "",
      address: "",
      email: "",
      serviceType: "",
    });
  }, []);

  // Handle start time change
  const handleStartTimeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const startTime = new Date(e.target.value);
    setSelectedStartTime(startTime);
    if (availableTimeSlots.length > 0) {
      const maxHours = calculateMaxDuration(startTime);
      setMaxDuration(maxHours);
      setSelectedDuration(1);
    }
  }, [availableTimeSlots]);

  // Calculate maximum duration for a given start time
  const calculateMaxDuration = useCallback((startTime: Date): number => {
    const startIndex = availableTimeSlots.findIndex(
      (slot) => slot.startTime.getTime() === startTime.getTime()
    );
    if (startIndex === -1) return 0;

    let maxHours = 0;
    for (let i = startIndex; i < availableTimeSlots.length; i++) {
      if (availableTimeSlots[i].isBooked) break;
      maxHours++;
    }

    return maxHours;
  }, [availableTimeSlots]);

  // Handle duration change
  const handleDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value);
    setSelectedDuration(Math.min(Math.max(duration, 1), maxDuration));
  }, [maxDuration]);

  // Handle customer info change
  const handleCustomerInfoChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  }, []);

  // Handle booking appointment
  const handleBookAppointment = useCallback(async () => {
    if (
      !selectedDate ||
      !selectedStartTime ||
      !selectedDuration ||
      !customerInfo.name ||
      !customerInfo.serviceType
    )
      return;
  
    const dateValue = (selectedDate as Date).toISOString().split('T')[0];
    const bookingToUpdate = bookings.find((booking) =>
      ensureDate(booking.date).toISOString().startsWith(dateValue)
    );
  
    if (bookingToUpdate) {
      const newBooking: CustomerBooking = {
        customerName: customerInfo.name,
        phoneNumber: customerInfo.phoneNumber,
        address: customerInfo.address,
        email: customerInfo.email,
        serviceType: customerInfo.serviceType,
        bookingTime: selectedStartTime,
        duration: selectedDuration * 60, // Convert hours to minutes
        isCompleted: false,
      };
  
      const updatedBookings = [
        ...bookingToUpdate.bookings.map(b => ({
          ...b,
          bookingTime: ensureDate(b.bookingTime),
          isCompleted: b.isCompleted // Preserve the isCompleted status
        })),
        newBooking
      ];
  
      const updatedBooking: Booking = {
        ...bookingToUpdate,
        date: ensureDate(bookingToUpdate.date),
        startTime: ensureDate(bookingToUpdate.startTime),
        endTime: ensureDate(bookingToUpdate.endTime),
        bookings: updatedBookings,
        isCompleted: false, // Set to false when adding a new booking
      };
  
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingToUpdate._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBooking),
        });
        await response.json();
        fetchBookings();
        handleModalHide();
        // TODO: Show a success message or navigate to a confirmation page
      } catch (error) {
        console.error("Error:", error);
        // TODO: Show an error message
      }
    }
  }, [selectedDate, selectedStartTime, selectedDuration, customerInfo, bookings, fetchBookings, handleModalHide]);

  // Helper function to ensure we're always working with Date objects
  const ensureDate = (date: Date | string): Date => {
    return date instanceof Date ? date : new Date(date);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Icon path={mdiCalendarBlankOutline} size={1} />
          <div className="pe-4 pb-1 w-100 text-center">
            {modalText ?? "----"}
          </div>
        </Modal.Header>
  
        <Modal.Body>
          {availStatus === "unavailable" ? (
            <span style={{ color: "#e31717" }}>• Unavailable</span>
          ) : (
            <>
              <span style={{ color: "#2FA606" }}>• Available</span>
              <Form>
                <Alert variant="info">
                  Please select a start time and duration for your booking. The
                  maximum duration is limited by the available time slots.
                </Alert>
                <Form.Group className="mb-3">
                  <Form.Label>Select start time:</Form.Label>
                  <Form.Select
                    onChange={handleStartTimeChange}
                    value={selectedStartTime ? selectedStartTime.toISOString() : ""}
                  >
                    <option value="">Choose a start time</option>
                    {availableTimeSlots.map((slot, index) => (
                      <option
                        key={index}
                        value={slot.startTime.toISOString()}
                        disabled={slot.isBooked}
                      >
                        {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {slot.isBooked ? " (Booked)" : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {selectedStartTime && (
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (hours):</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={maxDuration}
                      value={selectedDuration}
                      onChange={handleDurationChange}
                    />
                    {selectedDuration > maxDuration && (
                      <Form.Text className="text-danger">
                        Maximum available duration is {maxDuration} hour(s)
                      </Form.Text>
                    )}
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={customerInfo.phoneNumber}
                    onChange={handleCustomerInfoChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address:</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={customerInfo.address}
                    onChange={handleCustomerInfoChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type of Service:</Form.Label>
                  <Form.Select
                    name="serviceType"
                    value={customerInfo.serviceType}
                    onChange={handleCustomerInfoChange}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_TYPES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
  
        <Modal.Footer>
          {availStatus === "unavailable" ? (
            <Button
              className="btn btn-danger text-white"
              onClick={handleModalHide}
            >
              Close
            </Button>
          ) : (
            <Button
              className="btn btn-primary text-white"
              onClick={handleBookAppointment}
              disabled={
                !selectedStartTime ||
                !selectedDuration ||
                !customerInfo.name ||
                !customerInfo.serviceType
              }
            >
              Book Appointment
            </Button>
          )}
        </Modal.Footer>
      </Modal>
  
      <div className="container">
        <Navbar
          showMenu={showMenu}
          menuHideHandler={handleMenuHide}
          menuShowHandler={handleMenuShow}
        />
      </div>
  
      <div
        className="container-fluid"
        style={{
          paddingBottom: "100px",
          marginBottom: "200px",
          backgroundImage: "url(/grassPatternGrey.png)",
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat",
        }}
      >
        <div style={{ paddingBottom: "40px" }} />
  
        <div className="row text-center">
          <div className="col">
            <h1 className="text-primary fw-bold">Booking Availability</h1>
          </div>
        </div>
  
        <div style={{ paddingBottom: "40px" }} />
  
        <div className="row">
          <div className="col d-flex justify-content-center">
            <Calendar
              onChange={handleCalendarChange}
              value={selectedDate}
              calendarType="gregory"
              next2Label={null}
              prev2Label={null}
              tileClassName={({ date }) => {
                const dateValue = date.toISOString().split("T")[0];
                return availableDates.includes(dateValue) ? "available" : "";
              }}
              minDate={new Date()}
            />
          </div>
        </div>
      </div>
    </>
  );

}
  
  
