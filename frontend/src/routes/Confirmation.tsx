import { useEffect } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";

import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";

import { useLocation } from "react-router-dom";

export default function Confirmation() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    const { state } = useLocation();

    const { name } = state;
    const { email } = state;
    const { phone } = state;
    const { address } = state;
    const { serviceOption } = state;
    const { selectedTime } = state;
    const { selectedDate } = state;

    useEffect(() => {
        //console.log(name);
    }, [name]);

    return (
        
        <>

        <Container className="d-print-none">
            <Navbar
                showMenu={showMenu}
                menuHideHandler={handleMenuHide}
                menuShowHandler={handleMenuShow}
                />
        </Container>

        <Container className="fluid" style={{"paddingBottom": "40px"}}>
            <div style={{"paddingBottom": "60px"}}></div>

            <Row className="text-start mb-2">
                <Col>
                    <h1 className="text-primary">Booking Confirmed</h1>
                    <h3 className="text-dark">Thank you for choosing St. Bonni LWC</h3>
                </Col>
            </Row>

            <div style={{"paddingBottom": "20px"}}></div>

            <Row className="justify-content-start mb-2">
                <Col className="col-md-12">       
                    <Table style={{"tableLayout": "auto"}}>
                        <tbody>
                            <tr>
                                <td className="align-middle fw-bold">CLIENT NAME</td>
                                <td className="align-middle">{name}</td>
                            </tr>

                            <tr>
                                <td className="align-middle fw-bold">CLIENT EMAIL ADDRESS</td>
                                <td className="align-middle">{email}</td>
                            </tr>

                            <tr>
                                <td className="align-middle fw-bold">CLIENT PHONE NUMBER</td>
                                <td className="align-middle">{phone}</td>
                            </tr>

                            <div style={{"paddingBottom": "40px"}}></div>

                            <tr>
                                <td className="align-middle fw-bold">SERVICE TYPE</td>
                                <td className="align-middle">{serviceOption}</td>
                            </tr>

                            <tr>
                                <td className="align-middle fw-bold">SERVICE DATE</td>
                                <td className="align-middle">{new Date(selectedDate).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',})}</td>
                            </tr>

                            <tr>
                                <td className="align-middle fw-bold">SERVICE TIME</td>
                                <td className="align-middle">{new Date(selectedTime).toLocaleTimeString([], {hour: "numeric", minute: "2-digit" })}</td>
                            </tr>  

                            <tr>
                                <td className="align-middle fw-bold">SERVICE ADDRESS</td>
                                <td className="align-middle">{address}</td>
                            </tr>       
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <div style={{"paddingBottom": "20px"}}></div>

            <Row className="justify-content-center mb-2">
                <Col className="col-md-4">
                    <Button className="btn-sm w-100 fw-bold text-white d-print-none" type="button" onClick={() => window.print()}>Print</Button>
                </Col>
            </Row>
        </Container>
        
        </>
    )
}