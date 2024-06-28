import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Appointment, Booking } from "../types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();
    const { date } = state;

    const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(date)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(date)}`);
    const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();
    const [bookedTimes, setBookedTimes] = useState<string[]>([])

    const [timeTable, setTimeTable] = useState<string[]>([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/bookings?date=" + dateValue)

        .then(dateResponse => {
            return dateResponse.json()
        })
        .then(dateData => {
            dateData.map((booking : Booking) => {

                booking.bookings.map((appointment: Appointment) => {
                    //console.log(new Date(appointment.bookingTime));
                })
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