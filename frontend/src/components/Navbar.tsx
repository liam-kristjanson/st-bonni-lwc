import Icon from "@mdi/react";
import { mdiGrass } from '@mdi/js';

export default function Navbar() {
    return (
        <nav className="d-flex justify-content-between w-100 border-bottom border-dark">
            <h3 className="text-primary"><Icon path={mdiGrass} size={1.3}/> St Bonni LWC</h3>

            <div id="nav-links-md" className="d-none d-md-flex gap-2 justify-content-around">
                <a href="#" className="d-block text-primary">Window services</a>
                <a href="#" className="d-block text-primary">Lawn Services</a>
                <a href="#" className="d-block text-primary">Contact</a>
                <a href="#" className="d-block text-primary">About Us</a>
            </div>
        </nav>
    )
}