import { Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import useNavbar from "../components/hooks/useNavbar"
import AdminNavbar from "../components/AdminNavbar";
import { useAuthContext } from "../hooks/useAuthContext";
import React, { useState } from "react";
import ResetPasswordModal from "../components/adminComponents/ResetPasswordModal";
import ServerMessageContainer from "../components/ServerMessageContainer";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
    
    const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();
    const user = useAuthContext().state.user;
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const [newEmail, setNewEmail] = useState<string>(user?.email ?? "");
    const [name, setName] = useState<string>(user?.name ?? "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState<boolean>(false);
    const [serverMesage, setServerMessage] = useState<string>("");
    const [serverMessageType, setServerMessageType] = useState<"success" | "danger">("success");

    function handleEditClick() {
        if (isEditing) {
            console.log("Toggling isEditing to false")
            setNewEmail(user?.email ?? "");
            setName(user?.name ?? "");
            setIsEditing(false);
        } else {
            setIsEditing(true);
            console.log("Toggling isEditing to true")
        }
    }

    function handleAccountInfoSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setServerMessage("");
        setIsLoading(true);

        const requestHeaders : HeadersInit = {
            "authorization" : user?.token ?? "none",
            "content-type" : "application/json"
        }

        const requestBody = JSON.stringify({
            oldEmail: user?.email,
            newEmail: newEmail,
            newName: name
        })

        fetch(import.meta.env.VITE_SERVER + "/admin/update-account-info", {
            method: "POST",
            headers: requestHeaders,
            body: requestBody
        })
        .then(response => {
            if (response.ok) {
                setServerMessageType('success')
            } else {
                setServerMessageType('danger')
            }

            return response.json()
        })
        .then(resposneJson => {
            setIsLoading(false);
            setServerMessage(resposneJson.message ?? resposneJson.error ?? "No message or error returned from server");

        }).catch(error => {
            setIsLoading(false);
            setServerMessage('danger');
            console.error(error);
            setServerMessage('An unexpected error occured');
        })
    }

    function handleLogout() {
        dispatch({type: "LOGOUT"});
        navigate('/');
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
                <Row className="d-flex justify-content-center min-vh-100">
                    <Col lg={8}>
                        <h1 className="text-primary mb-4">My Account</h1>

                        <Card className="mb-5">
                            <Form onSubmit={e => {handleAccountInfoSubmit(e)}}>
                                <Card.Header className="fw-bold">
                                    Personal Information
                                </Card.Header>

                                <Card.Body>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Email:
                                        </Form.Label>

                                        <Form.Control onChange={e => {setNewEmail(e.target.value)}}type="text" value={newEmail} disabled={!isEditing}/>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            Name:
                                        </Form.Label>

                                        <Form.Control onChange={e => {setName(e.target.value)}}type="text" value={name} disabled={!isEditing}/>
                                    </Form.Group>

                                    
                                </Card.Body>

                                <Card.Footer>
                                    <Container>
                                        <Row>
                                            <Col xs={12} sm={6}>
                                                    <Button onClick={() => {handleEditClick()}}className="text-white fw-bold w-100 mb-4 mb-sm-1" type="button" variant="primary">{isEditing ? "Cancel" : "Edit Information"}</Button>
                                                </Col>

                                                <Col xs={12} sm={6}>
                                                    {(!isLoading) && isEditing ? (
                                                        <Button type="submit" className="fw-bold w-100" variant="warning">Save changes</Button>
                                                    ) : (
                                                        <Button onClick={() => {setShowResetPasswordModal(true)}}className="text-white fw-bold w-100" type="button" variant="primary">Change Password</Button>
                                                    )}
                                                    
                                                    {isLoading && <Spinner/>}
                                                </Col>
                                        </Row>
                                    </Container>
                                </Card.Footer>
                            </Form>
                        </Card>

                        <ServerMessageContainer
                            message={serverMesage}
                            variant={serverMessageType}
                        />

                        <Button onClick={() => {handleLogout()}}variant="warning" className="fw-bold w-100 btn-lg">Log out</Button>
                    </Col>
                </Row>
            </Container>

            <ResetPasswordModal
                show={showResetPasswordModal}
                modalHideHandler={() => {setShowResetPasswordModal(false)}}
            />
        </>
    )
}