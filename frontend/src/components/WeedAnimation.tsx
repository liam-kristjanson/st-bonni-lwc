/*Dependencies for Animation section : Got weed */
import Button from "react-bootstrap/Button";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
AOS.init();
import { Container, Row, Col } from "react-bootstrap";

const WeedAnimation = () => {
  const isAbove983px = useMediaQuery({ minWidth: 983 });
  const isAbove550px = useMediaQuery({ minWidth: 300 });

  useEffect(() => {
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }, []);

  return (
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
              className="px-4 py-2 bg-success fw-bold text-white"
              style={{ zIndex: 10 }}
            >
              REQUEST A SERVICE CALL
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WeedAnimation;
