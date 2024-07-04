import { Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from "react-bootstrap";

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Booking } from "../types";

import Icon from '@mdi/react';
import { mdiMenuLeft } from '@mdi/js';

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();
    const [showModal, setShowModal] = useState<boolean>(false);

    const navigate = useNavigate();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [serviceOption, setServiceOption] = useState<string>("");
    const [timeslots, setTimeslots] = useState<Booking[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("");

    const [serverMessage, setServerMessage] = useState<string>('');
    const [serverMessageType, setServerMessageType] = useState<'success' | 'danger'>('success');

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { state } = useLocation();
    const { date } = state;

    //const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(date)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(date)}`);
    const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setPhone(e.target.value);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const requestBody = {
            name: fullName,
            email: email,
            phone: phone,
            address: address,
            serviceOption: serviceOption,
            selectedTime: selectedTime,
            selectedDate: date.toISOString()
        }

        const requestHeaders: HeadersInit = {
            "content-type": "application/json"
        }

        //console.log(requestBody);

        fetch(import.meta.env.VITE_SERVER + "/book-slot", {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (response.ok) {
                setServerMessageType('success');
            } else {
                setServerMessageType('danger');
            }

            return response.json()
        })
        .then(responseData => {
            setServerMessage(responseData.message ?? responseData.error);

            if (responseData.message) {
                navigate("/confirmation", {state: {
                    name: fullName,
                    email: email,
                    phone: phone,
                    address: address,
                    serviceOption: serviceOption,
                    selectedTime: selectedTime,
                    selectedDate: date.toISOString(),
                }});
            }
        })
        .catch(err => {
            console.error("Error fetching data: " + err);
        })
    }

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/bookings?date=" + encodeURIComponent(date.toLocaleDateString()))

        .then(dateResponse => {
            setIsLoading(false);
            return dateResponse.json()
        })
        .then(dateData => {
            setTimeslots(dateData.bookings);
        })
    }, [date]);

    return (
        <>
            <Modal show={showModal} onHide={() => {setShowModal(false)}}>
                <Modal.Header closeButton>
                    Request booking for {displayDate} at {new Date(selectedTime).toLocaleString([], {hour:"numeric", minute:"2-digit"})}
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={(e) => {handleSubmit(e)}}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control onChange={(e) => {setFullName(e.target.value)}}type="text" placeholder="Enter name" required/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)}type="email" placeholder="Enter email" required/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control onChange={(e) => handlePhoneChange(e)} type="tel" placeholder="Enter number" required/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Service Address</Form.Label>
                            <Form.Control onChange={(e) => {setAddress(e.target.value)}}type="text" placeholder="Enter address" required/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Service Options</Form.Label>
                            <Form.Select onChange={(e) => setServiceOption(e.target.value)}required>
                                <option value="" selected disabled hidden> -- Select a service offering -- </option>
                                <option value="Lawn">Lawn</option>
                                <option value="Windows">Windows</option>
                                <option value="Lawn & Windows">Lawn & Windows</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 text-center">
                            {serverMessage ? (
                                <Button className="btn-sm w-50 fw-bold text-white" type="submit" variant={serverMessageType} disabled>{serverMessage}</Button>
                            ) : (
                                <Button className="btn-sm w-50 fw-bold text-white" type="submit" variant="primary">Submit</Button>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>

            <Container>
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </Container>

            <a style={{"position": "absolute", "fontSize": "140%", "cursor": "pointer"}} onClick={() => navigate("/booking-availability")}>
                <Icon path={mdiMenuLeft} size={1.4} style={{"verticalAlign": "text-top"}}/>
                Back
            </a>

            <Container className="fluid" style={{"paddingBottom": "100px"}}>
                <div style={{"paddingBottom": "30px"}}></div>

                <Row className="text-center mb-2">
                    <Col>
                        <h1 className="text-primary">{displayDate}</h1>
                    </Col>
                </Row>

                <div style={{"paddingBottom": "20px"}}></div>

                <Row className="justify-content-center mb-5">
                    <Col className="col-md-8">
                        <Card className="shadow">
                            <Card.Header className="fw-bold">
                                Booking Slots
                            </Card.Header>

                            <Card.Body>
                                {isLoading ? (
                                    <Spinner/>
                                ) : (
                                    <Table hover style={{"tableLayout": "fixed"}}>
                                        <tbody>
                                            {timeslots.map((timeslot) => (
                                                <tr>
                                                    <td className="text-center align-middle">{new Date(timeslot.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                                                    <td className="text-center align-middle">{new Date(timeslot.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                                                    
                                                    {timeslot.isAvailable === true ? (
                                                        <td><td className="d-flex justify-content-center"><Button onClick={() => {setShowModal(true), setSelectedTime(timeslot.startTime.toString())}} className="btn-sm w-75 fw-bold text-white" type="submit" variant="primary">Book</Button></td></td>
                                                    ) : (
                                                        <td><td className="d-flex justify-content-center"><Button className="btn-sm w-75 fw-bold text-white" type="submit" variant="danger" disabled>Booked</Button></td></td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}