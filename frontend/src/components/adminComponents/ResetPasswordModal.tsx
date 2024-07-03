import { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

interface ResetPasswordModalProps {
  show: boolean;
  modalHideHandler: () => void;
}

export default function ResetPasswordModal(props: ResetPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleForgotPassword = async () =>  {
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

  async function forgotPasswordHandler(email: string, newPassword: string) {
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
        <Modal show={props.show} onHide={() => {props.modalHideHandler()}}>
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
          <Button variant="secondary" onClick={() => {props.modalHideHandler()}}>
            Close
          </Button>
          <Button variant="primary" onClick={handleForgotPassword} disabled={isResetting}>
            {isResetting ? <Spinner animation="border" size="sm" /> : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    )
}