import { Container } from "react-bootstrap";
import LoginCluster from "../components/LoginCluster";
import { useState } from "react";
import Navbar from "../components/Navbar";
import useNavbar from "../components/hooks/useNavbar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Login() {
  const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
    
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
    setErrorMessage(""); 

    const reqHeaders = {
      "content-type": "application/json",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER}/login`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: reqHeaders,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      console.log("Login successful:", result);
      dispatch({type: "LOGIN", payload:{user: result}})
      navigate('/admin/dashboard')
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(email: string, newPassword: string) {
    const reqHeaders = {
      "content-type": "application/json",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/reset-password`,
        {
          method: "POST",
          body: JSON.stringify({ email, newPassword }),
          headers: reqHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      console.log("Password reset successfully");
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
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

      <Container>
        <LoginCluster
          emailChangeHandler={handleEmailChange}
          passwordChangeHandler={handlePasswordChange}
          submitHandler={handleSubmit}
          forgotPasswordHandler={handleForgotPassword}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </Container>
    </>
  );
}