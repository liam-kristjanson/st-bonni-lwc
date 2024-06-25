import { Container } from "react-bootstrap";
import LoginCluster from "../components/LoginCluster";
import { useState } from "react";

export default function login() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    

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
    
        const reqHeaders = {
          "content-type" : "application/json"
        }
    
        let response = await fetch(import.meta.env.VITE_SERVER + '/login', {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password
          }),
          headers: reqHeaders
        });
    
        const result = await response.json();
        setIsLoading(false);
        alert(result);
      }

    return (
        

        <>
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