import { useState } from 'react';
import Navbar from "../components/Navbar"
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import "../components/styles/ReactCalendar.css"
import useNavbar from '../components/hooks/useNavbar';
import Table from 'react-bootstrap/Table';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AdminBook() {
    const [value, onChange] = useState<Value>(new Date());
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();
   // const [tileClassName, setTileClassName] = useState<string>('highlight');

    // const mark = [
    //     '04-06-2024',
    //     '03-06-2024',
    //     '05-06-2024'
    // ]

    return (
        <>
            <div className="container">
                <Navbar
                        showMenu={showMenu}
                        menuHideHandler={handleMenuHide}
                        menuShowHandler={handleMenuShow}
                    />
            </div>
            
            <div className="container-fluid" style={{"zIndex": "-2", "paddingBottom": "750px", "backgroundImage": "url(/grassPatternGrey.png)", "backgroundSize": "100% auto", "backgroundRepeat": "repeat"}}>
                <div style={{"paddingBottom": "40px"}}></div>
                
                <div className="row text-center">
                    <div className="col">
                        <h1 className="text-primary fw-bold">Booking Availability</h1>
                    </div>
                </div>

                

                <div style={{"paddingBottom": "40px"}}></div>

                <div className="row">
                    <div className="bg-white position-absolute border border-5" style={{"zIndex": "-1", "width": "300px", "height": "300px"}}>&nbsp;</div>

                    <div className="col d-flex justify-content-center">

                        <Calendar onChange={onChange}
                            value={value}
                            calendarType="gregory"
                            next2Label={null}
                            prev2Label={null}
                            

                            // tileClassName={({ date, view }) => {
                            //     if(mark.find(x=>x===new Date(date).toString("DD-MM-YYYY"))){
                            //      return  'highlight'
                            //     }
                            //   }}
                          
                           
                            />
                    </div>
                </div>
            </div>

            

            
        </>
    )
}