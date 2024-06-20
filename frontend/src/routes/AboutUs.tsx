import { Card } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Icon from "@mdi/react";
import { mdiAccountTie, mdiInformationOutline } from "@mdi/js";
import useNavbar from "../components/hooks/useNavbar";

export default function AboutUs() {
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

    return (
        <>
            <div className="container">

                <Navbar
                    showMenu={showMenu}
                    menuHideHandler={handleMenuHide}
                    menuShowHandler={handleMenuShow}
                />
            </div>

                <div style={{
                    backgroundImage: "url('/house-lawn-cropped.jpg')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: "50vh"
                }}
                className="w-100 d-flex flex-column justify-content-center align-items-center mb-5">
                    <h1 className="text-white text-center display-1"><Icon path={mdiInformationOutline} size={2.0}/> About us</h1>
                    <hr className="border border-white border-3 opacity-100 w-75"/>
                </div>

            <div className="container">

                

                <div className="row justify-content-center">
                    <div className="col-xl-8 col">
                        

                        <h3 className="text-primary">A Craftsman's Touch</h3>
                        <p className="text-muted">The sun beats down, but a smile spreads across my face as I expertly maneuver the mower, each stripe a testament to a decade of experience. The familiar scent of freshly cut grass fills the air, a reminder of countless lawns transformed into lush, vibrant landscapes. I pause to admire the perfectly manicured expanse, envisioning the delighted reactions of my clients</p>

                        <hr className="mb-5"/>

                        <h3 className="text-primary">More than Just a Job</h3>
                        <p className="text-muted">Lawn care is more than a job to me; it's an art form. Each lawn presents a unique canvas, and I take pride in creating a masterpiece that enhances the beauty of every property. My attention to detail, combined with my passion for perfection, ensures that every blade of grass is meticulously trimmed, every edge precisely defined</p>

                        <hr className="mb-5"/>

                        <h3 className="text-primary">Your Lawn, My Passion</h3>
                        <p className="text-muted"> believe that a well-maintained lawn is an extension of your home, a reflection of your pride and care. It's a place to relax, play, and create lasting memories. With years of experience under my belt, I'm dedicated to providing the highest quality lawn care services, tailored to your specific needs and preferences. Your satisfaction is my ultimate goal, and I won't rest until your lawn is the envy of the neighborhood.</p>

                        <hr className="mb-5"/>

                        <h1 className="text-primary"><Icon path={mdiAccountTie} size={1}/> Meet the Team</h1>

                        <hr className="mb-5"/>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="d-flex col-xs-12 col-md-6 col-lg-4 col-xl-3 mb-4 justify-content-center align-items-center">
                        <Card className="align-self-center" style={{width: '18rem'}}>
                            <Card.Img variant="top" src="EricDornez.jpeg" />
                            <Card.Body>
                                <Card.Title className="text-primary">Eric Dornez</Card.Title>
                                <Card.Text>
                                    Former University of Winnipeg Men's Volleyball
                                    athlete with years of property maintainence experience.
                                    CEO of St. Bonni Lawn and Window Care, he will take care of all of your
                                    lawn and window needs!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="d-flex col-xs-12 col-md-6 col-lg-4 col-xl-3 mb-4 justify-content-center align-items-center">
                        <Card className="align-self-center" style={{width: '18rem'}}>
                            <Card.Img variant="top" src="EricDornez.jpeg" />
                            <Card.Body>
                                <Card.Title className="text-primary">Eric Dornez</Card.Title>
                                <Card.Text>
                                    Former University of Winnipeg Men's Volleyball
                                    athlete with years of property maintainence experience.
                                    CEO of St. Bonni Lawn and Window Care, he will take care of all of your
                                    lawn and window needs!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="d-flex col-xs-12 col-md-6 col-lg-4 col-xl-3 mb-4 justify-content-center align-items-center">
                        <Card className="align-self-center" style={{width: '18rem'}}>
                            <Card.Img variant="top" src="EricDornez.jpeg" />
                            <Card.Body>
                                <Card.Title className="text-primary">Eric Dornez</Card.Title>
                                <Card.Text>
                                    Former University of Winnipeg Men's Volleyball
                                    athlete with years of property maintainence experience.
                                    CEO of St. Bonni Lawn and Window Care, he will take care of all of your
                                    lawn and window needs!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}