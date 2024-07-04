import { Button, Form, Spinner, Container, Card } from "react-bootstrap";

interface LoginClusterProps {
  emailChangeHandler: (email: string) => void;
  passwordChangeHandler: (password: string) => void;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  forgotPasswordHandler: (email: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
  handleModalShow: () => void;
}

export default function LoginCluster({
  emailChangeHandler,
  passwordChangeHandler,
  submitHandler,
  handleModalShow,
  isLoading,
  errorMessage
}: LoginClusterProps) {
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
                      onClick={() => handleModalShow()}
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
    </div>
  );
}





