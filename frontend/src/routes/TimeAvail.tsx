import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";

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
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

    //const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(date)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(date)}`);
    const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    const [timeslots, setTimeslots] = useState<Booking[]>([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/bookings?date=" + encodeURIComponent(date.toLocaleDateString()))

        .then(dateResponse => {
            return dateResponse.json()
        })
        .then(dateData => {
            console.log(dateData);
            setTimeslots(dateData.bookings);
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
                <div style={{"paddingBottom": "30px"}}></div>

                <Row className="text-center mb-2">
                    <div className="col">
                        <h1 className="text-primary">{displayDate}</h1>
                    </div>
                </Row>

                <div style={{"paddingBottom": "20px"}}></div>

                <Row className="justify-content-center mb-5">
                    <Col className="col-md-8">
                        <Card className="shadow">
                            <Card.Header className="fw-bold">
                                Booking Slots
                            </Card.Header>

                            <Card.Body>
                                <Table hover style={{"tableLayout": "fixed"}}>
                                    <tbody>
                                        {timeslots.map((timeslot) => (
                                            <tr>
                                                <td className="text-center align-middle">{new Date(timeslot.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                                                <td className="text-center align-middle">{new Date(timeslot.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                                                
                                                {timeslot.isAvailable === true ? (
                                                    <td><td className="d-flex justify-content-center"><Button onClick={() => {setShowBookingModal(true)}}className="btn-sm w-75 fw-bold text-white" type="submit" variant="primary">Book Now</Button></td></td>
                                                ) : (
                                                    <td><td className="d-flex justify-content-center"><Button className="btn-sm w-75 fw-bold text-white" type="submit" variant="danger" disabled>Unavailable</Button></td></td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showBookingModal} onHide={() => {setShowBookingModal(false)}}>
                <Modal.Header closeButton>
                    Request booking for {displayDate}
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                Email:
                            </Form.Label>

                            <Form.Control type="email"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}