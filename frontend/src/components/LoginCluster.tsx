import { useState } from "react";
import { Button, Form, Spinner, Modal, Container, Card } from "react-bootstrap";

interface LoginClusterProps {
  emailChangeHandler: (email: string) => void;
  passwordChangeHandler: (password: string) => void;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  forgotPasswordHandler: (email: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
}

export default function LoginCluster({
  emailChangeHandler,
  passwordChangeHandler,
  submitHandler,
  forgotPasswordHandler,
  isLoading,
  errorMessage
}: LoginClusterProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleForgotPassword = async () => {
    if (newPassword !== confirmPassword) {
      setResetStatus("Passwords do not match");
      return;
    }
    if (!email) {
      setResetStatus("Email is required");
      return;
    }
    setIsResetting(true);
    try {
      await forgotPasswordHandler(email, newPassword);
      setResetStatus("Password reset successfully. You can now log in with your new password.");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setResetStatus("Failed to reset password. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleCloseModal = () => {
    setShowForgotPassword(false);
    setResetStatus("");
  };

  return (
    <div className="bg-white min-vh-100 d-flex align-items-center">
      <Container>
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Body className="p-5">
                <h3 className="text-center font-weight-light mb-4">Login</h3>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="emailInput">
                    <Form.Label className="small mb-1">Email Address</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      onChange={(e) => emailChangeHandler(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="passwordInput">
                    <Form.Label className="small mb-1">Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      onChange={(e) => passwordChangeHandler(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none" 
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </Button>
                  </Form.Group>

                  {errorMessage && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit"
                      className="btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      <Modal show={showForgotPassword} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="forgotPasswordEmail">
              <Form.Label className="small mb-1">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label className="small mb-1">New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label className="small mb-1">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-2"
              />
            </Form.Group>
          </Form>
          {resetStatus && (
            <p className={`small ${resetStatus.includes("successfully") ? "text-success" : "text-danger"}`}>
              {resetStatus}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleForgotPassword} disabled={isResetting}>
            {isResetting ? <Spinner animation="border" size="sm" /> : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}





