import { useState } from 'react';

import Navbar from "../components/Navbar"

import Calendar from 'react-calendar';
import "../components/styles/ReactCalendar.css"
import useNavbar from '../components/hooks/useNavbar';

import { Modal } from 'react-bootstrap';

import Icon from '@mdi/react';
import { mdiCalendarBlankOutline } from '@mdi/js';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingAvail() {
    const [selectedDate, setSelectedDate] = useState<Value>(new Date());
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const [modalText, setModalText] = useState<string>("----");

    const [availStatus, setAvailStatus] = useState<string>("unavailable");

    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const unavailableDates = ["Wed Jun 12 2024 00:00:00 GMT-0500 (Central Daylight Time)", "Sat Jun 29 2024 00:00:00 GMT-0500 (Central Daylight Time)"];
    
    function handleCalendarChange(value: Value) {
        if (!Array.isArray(value)) {
            let displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(new Date(value ?? "----"));
            
            setSelectedDate(value);
            setShowModal(true);
            setModalText(displayDate);

            if (unavailableDates.includes(value?.toString() ?? "----")) {
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
            </Modal>

            <div className="container">
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </div>
            
            <div className="container-fluid" style={{"paddingBottom": "750px", "backgroundImage": "url(/grassPatternGrey.png)", "backgroundSize": "100% auto", "backgroundRepeat": "repeat"}}>
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

                            tileClassName = {({date, view}) => {
                                if (unavailableDates.includes(date?.toString() ?? "----")) {
                                    return  'unavailable'
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