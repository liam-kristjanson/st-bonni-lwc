import { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import LoginCluster from "../components/LoginCluster.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import useNavbar from "../components/hooks/useNavbar.tsx";
import Serves from "./Serves.tsx";
import HeroGraphic from "../components/HeroGraphic.tsx";
import { mdiGrass } from "@mdi/js";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");

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
      </div>

      <HeroGraphic
        imageSource="/house-lawn-cropped-3.jpg"
        graphicText="St. Boniface Lawn and Window Care"
        iconPath={mdiGrass}
      />

        {/* <div
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
          </div> */}

      <div className="container">
        
        <div className="row">
          <div className="col">
            <h1 className="text-primary mb-3">Our Services</h1>
            <hr/>
            <Serves />
          </div>
        </div>
        
      </div>
    </>
  );
}

export default App;
