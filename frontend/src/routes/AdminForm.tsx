import { useState } from "react";
import { Form } from "react-bootstrap";
export default function AdminForm() {

const [startTime, setStartTime] = useState<string>("09:00");
const [endTime, setEndTime] = useState<string>("17:00");

function handleStartTimeChange(e: React.ChangeEvent<HTMLInputElement>){
  setStartTime(e.target.value);
}
function handleEndTimeChange(e: React.ChangeEvent<HTMLInputElement>){
  setEndTime(e.target.value);

}
function handleSubmit(e: React.FormEvent<HTMLFormElement>){ 
  e.preventDefault();
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
        <Form.Label>Start Time</Form.Label>
        <Form.Control placeholder="Start Period /hr" type="time" value={startTime} onChange={handleStartTimeChange}/>
        
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control placeholder="End Period /hr" type="time" value={endTime} onChange={handleEndTimeChange}/>
      </Form.Group>
      <button type="submit" className="btn btn-secondary">Submit</button>
    </Form>
   


    )


}