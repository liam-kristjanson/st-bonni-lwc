import { useState } from "react";
import {useAuthContext} from "../hooks/useAuthContext"
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import AdminNavbar from "../components/AdminNavbar";
import useNavbar from "../components/hooks/useNavbar";

export default function AdminDashboard() {
    const user = useAuthContext().state.user;
    const [serverMessage, setServerMessage] = useState<string>('');
    const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();

    const logAuthToken = async () => {
        console.log('Logging auth token');

        const HEADERS : HeadersInit = {
            authorization: user?.token ?? ""
        }

        const response = await fetch(import.meta.env.VITE_SERVER + '/log-auth-token', {
            headers: HEADERS
        });

        if (response.ok) {
            const responseText = await response.text();
            setServerMessage(responseText);
        }
    }
    
    return (
        <>
            <Container>
                <AdminNavbar
                    showMenu={showMenu}
                    menuHideHandler={handleMenuHide}
                    menuShowHandler={handleMenuShow}
                />
            </Container>

            <Container>
                <Row>
                    <Col>
                        <h1 className="text-primary">Admin Dashboard</h1>

                        <Card className="shadow">
                            <Card.Title className="p-2">
                                Today's Bookings: 3
                            </Card.Title>

                            <Card.Body>
                                <Row>
                                    <Col>
                                        Job 1
                                    </Col>

                                    <Col><Button className="text-white fw-bold" variant="primary">View</Button></Col>
                                </Row>

                                <Button className="text-white fw-bold" variant="primary">View Bookings</Button>
                            </Card.Body>
                        </Card>

                        <p>User {JSON.stringify(user) ?? "Not found"}</p>

                        <p>User email: {user?.email ?? "Not found"}</p>

                        <p>User auth token: {user?.token ?? "Not found"}</p>

                        <p>Local storage user: {localStorage.getItem('user')}</p>

                        <Button onClick={logAuthToken}>Log auth token in backend</Button>

                        <p>Server Message: {serverMessage}</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}