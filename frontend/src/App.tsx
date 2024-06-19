import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.tsx';
import LoginCluster from './components/LoginCluster.tsx'
import { useNavigate } from 'react-router-dom';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const navigate = useNavigate();

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
    alert(result.message);
  }

  return (
    <>

      <div className='container'>

        <Navbar/>

        <h1 className="text-primary">Log In</h1>

        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <LoginCluster
              submitHandler={handleSubmit}
              passwordChangeHandler={handlePasswordChange}
              emailChangeHandler={handleEmailChange}
              isLoading = {isLoading}
            />
          </div>
        </div>
      </div>

      <a onClick={() => navigate('/about-us')}>About us</a>
    </>
  )
}

export default App
