import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext"
import { Booking } from "../types";
import AdminNavbar from "../components/AdminNavbar";
import useNavbar from "../components/hooks/useNavbar";
import ServerMessageContainer from "../components/ServerMessageContainer";
export default function AdminForm() {

 const user = useAuthContext().state.user; 
 const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();

const [startTime, setStartTime] = useState<string>("09:00");
const [endTime, setEndTime] = useState<string>("17:00");
const [date, setDate] = useState<string>('')
const [isLoading, setIsLoading] = useState<boolean>(true);
const [bookings, setBookings] = useState<Booking[]>();

const [serverMessage, setServerMessage] = useState<string>('');
const [serverMessageType, setServerMessageType] = useState<'success' | 'danger'>('success');

function handleStartTimeChange(e: React.ChangeEvent<HTMLInputElement>){
  setStartTime(e.target.value);
}

function handleEndTimeChange(e: React.ChangeEvent<HTMLInputElement>){
  setEndTime(e.target.value);

}

function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
  setDate(e.target.value);
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>){ 
  e.preventDefault();
  console.log("Processing time confirmation...");
  setIsLoading(true);

  const reqHeaders = {
    "content-type" : "application/json"
  }

  let response = await fetch(import.meta.env.VITE_SERVER + '/availability', {
    method: "POST",
    body: JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      date: date
    }),
    headers: reqHeaders
  });

  if (response.ok) {
    setServerMessageType('success')
  } else {
    setServerMessageType('danger');
  }

  const responseJson = await response.json();
  setIsLoading(false);

  setServerMessage(responseJson.message ?? responseJson.error);

  fetchAndUpdateSchedule();
}

  useEffect(() => {
    fetchAndUpdateSchedule();
  }, []);

  function fetchAndUpdateSchedule() {
    const requestHeaders: HeadersInit = {
      authorization: user?.authToken ?? "none"
    }

    fetch(import.meta.env.VITE_SERVER + '/bookings', {
      headers: requestHeaders
    })
    .then(response => {
      setIsLoading(false);
      console.log("Resposne " + response.statusText)
      return response.json();
    })
    .then(responseJson => {
      if (responseJson.error) {
        setServerMessage(responseJson.error);
        setServerMessageType('danger');
      }
      console.log(responseJson);
      setBookings(responseJson)
    })
    .catch(error => {
      console.error("Error fetching data", error);
    })
  }
  

return( 
  <>
      <Container>
        <AdminNavbar
          showMenu={showMenu}
          menuHideHandler={handleMenuHide}
          menuShowHandler={handleMenuShow}
        />
      </Container>

      <Container>
        <Row>
          <Col>
            <h1 className="text-primary mb-4">Schedule</h1>

            <Card className="shadow mb-5">
              <Card.Header className="fw-bold">
                Add/Change availability
              </Card.Header>

              <Card.Body>
                <Form className="" onSubmit={handleSubmit}>
                  

                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control placeholder="Date" type="date" value={date} onChange={handleDateChange} required/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control placeholder="Start Period /hr" type="time" value={startTime} onChange={handleStartTimeChange} required/>
                    
                  </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control placeholder="End Period /hr" type="time" value={endTime} onChange={handleEndTimeChange} required/>
                </Form.Group>

                {isLoading ? (
                  <Spinner/>
                ) : (          
                  <Button className="mb-3 w-100 btn-lg fw-bold text-white" type="submit" variant="primary">Submit</Button>
                )}

                {serverMessage && <ServerMessageContainer variant={serverMessageType} message={serverMessage}/>}
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow mb-5">
            <Card.Header className="fw-bold">
              Current Schedule
            </Card.Header>

            <Card.Body>
              <Table striped bordered hover variant=" success" >
              {/* <h3>Table Name</h3> */}
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>

                <tbody>

                  {isLoading ? (
                    <tr>
                      <td className="text-center" colSpan={3}><Spinner/> Schedule information loading...</td>
                    </tr>          
                  ) : (
                    bookings?.map((booking) => (
                      <tr>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{new Date(booking.startTime).toLocaleTimeString()}</td>
                      <td>{new Date(booking.endTime).toLocaleTimeString()}</td>
                    </tr>
                    ))
                  )}

                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
);


} 