import { useState, useEffect } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsVisible(scrollPosition > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "3px",
          right: "3px",
          zIndex: 100,
          backgroundColor: "#FFFFFF",
          borderStyle: "none",
          borderRadius: "100%",
          padding: "0.5rem",
        }}
      >
        <FaArrowAltCircleUp size={20} color="#007bff" />
        
      </button>
    )
  );
};

export default ScrollButton;
