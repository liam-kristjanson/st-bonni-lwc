import { useState } from 'react'
import Navbar from '../components/Navbar.tsx';
import LoginCluster from '../components/LoginCluster.tsx'
import { useAuth } from '../hooks/useAuth.tsx';
import useNavbar from '../components/hooks/useNavbar.tsx';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');

  const { login, user } = useAuth();
const {showMenu, handleMenuShow, handleMenuHide} = useNavbar();

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

    if (response.ok) {
      let authData = await response.json();
      login(authData);
      alert("Logged in successfuly")
    } else {
      let errorData = await response.json();
      alert(errorData.error);
    }

    setIsLoading(false);
  }

  return (
    <>

      <div className='container'>

        <Navbar
          showMenu={showMenu}
          menuShowHandler={handleMenuShow}
          menuHideHandler={handleMenuHide}
        />

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h1 style={{'backgroundImage' : '/image.jpg'}}className="text-primary text-center">Log In</h1>
          </div>
        </div>

        <LoginCluster
          submitHandler={handleSubmit}
          passwordChangeHandler={handlePasswordChange}
          emailChangeHandler={handleEmailChange}
          isLoading = {isLoading}
        />

        <p>User data: {JSON.stringify(user)}</p>

        
      </div>
    </>
  )
}

export default App
