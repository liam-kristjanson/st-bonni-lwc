import Icon from "@mdi/react";
import { mdiGrass, mdiMenu } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { Button, Offcanvas } from "react-bootstrap";
import { NavLink } from "../types";

interface NavbarProps {
    menuShowHandler: () => void;
    menuHideHandler: () => void;
    showMenu: boolean;
}

export default function Navbar(props: NavbarProps) {
    const navigate = useNavigate();

    const links : NavLink[] = [
        {
            "route": "/reviews",
            "text": "Leave a Review",
            "buttonClasses": "text-white"
        },
        {
            "route": "/about-us",
            "text": "About Us",
            "buttonClasses": "text-white",
        },
        {
            "route": "/contact",
            "text": "Contact",
            "buttonClasses": "mb-5 text-white",
        },
        {
            "route": "/booking-availability",
            "text": "Book now",
            "buttonVariant": "warning",
            "buttonClasses": "text-black"
        }
    ]

    return (
        <>
        <div className="fixed-top bg-white">
            <div className="row">
                <div className="col">
<<<<<<< HEAD
                    <nav className="d-flex justify-content-between align-items-center w-100 shadow p-3">
=======
                    <nav className="d-flex justify-content-between align-items-center w-100 shadow-sm p-3">
>>>>>>> booking-avail-2
                        <h3 onClick={() => navigate('/')} className="link-primary pe-auto" role="button"><Icon path={mdiGrass} size={1.3}/> St Bonni LWC</h3>

                        <div id="nav-links-md" className="d-none d-md-flex gap-2 justify-content-around">

                            {links.map((link) => (
                                <a className={"d-block link-primary"}
                                role="button" 
                                onClick={() => navigate(link.route)}
                                >
                                    {link.text}
                                </a>
                            ))}

                        </div>

                        <div id="menu-button-sm" className="d-md-none">
                            <a onClick={() => props.menuShowHandler()}className="text-primary" role="button"><Icon path={mdiMenu} size={1}/></a>
                        </div>
                    </nav>
                </div>
            </div>
        </div>

        {/* Artificially move the rest of the content down   */}
        <div style={{marginBottom: "70px", backgroundColor:"white"}}>

        </div>

        <Offcanvas show={props.showMenu} onHide={props.menuHideHandler} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Navigation</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex flex-column align-items-center gap-3">

                            {links.map(link => (
                                <Button 
                                    className={"w-100 fw-bold btn-lg " + link.buttonClasses} 
                                    variant={link.buttonVariant ?? "primary"}
                                    onClick={() => navigate(link.route)}
                                >
                                    {link.text}
                                </Button>
                            ))}

                        </div>
                    </div>
                </div>
                
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}