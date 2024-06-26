import { useEffect, useState } from 'react';

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';

import { useLocation } from 'react-router-dom';

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();
    const { date } = state;

    let displayDate = new Intl.DateTimeFormat('en-US', {dateStyle: "full"}).format(date);

    /*
    useEffect(() => {
        fetch(import.meta.env.VITE_Server + "/time-availability?date=" + date)
    });
    */

    return (
        <>
            <div className="container">
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </div>

            <div className="container-fluid" style={{"paddingBottom": "100px"}}>
                <div style={{"paddingBottom": "40px"}}></div>

                <div className="row text-center">
                    <div className="col">
                        <h1>Availability: <span className="text-primary">{displayDate}</span></h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        
                    </div>
                </div>
            </div>
        </>
    )
}