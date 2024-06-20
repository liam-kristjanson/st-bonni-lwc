import Icon from "@mdi/react";
import { mdiGrass, mdiMenu } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { Button, Offcanvas } from "react-bootstrap";

interface NavbarProps {
    menuShowHandler: () => void;
    menuHideHandler: () => void;
    showMenu: boolean;
}

interface Link {
    route: string,
    text: string,
    buttonVariant?: string,
    buttonClasses?: string,
}

export default function Navbar(props: NavbarProps) {
    const navigate = useNavigate();

    const links : Link[] = [
        {
            "route": "/lawn-services",
            "text": "Lawn Services",
        },
        {
            "route": "/window-services",
            "text": "Window Services",
        },
        {
            "route": "/about-us",
            "text": "About Us",
        },
        {
            "route": "/contact",
            "text": "Contact",
            "buttonClasses": "mb-5"
        },
        {
            "route": "/book-service",
            "text": "Book Now",
            "buttonVariant": "warning",
        }
    ]

    return (
        <>
        <div className="fixed-top bg-white">
            <div className="row">
                <div className="col">
                    <nav className="d-flex justify-content-between align-items-center w-100 border-bottom border-dark p-3">
                        <h3 onClick={() => navigate('/')} className="text-primary pe-auto" role="button"><Icon path={mdiGrass} size={1.3}/> St Bonni LWC</h3>

                        <div id="nav-links-md" className="d-none d-md-flex gap-2 justify-content-around">

                            {links.map((link) => (
                                <a className={"d-block text-primary"}
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

        <div style={{marginBottom: "75px"}}>

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
                                    className={"w-100 fw-bold text-white btn-lg " + link.buttonClasses} 
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