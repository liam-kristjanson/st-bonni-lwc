import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Badge,
  Form,
} from "react-bootstrap";

const SlotCard = ({ slot }) => {
  const startTime = new Date(slot.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(slot.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="d-flex align-items-center border-bottom py-2">
      <div className="flex-grow-1">
        <div className="fw-bold">
          {startTime} - {endTime}
        </div>
        <Badge bg={slot.isAvailable ? "success" : "warning"} className="me-2">
          {slot.isAvailable ? "Available" : "Booked"}
        </Badge>
        {!slot.isAvailable && (
          <>
            <br />
            <span className="me-2">
              <strong>Customer Name:</strong> {slot.customerName || "N/A"}
            </span>
            <br />
            <span>
              <strong>Phone Number:</strong> {slot.phoneNumber || "N/A"}
            </span>
            <br />
            <span>
              <strong>Email:</strong> {slot.email || "N/A"}
            </span>
            <br />
            <span>
              <strong>Service:</strong> {slot.serviceType || "N/A"}
            </span>
          </>
        )}
      </div>
      <Button variant="outline-primary" size="sm">
        Manage Slot
      </Button>
    </div>
  );
};

function BookingTable() {
  const [bookingData, setBookingData] = useState([]);
  const [activeDate, setActiveDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookingData();
  }, []);

  function fetchBookingData() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_SERVER}/bookings`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch booking data");
        return response.json();
      })
      .then((data) => {
        setBookingData(data);
        setLoading(false);
        if (data.length > 0)
          setActiveDate(new Date(data[0].date).toLocaleDateString());
      })
      .catch((err) => console.log("An unknown error occurred"));
  }

  function filterSlots(slots) {
    return slots.filter((slot) => {
      if (filter === "available") return slot.isAvailable;
      if (filter === "booked") return !slot.isAvailable;
      return true;
    });
  }

  //to display error/loading message while fetching data from server

  if (loading)
    return <div className="text-center p-5">Loading booking data...</div>;

  return (
    <Container fluid className="p-3">
      <h1 className="mb-4 text-center">Booking Slots (Admin View)</h1>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Slots</option>
            <option value="available">Available Slots</option>
            <option value="booked">Booked Slots</option>
          </Form.Select>
        </Col>
      </Row>
      <Tabs
        activeKey={activeDate}
        onSelect={(k) => k && setActiveDate(k)}
        className="mb-3"
      >
        {bookingData.map((dayData) => {
          const date = new Date(dayData.date).toLocaleDateString();
          const filteredSlots = filterSlots(dayData.bookings);
          return (
            <Tab
              eventKey={date}
              title={`${date} (${filteredSlots.length})`}
              key={date}
            >
              <div className="border rounded">
                <div className="bg-light p-2 border-bottom fw-bold">
                  <div className="row">
                    <div className="col">Time</div>
                  </div>
                </div>
                <div className="p-2">
                  {filteredSlots.map((slot, index) => (
                    <SlotCard key={index} slot={slot} />
                  ))}
                </div>
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}

export default BookingTable;
