import Icon from "@mdi/react";
import { mdiGrass } from '@mdi/js';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (

        <div className="row mb-5">
            <div className="col">
                <nav className="d-flex justify-content-between w-100 border-bottom border-dark">
                    <h3 onClick={() => navigate('/')} className="text-primary pe-auto" role="button"><Icon path={mdiGrass} size={1.3}/> St Bonni LWC</h3>

                    <div id="nav-links-md" className="d-none d-md-flex gap-2 justify-content-around">
                        <a href="#" className="d-block text-primary">Lawn Services</a>
                        <a href="#" className="d-block text-primary">Window Services</a>
                        <a href="#" className="d-block text-primary">Contact</a>
                        <a onClick={() => navigate('/about-us')} className="d-block text-primary text-decoration-underline" role="button">About Us</a>
                    </div>
                </nav>
            </div>
        </div>
    )
}