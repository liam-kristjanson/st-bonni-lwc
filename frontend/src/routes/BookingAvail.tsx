import { useEffect, useState } from 'react';

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import Calendar from 'react-calendar';
import "../components/styles/ReactCalendar.css"

import { useNavigate } from "react-router-dom";

import { Button, Modal } from 'react-bootstrap';

import Icon from '@mdi/react';
import { mdiCalendarBlankOutline } from '@mdi/js';
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
            console.log(bookingResponse.statusText);
            return bookingResponse.json();
        })

        .then(bookingData => {
            let bookingDatesAvailable = bookingData.filter((bookingDate : Booking) => {
                return bookingDate.isAvailable;
            })

            bookingDatesAvailable.map((booking : Booking) => {
                let validDate = (booking.date).substring(0, 10);

                if (!availableDates.includes(validDate)) {
                    availableDates.push(validDate);
                }
            })
        })
    }, []);

    function handleCalendarChange(value: Value) {
        if (!Array.isArray(value)) {
            let dateData = new Date(value ?? "----");
            let year = new Intl.DateTimeFormat('en', { year: "numeric" }).format(dateData);
            let month = new Intl.DateTimeFormat('en', { month: "2-digit" }).format(dateData);
            let day = new Intl.DateTimeFormat('en', { day: "2-digit" }).format(dateData);
            let dateValue = (`${year}-${month}-${day}`);

            let displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(dateData);

            setSelectedDate(value);
            setShowModal(true);
            setModalText(displayDate);

            if (!availableDates.includes(dateValue)) {
                setAvailStatus("unavailable");
            } else {
                setAvailStatus("available");
            };
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

            <div className="container">
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </div>
            
            <div className="container-fluid" style={{"paddingBottom": "100px", "marginBottom": "200px", "backgroundImage": "url(/grassPatternGrey.png)", "backgroundSize": "100% auto", "backgroundRepeat": "repeat"}}>
                <div style={{"paddingBottom": "40px"}}></div>
                
                <div className="row text-center">
                    <div className="col">
                        <h1 className="text-primary fw-bold">Booking Availability</h1>
                    </div>
                </div>

                <div style={{"paddingBottom": "40px"}}></div>

                <div className="row">
                    <div className="col d-flex justify-content-center">

                        <Calendar onChange={handleCalendarChange}
                            value={selectedDate}
                            calendarType="gregory"
                            next2Label={null}
                            prev2Label={null}

                            tileClassName = {({date}) => {
                                let dateData = new Date(date ?? "----");
                                let year = new Intl.DateTimeFormat('en', { year: "numeric" }).format(dateData);
                                let month = new Intl.DateTimeFormat('en', { month: "2-digit" }).format(dateData);
                                let day = new Intl.DateTimeFormat('en', { day: "2-digit" }).format(dateData);
                                let dateValue = (`${year}-${month}-${day}`);

                                if (availableDates.includes(dateValue)) {
                                    return  'available'
                                }
                            }}

                            minDate = {
                                new Date()
                            }/>
                    </div>
                </div>
            </div>
        </>
    )
}