import { mdiGrass, mdiMenu } from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate } from "react-router-dom"
import { NavLink } from "../types";
import { Button, Offcanvas } from "react-bootstrap";

interface NavbarProps {
    menuShowHandler: () => void;
    menuHideHandler: () => void;
    showMenu: boolean;
}


export default function AdminNavbar(props: NavbarProps) {

    const navigate = useNavigate();

    const links : NavLink[] = [
        {
            "route": "/admin/bookings",
            "text": "Bookings",
            "buttonClasses": "text-white"
        },
        {
            "route": "/admin/reviews",
            "text": "Reviews",
            "buttonClasses": "text-white",
        },
        {
            "route": "/admin/schedule",
            "text": "My Schedule",
            "buttonClasses": "mb-5 text-white",
        },
        {
            "route": "/admin/my-account",
            "text": "My Account",
            "buttonVariant": "warning"
        }
    ]
      

    return (
        

        <>
            <div className="fixed-top bg-white">
                <div className="row">
                    <div className="col">
                        <nav className="d-flex justify-content-between align-items-center w-100 shadow p-3">
                            <h3 onClick={() => navigate('/admin/dashboard')} className="link-primary pe-auto" role="button"><Icon path={mdiGrass} size={1.3}/> St Bonni Admin</h3>

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
            <div style={{marginBottom: "90px"}}>

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