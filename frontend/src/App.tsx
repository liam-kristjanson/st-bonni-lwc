import { RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { router } from "./router";


function App() {
  const {user, setUser } = useAuth();

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <RouterProvider router={router}/>
    </AuthContext.Provider>
  )
}

export default App
