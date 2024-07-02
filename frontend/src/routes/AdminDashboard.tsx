

import { Container } from "react-bootstrap";
import AdminNavbar from "../components/AdminNavbar";
import useNavbar from "../components/hooks/useNavbar";
import Bookingtable from "../components/adminComponents/Bookingtable";

export default function AdminDashboard() {
    const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();
    
    return (
        <>
            <Container>
                <AdminNavbar
                    showMenu={showMenu}
                    menuHideHandler={handleMenuHide}
                    menuShowHandler={handleMenuShow}
                />
            </Container>

            <Bookingtable/>
        </>
    )
}