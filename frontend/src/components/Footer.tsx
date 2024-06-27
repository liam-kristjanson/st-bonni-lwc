
import Icon from "@mdi/react";
import { mdiGrass } from '@mdi/js';
import { mdiInstagram } from '@mdi/js';
import { mdiFacebook } from '@mdi/js';
import { mdiMapMarker } from '@mdi/js';
import { mdiPhone } from '@mdi/js';
import { mdiLinkedin } from '@mdi/js';
import { mdiEmail } from '@mdi/js';
import { mdiInformationVariant } from '@mdi/js';
import { mdiBookPlusMultiple } from '@mdi/js';
import { mdiMessageDraw } from '@mdi/js';
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const myStyle={
  listStyleType:'none'}
export default function Footer() {

const navigate = useNavigate();

return(
<>
    <footer className=" justify-content-evenly align-items-center bg-primary text-bg-light ps-3   ">
        <div className="d-flex  mx-auto justify-content-start position-relative">
            <h3 className="text-light pe-auto" role="button"><Icon path={mdiGrass} size={1.5}/> St Bonni LWC</h3>
        </div>
        <Container>
            <Row>
                <Col>
                <div className=" d-flex text-light pe-auto">
                    <div>
                        <h5 className=" justify-content-center fw-bolder align-items-center  ">Social Media</h5>
                        <ul className=" link-underline-opacity-75-hover text-sm-end" style={myStyle}>
                            <li><a href=" https://www.instagram.com/ "><Icon path={mdiInstagram} size={1.5} className=" d-none d-md-inline  "  /><Icon path={mdiInstagram} size={1} className=" d-md-none " /> </a> Instagram </li>
                            <li><Icon path={mdiFacebook} size={1.5} className=" d-none d-md-inline" /><Icon path={mdiFacebook} size={1}  className=" d-md-none " /> Facebook</li>
                            <li><Icon path={mdiLinkedin} size={1.5} className=" d-none d-md-inline" /><Icon path={mdiLinkedin} size={1} className=" d-md-none "  />Instagram</li>
                        </ul>
                    </div>
                </div>
                </Col>

                

                <Col>

                 <div className="d-flex justify-content-evenly text-light">

                    <div>
                        <h5 className=" justify-content-center fw-bolder align-items-center   ">Other pages</h5>
                            <ul className=" link-underline-opacity-75-hover text-sm-end" style={myStyle}>
                                <li className="text-md-center">
                                <Icon path={mdiInformationVariant} size={1.5} className=" d-none d-md-inline" />
                                <Icon path={mdiInformationVariant} size={1} className=" d-md-none " />
                                <a role="button" onClick={() => {navigate('/login')}}>Log in</a>
                                                    
                                </li>

                                <li className="text-md-center">
                                <Icon path={mdiBookPlusMultiple} size={1.5} className="d-none d-md-inline" />
                                <Icon path={mdiBookPlusMultiple} size={1} className=" d-md-none"/>
                                Bookings
                                </li>

                                <li className="text-md-center">
                                <Icon path={mdiMessageDraw} size={1.5} className="d-none d-md-inline" />
                                <Icon path={mdiMessageDraw} size={1} className=" d-md-none"/>
                                Reviews
                                </li>
                            </ul>   

                       </div>
                    </div>  
                </Col>

                <Col>
                <div className="d-flex justify-content-evenly   text-light">
     
                    <div>
                        <h5 className=" d-flex justify-content-center fw-bolder">Contact</h5>
                        <ul className="" style={myStyle} >
                            <li className="">
                                <Icon path={mdiMapMarker} size={1.5} className="d-none d-md-inline" />
                                <Icon path={mdiMapMarker} size={1} className=" d-md-none"/>
                                123 Street Address
                            </li>
                                            
                            <li className="">
                                <Icon path={mdiPhone} size={1.5} className="d-none d-md-inline" />
                                <Icon path={mdiPhone} size={1} className=" d-md-none"/>
                                (204)-xxx-xxx
                            </li>

                            <li className="">
                                <Icon path={mdiEmail} size={1.5} className="d-none d-md-inline" /> 
                                <Icon path={mdiEmail} size={1} className=" d-md-none"/>
                                Person@email.com
                            </li>
                        </ul>   


                    </div>
                 </div>
                </Col>
            </Row>
        </Container>  
    </footer>
</>
)
}