import { useState } from 'react';

import Navbar from "../components/Navbar"
import useNavbar from '../components/hooks/useNavbar';
import { useLocation } from 'react-router-dom';

export default function TimeAvail() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();
    const { date } = state;
    
    let formatDate = new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(new Date(date ?? "----"));

    return (
        <>
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
                        <h1 className="fw-bold">Availability: <span className="text-primary">{formatDate}</span></h1>
                    </div>
                </div>


            </div>
        </>
    )
}