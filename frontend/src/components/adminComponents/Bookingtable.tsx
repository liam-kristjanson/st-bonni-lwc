import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Badge,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";

import { Clock, User, Phone, Mail, Briefcase, Filter } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { DayData, Slot } from "../../types";

const SlotCard = ({ slot }: { slot: Slot }) => {
  const user = useAuthContext().state.user;

  const [reviewLink, setReviewLink] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startTime = new Date(slot.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(slot.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  function generateReviewLink(slot: Slot) {
    setIsLoading(true);

    const headers: HeadersInit = {
      "content-type": "application/json",
      authorization: user?.token ?? "none",
    };

    const body = JSON.stringify({
      customerName: slot.customerName ?? "Unknown",
      customerEmail: slot.email ?? "Unknown",
      customerPhone: slot.phoneNumber ?? "Unknown",
      serviceDate: slot.startTime,
    });

    fetch(import.meta.env.VITE_SERVER + "/admin/generate-review-link", {
      headers: headers,
      body: body,
      method: "POST",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setIsLoading(false);

        console.log(responseData);

        setReviewLink(responseData.reviewLink);
        setReviewId(responseData.reviewId);
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
        console.error(error);
      });
  }

  return (
    <Card className="mb-3" border={slot.isAvailable ? "success" : "warning"}>
      <Card.Body>
        <Row className="align-items-center">
          <Col md={3} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <Clock className="me-2 text-muted" size={24} />
              <span className="fs-5 fw-bold">
                {startTime} - {endTime}
              </span>
            </div>
          </Col>
          <Col md={5} className="mb-3 mb-md-0">
            {!slot.isAvailable && (
              <Row>
                <Col sm={6} className="mb-2 mb-sm-0">
                  <div className="d-flex align-items-center">
                    <User size={18} className="me-2 text-muted" />
                    <span>{slot.customerName || "N/A"}</span>
                  </div>
                  <div className="d-flex align-items-center mt-2">
                    <Phone size={18} className="me-2 text-muted" />
                    <span>{slot.phoneNumber || "N/A"}</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center">
                    <Mail size={18} className="me-2 text-muted" />
                    <span>{slot.email || "N/A"}</span>
                  </div>
                  <div className="d-flex align-items-center mt-2">
                    <Briefcase size={18} className="me-2 text-muted" />
                    <span>{slot.serviceType || "N/A"}</span>
                  </div>
                </Col>
              </Row>
            )}
            {slot.isAvailable && (
              <div className="fs-6 text-muted">
                No booking information available
              </div>
            )}
          </Col>
          <Col md={2} className="mb-3 mb-md-0 text-md-center">
            <Badge
              bg={slot.isAvailable ? "success" : "warning"}
              className="fs-6 px-3 py-2"
            >
              {slot.isAvailable ? "Available" : "Booked"}
            </Badge>
          </Col>

          {/* Needs to have proper feature for admin to change the db fields */}
          <Col md={2} className="text-md-end">
            {isLoading ? (
              <Spinner variant="primary" />
            ) : reviewLink ? (
              <a
                className="btn btn-warning text-white fw-bold"
                href={
                  encodeURI(
                    "mailto:" +
                      slot.email +
                      "?subject=" +
                      "Thank you for using St. Bonni Lawn and Window Care" +
                      "&body=" +
                      "Thank you for choosing to use St. Bonni Lawn and Window care for your property maintainence needs." +
                      "We hope our services have met or exceeded your expectations. We'd love to hear from you! Please take " +
                      " about 5 minutes to leave us a review using the following link:\n\n"
                  ) +
                  encodeURIComponent(reviewLink) +
                  encodeURI(
                    "\n\n" +
                      "You can also leave a review on our website using the following review code: " +
                      reviewId +
                      "\n\n" +
                      "We look forward to hearing from you, and hope to service your beautiful property again sometime soon!" +
                      "\n\n" +
                      "Regards,\n" +
                      "Management Team,\n" +
                      "St. Bonni Lawn and Window Care"
                  )
                }
              >
                Send Review Link
              </a>
            ) : (
              !slot.isAvailable && (
                <Button
                  onClick={() => generateReviewLink(slot)}
                  variant="primary text-white fw-bold"
                >
                  Generate Review Link
                </Button>
              )
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const BookingTable = () => {
  const [bookingData, setBookingData] = useState<DayData[]>([]);
  const [activeDate, setActiveDate] = useState<string>("");
  const [filter, setFilter] = useState<string>("today");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBookingData = useCallback(async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      filter,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/bookingsfilter?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch booking data");
      const data = await response.json();
      setBookingData(data.bookings);

      if (data.bookings.length > 0 && !activeDate) {
        setActiveDate(data.bookings[0].date);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, filter, activeDate]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleDateChange = (date: Date | null, isStart: boolean) => {
    if (date) {
      if (isStart) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [filter, startDate, endDate, fetchBookingData]);

  return (
    <Container fluid className="p-3 bg-white min-vh-100">
      <h1 className="mb-4 text-center">Booking Slots</h1>
      <Row className="mb-3">
        <Col md={12} className="mb-2">
          <div className="d-flex align-items-center">
            <Filter size={18} className="me-2 text-primary" />
            <span className="fw-bold text-primary">Filter Bookings</span>
          </div>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="today">Today's Slots</option>
            <option value="available">Available Slots</option>
            <option value="booked">Booked Slots</option>
            <option value="dateRange">Date Range</option>
          </Form.Select>
        </Col>
        {filter === "dateRange" && (
          <Col md={6}>
            <div className="d-flex">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => handleDateChange(date, true)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control me-2"
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => handleDateChange(date, false)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
              />
            </div>
          </Col>
        )}
      </Row>

      {isLoading ? (
        <Spinner variant="primary" />
      ) : bookingData.length === 0 ? (
        <div className="text-center">
          <h3>No available bookings</h3>
        </div>
      ) : (
        <>
          <Tabs
            activeKey={activeDate}
            onSelect={(k) => k && setActiveDate(k)}
            className="mb-3"
          >
            {bookingData.map((dayData) => (
              <Tab
                eventKey={dayData.date}
                title={`${new Date(dayData.date).toLocaleDateString()} (${
                  dayData.bookings.length
                })`}
                key={dayData.date}
              >
                <div className="border rounded">
                  <div className="bg-light p-2 border-bottom fw-bold">
                    <div className="row">
                      <div className="col">Time</div>
                    </div>
                  </div>
                  <div className="p-2">
                    {dayData.bookings.map((slot, index) => (
                      <SlotCard key={index} slot={slot} />
                    ))}
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </>
      )}
    </Container>
  );
};

export default BookingTable;
