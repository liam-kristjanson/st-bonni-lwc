import { useState } from "react";
import { Form, Spinner } from "react-bootstrap";
export default function AdminForm() {

const [startTime, setStartTime] = useState<string>("09:00");
const [endTime, setEndTime] = useState<string>("17:00");
const [date, setDate] = useState<string>("2024-06-22")
const [isLoading, setIsLoading] = useState<boolean>(false);

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
  

return( 
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
   


    )


}