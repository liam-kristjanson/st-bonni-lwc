import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";

interface LoginClusterProps {
    emailChangeHandler: (email: string) => void;
    passwordChangeHandler: (password: string) => void;
    submitHandler: (e : React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}
export default function LoginCluster(props: LoginClusterProps) {

    return (
        <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-7 col-md-9 col-12">
                <Form className="bg-secondary p-3 rounded" onSubmit={(e) => {props.submitHandler(e)}}>
                    <Form.Group className="mb-3" controlId="emailInput">
                        <Form.Label className="text-primary">Email Address</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Enter email" onChange={(e) => props.emailChangeHandler(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="passwordInput">
                        <Form.Label className="text-primary">Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" onChange={(e) => props.passwordChangeHandler(e.target.value)}/>
                    </Form.Group>

                    
                    {props.isLoading ? (
                        <Spinner animation="border" role="status"/>
                    ) : (
                        <Button variant="primary" className="w-100 text-white" type="submit">Submit</Button>
                    )}
                    
                </Form>
            </div>
        </div>
    )
}