import { useEffect, useState } from 'react';

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import HeroGraphic from "../components/HeroGraphic.tsx";

import Calendar from 'react-calendar';
import "../components/styles/ReactCalendar.css"

import { useNavigate } from "react-router-dom";

import { Button, Col, Container, Modal, Row } from 'react-bootstrap';

import Icon from '@mdi/react';
import { mdiCalendar, mdiCalendarBlankOutline } from '@mdi/js';
import { Booking } from '../types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Value>(new Date());
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const [modalText, setModalText] = useState<string>("----");

    const [availStatus, setAvailStatus] = useState<string>("unavailable");
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/bookings")

        .then(bookingResponse => {
            return bookingResponse.json();
        })

        .then(bookingData => {
            const bookingDatesAvailable = bookingData.filter((bookingDate : Booking) => {
                return bookingDate.isAvailable;
            })

            bookingDatesAvailable.map((booking : Booking) => {
                const validDate = (booking.date).substring(0, 10);

                if (!availableDates.includes(validDate)) {
                    setAvailableDates(availableDates => [...availableDates, validDate])
                }
            })
        })
    });

    function handleCalendarChange(value: Value) {
        if (!Array.isArray(value)) {
            const date = new Date(value ?? "----");
            
            const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(date)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(date)}`);
            const displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

            setSelectedDate(value);
            setShowModal(true);
            setModalText(displayDate);

            if (!availableDates.includes(dateValue)) {
                setAvailStatus("unavailable");
            } else {
                setAvailStatus("available");
            }
        }
    }

    function handleModalHide(){
        setShowModal(false);
    }

    return (
        <>
            <Modal show={showModal} onHide={handleModalHide}>
                <Modal.Header closeButton>
                    <Icon path={mdiCalendarBlankOutline} size={1} /> &nbsp;&nbsp;&nbsp;&nbsp; <div className="pe-4 pb-1 w-100 text-center">{modalText?.toString() ?? "----"}</div>
                </Modal.Header>

                <Modal.Body>
                    {availStatus === "unavailable" ? (
                        <span style={{"color": "#e31717"}}>• Unavailable</span>
                    ) : (
                        <span style={{"color": "#2FA606"}}>• Available</span>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    {availStatus === "unavailable" ? (
                        <Button
                            className={"btn btn-danger text-white"}
                            style={{"marginLeft": "100px"}}
                            onClick={() => navigate("/time-availability")}
                            disabled
                        >
                            Check Availability
                        </Button>
                    ) : ( 
                        <Button
                            className={"btn btn-primary text-white"}
                            style={{"marginLeft": "100px"}}
                            onClick={() => navigate("/time-availability", {state: {date: selectedDate}})}
                        >
                            Check Availability
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Container>
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </Container>

            <HeroGraphic
                        imageSource="/house-lawn-cropped-3.jpg"
                        graphicText=" Booking Availability"
                        iconPath={mdiCalendar}
                    />
            
            <Container className="fluid" style={{"paddingBottom": "100px"}}>
                <Row>
                    <Col className="d-flex justify-content-center">

                        <Calendar onChange={handleCalendarChange}
                            value={selectedDate}
                            calendarType="gregory"
                            next2Label={null}
                            prev2Label={null}

                            tileClassName = {({date}) => {
                                const dateData = new Date(date ?? "----");
                                const dateValue = (`${new Intl.DateTimeFormat('en', { year: "numeric" }).format(dateData)}-${new Intl.DateTimeFormat('en', { month: "2-digit" }).format(dateData)}-${new Intl.DateTimeFormat('en', { day: "2-digit" }).format(dateData)}`);

                                if (availableDates.includes(dateValue)) {
                                    return  'available'
                                }
                            }}

                            minDate = {
                                new Date()
                            }/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}