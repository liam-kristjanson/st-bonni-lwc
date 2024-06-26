import { Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Booking } from "../types";
export default function AdminForm() {

 const{ user } = useAuth(); 

const [startTime, setStartTime] = useState<string>("09:00");
const [endTime, setEndTime] = useState<string>("17:00");
const [date, setDate] = useState<string>("2024-06-22")
const [isLoading, setIsLoading] = useState<boolean>(false);
const [bookings, setBookings] = useState<Booking[]>();

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

  const responseJson = await response.json();
  setIsLoading(false);
  alert(responseJson.message ?? responseJson.error ?? "An error occured");

  const prepareBody = {
    startTime: startTime, 
    endTime: endTime
  }
  console.log(prepareBody);
}

  useEffect(() => {
      const requestHeaders: HeadersInit = {
        authorization: user?.authToken ?? "none"
      }

      fetch(import.meta.env.VITE_SERVER + '/bookings', {
        headers: requestHeaders
      })
      .then(response => {
        if (!response.ok) throw new Error('Bad server response')
        console.log("Resposne " + response.statusText)
        return response.json();
      })
      .then(responseJson => {
        console.log(responseJson);
        setBookings(responseJson)
      })
      .catch(error => {
        console.error("Error fetching data", error);
      })
  }, []);
  

return( 
  <>
      <Form className=" bg-success p-4" onSubmit={handleSubmit}>
        <h1 className=""> Admin Availability Schedule</h1>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control placeholder="Date" type="date" value={date} onChange={handleDateChange}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control placeholder="Start Period /hr" type="time" value={startTime} onChange={handleStartTimeChange}/>
          
        </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control placeholder="End Period /hr" type="time" value={endTime} onChange={handleEndTimeChange}/>
      </Form.Group>

      {isLoading ? (
        <Spinner/>
      ) : (
        <button type="submit" className="btn btn-secondary">Submit</button>
      )}
    </Form>
   
    <div>

      <p>{JSON.stringify(bookings)}</p>
      <Table striped bordered hover variant=" success" >
      {/* <h3>Table Name</h3> */}
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
        </tr>

        <tbody>
        <tr>
        <td>1</td>
          {bookings?.map(bookTable => (
          
         
        ))}
        </tr>

        </tbody>
      </thead>
 
   
    </Table>
   
    </div>
</>

    );


} 