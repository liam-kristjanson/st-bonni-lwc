import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Badge,
  Form,
  Spinner,
} from "react-bootstrap";

import { Booking, Slot } from "../../types";
import { useAuthContext } from "../../hooks/useAuthContext";

interface SlotCardProps {
  slot: Slot;
}

const SlotCard = (props: SlotCardProps) => {
  const user = useAuthContext().state.user;

  const [reviewLink, setReviewLink] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  function generateReviewLink(slot: Slot) {
    setIsLoading(true);

    const headers : HeadersInit = {
      "content-type": "application/json",
      "authorization": user?.token ?? "none"
    }

    const body = JSON.stringify({
      customerName: slot.customerName ?? "Unknown",
      customerEmail: slot.email ?? "Unknown",
      customerPhone: slot.phoneNumber ?? "Unknown",
      serviceDate: slot.startTime
    });

    fetch(import.meta.env.VITE_SERVER + "/admin/generate-review-link", {
      headers: headers,
      body: body,
      method:"POST"
    })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      setIsLoading(false);

      console.log(responseData)

      setReviewLink(responseData.reviewLink);
      setReviewId(responseData.reviewId);
    })
    .catch((error) => {
      setIsLoading(false);
      alert(error);
      console.error(error);
    })
  }

  const startTime = new Date(props.slot.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(props.slot.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="d-flex align-items-center border-bottom py-2">
      <div className="flex-grow-1">
        <div className="fw-bold">
          {startTime} - {endTime}
        </div>
        <Badge bg={props.slot.isAvailable ? "success" : "warning"} className="me-2">
          {props.slot.isAvailable ? "Available" : "Booked"}
        </Badge>
        {!props.slot.isAvailable && (
          <>
            <br />
            <span className="me-2">
              <strong>Customer Name:</strong> {props.slot.customerName || "N/A"}
            </span>
            <br />
            <span>
              <strong>Phone Number:</strong> {props.slot.phoneNumber || "N/A"}
            </span>
            <br />
            <span>
              <strong>Email:</strong> {props.slot.email || "N/A"}
            </span>
            <br />
            <span>
              <strong>Service:</strong> {props.slot.serviceType || "N/A"}
            </span>
          </>
        )}
      </div>

      {isLoading ? (
        <Spinner variant="primary"/>
      ) : (
        reviewLink ? (
          <a className="btn btn-warning text-white fw-bold" href={encodeURI(
            "mailto:" + props.slot.email
            + "?subject="
            + "Thank you for using St. Bonni Lawn and Window Care"
            + "&body="
            + "Thank you for choosing to use St. Bonni Lawn and Window care for your property maintainence needs."
            + "We hope our services have met or exceeded your expectations. We'd love to hear from you! Please take "
            + " about 5 minutes to leave us a review using the following link:\n\n")
            + encodeURIComponent(reviewLink)
            + encodeURI("\n\n"
            + "You can also leave a review on our website using the following review code: " + reviewId
            + "\n\n"  
            + "We look forward to hearing from you, and hope to service your beautiful property again sometime soon!"
            + "\n\n"
            + "Regards,\n"
            + "Management Team,\n"
            + "St. Bonni Lawn and Window Care"
        )}>Send Review Link</a>
        ) : (
          !props.slot.isAvailable && <Button onClick={() => generateReviewLink(props.slot)}variant="primary text-white fw-bold">Generate Review Link</Button>
        )
      )}
      
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
      .catch((err) => console.error(err));
  }

  function filterSlots(slots: Slot[]) {
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
        {bookingData.map((dayData : Booking) => {
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
