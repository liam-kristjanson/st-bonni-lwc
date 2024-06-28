import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Appointment, Booking } from "../types";

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();
    const { date } = state;

    const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(date)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(date)}`);
    let isoDate = ((new Date(dateValue)).toISOString()).replace('Z', '+00:00');
    const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    const [bookedTimes, setBookedTimes] = useState<string[]>([])

    useEffect(() => {
        const letMeCheck = (new Date(dateValue)).toISOString()
        console.log(letMeCheck)

        fetch(import.meta.env.VITE_SERVER + "/bookings?date=" + dateValue)

        .then(dateResponse => {
            return dateResponse.json()
        })
        .then(dateData => {
            console.log("Date Data");
            console.log(dateData);

            dateData.map((booking : Booking) => {

                console.log("Booking Data");
                console.log(booking);

                //booking.bookings.map((appointment: Appointment) => {
                    //let timeString = appointment.bookingTime.toLocaleTimeString();

                    //console.log(timeString);
                //})

                //const bookedTime = (entry.startTime)

                //.substring(11, 16);
                //console.log(bookedTime)
            })
        })
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

                <Row className="justify-content-center mb-5">
                    <Col className="col-md-8">
                        <Card className="shadow">
                            <Card.Header className="fw-bold">
                                Booking Slots
                            </Card.Header>

                            <Card.Body>
                                <Table striped hover style={{"tableLayout": "fixed"}}>
                                    <tbody>
                                        <tr>
                                            <td className="text-center align-middle">9:00 AM - 10:00 AM</td>
                                            <td className="d-flex justify-content-center"><Button className="btn-lg w-75 fw-bold text-white" type="submit" variant="primary">Book</Button></td>
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