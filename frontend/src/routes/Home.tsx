import Navbar from "../components/Navbar.tsx";
import useNavbar from "../components/hooks/useNavbar.tsx";
import Serves from "./Serves.tsx";
import HeroGraphic from "../components/HeroGraphic.tsx";
import { mdiGrass } from "@mdi/js";

/*Dependencies for below promotionOffered.tsx*/
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { MdOutlinePets } from "react-icons/md";
import { FaCloudSunRain } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import WeedAnimation from "../components/WeedAnimation.tsx";
import ScrollButton from "../components/ScrollButton.tsx";
import Footer from "../components/Footer.tsx";
import CustomerRev from "../components/CustomerRev.tsx";


function App() {
  const { showMenu, handleMenuShow, handleMenuHide } = useNavbar();

  return (
    <>
      <div className="container">
        <Navbar
          showMenu={showMenu}
          menuShowHandler={handleMenuShow}
          menuHideHandler={handleMenuHide}
        />
      </div>

      <HeroGraphic
        imageSource="/house-lawn-cropped-3.jpg"
        graphicText="St. Boniface Lawn and Window Care"
        iconPath={mdiGrass}
      />
     
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="text-primary mb-3">Our Services</h1>
            <hr />

            <Serves />
          </div>
        </div>

        {/* section below promotion offered */}
        <Container className="text-center my-5">
          <Row className="mb-4">
            <Col>
              <h2>It's not too late to have a beautiful yard this summer.</h2>
              <h3>2024 full season packages on sale until the end of June.</h3>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <MdOutlinePets size={60} color="green" />

              <p className="mt-2">SAFE FOR PETS</p>
            </Col>
            <Col md={4} className="mb-3">
              <FaCloudSunRain size={60} color="green" />
              <p className="mt-2">AUTOMATICALLY SCHEDULED</p>
            </Col>
            <Col md={4} className="mb-3">
              <IoIosCheckmarkCircleOutline size={60} color="green" />
              <p className="mt-2">100% GUARANTEED</p>
            </Col>
          </Row>
        </Container>
        <ScrollButton />
      </div>

      <Container>
        <Row className=' d-flex justify-content-center align-items-center'>
          <Col className=" col-12 col-lg-6 col-xl-4  mb-4">
            <CustomerRev
              customerName="John Appleseed"
              numStars={5}
              reviewText="Wow, what a great service from St. Bonni LWC! These masters of lawncare did miracles to my lawn and took great care not to disturb my apple trees. I will be booking with St. Bonni LWC again soon!"
            />
          </Col>
          <Col className='col-12 col-lg-6 col-xl-4 mb-4'>
            <CustomerRev
              customerName="Larry McDonald"
              numStars={5}
              reviewText="It's been a long time since I've been able to mow my own lawn. I have hired other lawncare companies for my property but their quality of work is nothing compared to that of St. Bonni LWC. Thank you Eric for making my retirement life much better!"
            />
          </Col>
          <Col className='col-12 col-lg-6 col-xl-4 mb-4'>
            <CustomerRev
              customerName="Wendy Whalburg"
              numStars={5}
              reviewText="The gentlemen at St. Bonni LWC really went above and beyond not only with my lawn, but my windows as well! Who knew a business could take such good care of its customers?"
            />
          </Col>
          
        </Row>
      </Container>


      {/* Animation section Got weed */}
      <WeedAnimation />
      <Footer/>
      
    </>
  );
}

export default App;
