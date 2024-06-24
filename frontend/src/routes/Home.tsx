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

      {/* Animation section Got weed */}
      <WeedAnimation />
      <Footer/>
    </>
  );
}

export default App;
