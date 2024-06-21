import { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import LoginCluster from "../components/LoginCluster.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import useNavbar from "../components/hooks/useNavbar.tsx";
import Serves from "./Serves.tsx";

/*Dependencies for below promotionOffered.tsx*/
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { MdOutlinePets } from "react-icons/md";
import { FaCloudSunRain } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

/*Dependencies for Animation section : Got weed */
import Button from "react-bootstrap/Button";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMediaQuery } from "react-responsive";
AOS.init();

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");

  //for Animation Section
  const isAbove983px = useMediaQuery({ minWidth: 983 });
  const isAbove550px = useMediaQuery({ minWidth: 300 });

  const { login, user } = useAuth();
  const { showMenu, handleMenuShow, handleMenuHide } = useNavbar();

  function handleEmailChange(newEmail: String) {
    setEmail(newEmail);
  }

  function handlePasswordChange(newPassword: String) {
    setPassword(newPassword);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Processing login...");
    setIsLoading(true);

    const reqHeaders = {
      "content-type": "application/json",
    };

    let response = await fetch(import.meta.env.VITE_SERVER + "/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: reqHeaders,
    });

    if (response.ok) {
      let authData = await response.json();
      login(authData);
      alert("Logged in successfuly");
    } else {
      let errorData = await response.json();
      alert(errorData.error);
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="container">
        <Navbar
          showMenu={showMenu}
          menuShowHandler={handleMenuShow}
          menuHideHandler={handleMenuHide}
        />

        {/* background Image section */}
        <div
          style={{
            position: "relative",
            height: "50vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {" "}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              backgroundImage: `url(/lawnImage.jpg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              filter: "blur(1px)",
              zIndex: 1,
            }}
          ></div>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
              color: "white",
              fontSize: "2em",
              fontWeight: "bold",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
            }}
          >
            Your satisfaction is my ultimate goal, and I won't rest until your
            lawn is the envy of the neighborhood.
          </div>
        </div>

        {/* promotion offered section */}
        <Serves />

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
      </div>

      {/* Animation section Got weed */}
      <Container
        fluid
        className="overflow-hidden  py-5"
        style={{
          backgroundImage: "url(/graspPattern.png)", // Update the image URL path
          backgroundSize: "300%",
          backgroundPosition: "center",
        }}
      >
        <Row className="justify-content-center">
          <Col
            xs={12}
            md={10}
            lg={8}
            xl={6}
            className="text-center position-relative aos-init aos-animate"
            style={{ zIndex: 2 }}
          >
            <div className="position-relative ">
              {isAbove983px && (
                <>
                  <img
                    src="/weed.png"
                    alt="Dandelion Left"
                    style={{
                      position: "absolute",
                      bottom: "-100px",
                      left: "-150px",
                      width: "25%",
                      maxWidth: "200px",
                      zIndex: 1,
                      opacity: 0.9,
                    }}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  />
                  <img
                    src="/weed.png"
                    alt="Dandelion Right"
                    style={{
                      position: "absolute",
                      bottom: "-100px",
                      right: "-90px",
                      height: "auto",
                      width: "20%",
                      maxWidth: "120px",
                      zIndex: 1,
                      opacity: 0.9,
                    }}
                    className="aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  />
                </>
              )}
              {isAbove550px && (
                <>
                  <img
                    src="/weed.png"
                    alt="Dandelion Left"
                    style={{
                      position: "absolute",
                      bottom: "-120px",
                      left: "40px",
                      width: "25%",
                      maxWidth: "200px",
                      zIndex: 1,
                      opacity: 0.3,
                    }}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  />
                  <img
                    src="/weed.png"
                    alt="Dandelion Right"
                    style={{
                      position: "absolute",
                      bottom: "-100px",
                      right: "0px",
                      height: "auto",
                      width: "20%",
                      maxWidth: "120px",
                      zIndex: 1,
                      opacity: 0.3,
                    }}
                    className="aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  />
                </>
              )}
              <h5 className="text-success mb-3" style={{ opacity: 1 }}>
                Got Weeds? No Worries.
              </h5>
              <h2
                className="tagline text-success mb-4"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: "bold",
                }}
              >
                SIT BACK & RELAX. WE'LL BE BACK UNTIL YOUR LAWN IS PERFECT. 100%
                GUARANTEED.
              </h2>
              <Button
                variant="success"
                size="lg"
                className="px-4 py-2 bg-success"
                style={{ zIndex: 10 }}
              >
                REQUEST A SERVICE CALL
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
