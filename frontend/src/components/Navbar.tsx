import Icon from "@mdi/react";
import { mdiGrass, mdiMenu } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { Button, Offcanvas } from "react-bootstrap";

interface NavbarProps {
    menuShowHandler: () => void;
    menuHideHandler: () => void;
    showMenu: boolean;
}

export default function Navbar(props: NavbarProps) {
    const navigate = useNavigate();

    return (
        <>
        <div className="row mb-5">
            <div className="col">
                <nav className="d-flex justify-content-between align-items-center w-100 border-bottom border-dark p-3">
                    <h3 onClick={() => navigate('/')} className="text-primary pe-auto" role="button"><Icon path={mdiGrass} size={1.3}/> St Bonni LWC</h3>

                    <div id="nav-links-md" className="d-none d-md-flex gap-2 justify-content-around">
                        <a href="#" className="d-block text-primary">Lawn Services</a>
                        <a href="#" className="d-block text-primary">Window Services</a>
                        <a href="#" className="d-block text-primary">Contact</a>
                        <a onClick={() => navigate('/about-us')} className="d-block text-primary text-decoration-underline" role="button">About Us</a>
                    </div>

                    <div id="menu-button-sm" className="d-md-none">
                        <a onClick={() => props.menuShowHandler()}className="text-primary" role="button"><Icon path={mdiMenu} size={1}/></a>
                    </div>
                </nav>
            </div>
        </div>

        <Offcanvas show={props.showMenu} onHide={props.menuHideHandler} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Navigation</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex flex-column align-items-center gap-3">

                            <Button className="w-100 fw-bold text-white btn-lg" variant="primary">Lawn Services</Button>
                            <Button className="w-100 fw-bold text-white btn-lg" variant="primary">Window Services</Button>
                            <Button onClick={() => navigate('/about-us')} className="w-100 fw-bold text-white btn-lg" variant="primary">About Us</Button>
                            <Button className="w-100 fw-bold text-white btn-lg mb-5" variant="primary">Contact</Button>
                            <Button className="w-100 fw-bold text-white btn-lg" variant="primary">Book a Service!</Button>

                        </div>
                    </div>
                </div>
                
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}