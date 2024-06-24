import { Container } from "react-bootstrap";
import LoginCluster from "../components/LoginCluster";
import { useState } from "react";
import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function login() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();
    const { user, login, setUser } = useAuth()
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

        login({
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
        });

        console.log("USER")
        console.log(user);

        navigate('/admin/dashboard')

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