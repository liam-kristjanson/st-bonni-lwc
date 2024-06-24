import { Container } from "react-bootstrap";
import LoginCluster from "../components/LoginCluster";
import { useState } from "react";
import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function login() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    

    function handleEmailChange(newEmail: string) {
        setEmail(newEmail);
    }
    
      function handlePasswordChange(newPassword: string) {
        setPassword(newPassword);
      }
    
      async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("Processing login...");
        setIsLoading(true);

        const loginHeaders = {
          "content-type": "application/json"
        }

        const loginBody = {
          "email": email,
          "password": password,
        }

        const response = await fetch(import.meta.env.VITE_SERVER + "/login", {
          method: "POST",
          headers: loginHeaders,
          body: JSON.stringify(loginBody),
        });

        if (response.ok) {
          const user = await response.json();
          dispatch({type: "LOGIN", payload: { user }});
          navigate('/admin/dashboard');
        } else {
          alert('Invalid username or password');
        }
      }

    return (
        <>
          <Container>
            <Navbar
              showMenu={showMenu}
              menuHideHandler={handleMenuHide}
              menuShowHandler={handleMenuShow}
            />
          </Container>

          <h1 className="text-primary text-center pt-3 mb-4">Log in</h1>
            <Container>
                <LoginCluster
                    isLoading={isLoading}
                    submitHandler={handleSubmit}
                    passwordChangeHandler={handlePasswordChange}
                    emailChangeHandler={handleEmailChange}
                />
            </Container>
        </>
    )
}