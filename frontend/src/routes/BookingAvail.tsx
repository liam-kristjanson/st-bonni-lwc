import { useState } from 'react';

import Navbar from "../components/Navbar"

import Calendar from 'react-calendar';
import "../components/styles/ReactCalendar.css"
import useNavbar from '../components/hooks/useNavbar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingAvail() {
    const [value, onChange] = useState<Value>(new Date());
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    return (
        <>
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

                        <Calendar onChange={onChange}
                            value={value}
                            calendarType="gregory"
                            next2Label={null}
                            prev2Label={null}/>
                    </div>
                </div>
            </div>
        </>
    )
}