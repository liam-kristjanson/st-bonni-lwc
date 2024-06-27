import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();
    const { date } = state;

    const [startTime, setStartTime] = useState<string>("09:00");
    const [endTime, setEndTime] = useState<string>("11:00");
    const [timeDiffer, setTimeDiffer] = useState<string>("10hr");

    const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    function handleDifferChange() {
        let arbStartDate = new Date(`2000-01-01T${startTime}Z`);
        let arbEndDate = new Date(`2000-01-01T${endTime}Z`);

        console.log("Dates");
        console.log(arbStartDate);
        console.log(arbEndDate);

        if (arbEndDate < arbStartDate) {
            arbEndDate.setDate(arbEndDate.getDate() + 1);
        }

        let milliDiffer = arbEndDate.getTime() - arbStartDate.getTime();

        console.log("Time Difference in Milliseconds")
        console.log(milliDiffer);

        let minDiffer = Math.floor(milliDiffer / 1000 / 60) % 60;
        let hourDiffer = Math.floor(milliDiffer / 1000 / 60 / 60);
      
        if (hourDiffer === 1) {
            setTimeDiffer(`${hourDiffer} hour, ${minDiffer} minutes`);
        } else {
            setTimeDiffer(`${hourDiffer} hours, ${minDiffer} minutes`);
        }
    }

    function handleStartChange(element: React.ChangeEvent<HTMLInputElement>) {
        setStartTime(element.target.value);
        handleDifferChange();
    }

    function handleEndChange(element: React.ChangeEvent<HTMLInputElement>) {
        setEndTime(element.target.value);
        handleDifferChange();
    }

    useEffect(() => {
        handleDifferChange();
    }, []);

    return (
        <>
            <Container>
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </Container>

            <Container className="fluid" style={{"paddingBottom": "100px"}}>
                <div style={{"paddingBottom": "20px"}}></div>

                <Row className="text-center mb-2">
                    <div className="col">
                        <h1 className="text-primary">{displayDate}</h1>
                    </div>
                </Row>

                <Row className="mb-5">
                    <Col>
                        <Card className="shadow">
                            <Card.Header className="fw-bold">
                                Book Time Slot
                            </Card.Header>

                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Time</Form.Label>
                                        <Form.Control placeholder="Start Time" type="time" value={startTime} onChange={handleStartChange} required/>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>End Time</Form.Label>
                                        <Form.Control placeholder="End Time" type="time" value={endTime} onChange={handleEndChange} required/>
                                    </Form.Group>
                                </Form>

                                <p className="mb-3">Duration: {timeDiffer}</p>

                                <Button className="mb-3 w-100 btn-lg fw-bold text-white" type="submit" variant="primary">Continue</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                <Row className="mb-2">
                    <Col>
                        <Card className="shadow">
                            <Card.Header className="fw-bold">
                                Currently Booked Slots
                            </Card.Header>

                            <Card.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>9:00:00 AM</td>
                                            <td>11:00:00 AM</td>
                                        </tr>

                                        <tr>
                                            <td>1:00:00 PM</td>
                                            <td>3:00:00 PM</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}