//import AdminNavbar from "../components/AdminNavbar";
//import useNavbar from "../components/hooks/useNavbar";
import { Col, Container, Row } from 'react-bootstrap';
import { Button, Card,  Form, Spinner } from "react-bootstrap";
import { useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';
import ServerMessageContainer from "../components/ServerMessageContainer";
import { useSearchParams } from 'react-router-dom';
 

export default function Reviews() {

    const [date, setDate] = useState<string>('')
    const [isLoading, formIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("")
    const [rating, setRating] = useState<number>(0);
    const [comments, setComment] = useState<string>("");
    const [searchParams] = useSearchParams();
    const [serverMessage, setServerMessage] = useState<string>('');
    const [serverMessageType, setServerMessageType] = useState<'success' | 'danger'>('success');
    const [reviewKey, setReviewKey] = useState<string>("");

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    }

    function handleNameChange(newName: string) {
        setName(newName);
    }
    
    function handleNewComment(newComment:string) {
        setComment(newComment);
    }
    
    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDate(e.target.value);
    }  
    
   function handleReviewKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
        setReviewKey(e.target.value);
   }
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){ 
        e.preventDefault();
        console.log("Processing review submission....");
        formIsLoading(false);

        const reqHeaders = {
            "content-type" : "application/json"
        }

    let response = await fetch(import.meta.env.VITE_SERVER + '/reviews', {
        method: "POST",
        body: JSON.stringify({
            date: date,
            name: name,
            rating: rating,
            comments: comments,
            id: reviewKey
        }),
        headers: reqHeaders
        });

        if (response.ok) {
        setServerMessageType('success')
        } else {
        setServerMessageType('danger');
        }
    
        const responseJson = await response.json();
        formIsLoading(false);
    
        setServerMessage(responseJson.message ?? responseJson.error);
    }
       
    
    
    
    return(
        <>
        <Container>
        <Row>
            
            <Col>

                <p>Search params: {"ID: " + searchParams.get('id')}</p>
            
                <Card className="shadow mb-3">
                        <h1 className=" text-primary text-center fw-bolder">Reviews</h1>
                        <hr></hr>
                        <h3 className='text-center text-primary fw-bold'>Satisfied with your service?</h3>
                        <div className='text-center text-primary'> Submit a review today!</div>

                        <Card.Body>
                            <Form className="" onSubmit={handleSubmit}>

                                <Form.Group className="mb-3 fw-bolder mt-4">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control className='rounded-5 border border-primary' placeholder="Date" type="date" value={date} onChange={handleDateChange} required/>
                                </Form.Group>

                                <Form.Group className="mb-3 fw-bolder mt-4">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control className=" rounded-5 border border-primary " placeholder=" Name" type='name' value={name} onChange={(e) => handleNameChange(e.target.value)} required/>
                                    
                                </Form.Group>

                                <Form.Group className="mb-3 fw-bolder mt-4">
                                    <Form.Label>Review Key (Recieved in email)</Form.Label>
                                    <Form.Control className=" rounded-5 border border-primary " placeholder="Review Key" type='text' value={reviewKey} onChange={handleReviewKeyChange} required/>
                                </Form.Group>

                                <Form.Group className="mb-3 fw-bolder mt-4">
                                    <Form.Label>What service did you receive?</Form.Label>
                                    {/* <Form.Control className=" d-flex row rounded-5 " placeholder=" First Name" type='name' value={nameF} onChange={handleServiceChange} required/> */}
                                    <DropdownButton id="dropdown-basic-button" title="Various Services Offered" typeof='lg' className='primary'>
                                        <Dropdown.Item href="#/action-1">Service 1</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Service 2</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Service 3</Dropdown.Item>
                                    </DropdownButton>
                                    
                                </Form.Group>

                                <Form.Group className="mb-3 mt-4 fw-bolder">
                                    <Form.Label>Rate your service</Form.Label>
                                        <div className=' d-flex justify-content-center align-content-between'>
                                        
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                return (
                                                    <Icon
                                                        key={star}
                                                        path={mdiStar}
                                                        size={1.9}
                                                        style={{ color: star <= rating ? 'gold' : 'gray' }}
                                                        onClick={() => handleStarClick(star)} />
                                                );
                                            })}

                                        </div>
                                </Form.Group>

                                <Form.Group className="mb-3 mt-4 fw-bolder">
                                    <Form.Label>Comments about your service</Form.Label>
                                    <Form.Control className="container  border rounded-5 shadow-lg p-5 border border-primary  position-relative" value={comments} type="comments" placeholder='Tell us about yourself' onChange={(e) => handleNewComment(e.target.value)} required/>
                                        
                                    
                                </Form.Group>

                                    {isLoading ? (
                                        <Spinner/>
                                        ) : (           
                                        <Button className="rounded-4 mt-4 mb-3" type="submit">Submit</Button>
                                    )}
                                    {serverMessage && <ServerMessageContainer variant={serverMessageType} message={serverMessage}/>}
                            </Form>
                        </Card.Body>
                </Card>
            </Col>

        </Row>
        </Container>
        </>     
            


    );
}
