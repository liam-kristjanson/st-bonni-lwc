import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

// NOTE: optimally move this into a separate file
export interface User {
  id: string;
  name: string;
  email: string;
  authToken?: string;
}

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = (newUser: User) => {
    console.log("Add user from useUser.ts passed user: ");
    console.log(newUser);

    setUser(newUser);

    console.log("USER FROM USEUSER.ts")
    console.log(user);
    setItem("user", JSON.stringify(newUser));
  };

  const removeUser = () => {
    setUser(null);
    setItem("user", "");
  };

  return { user, addUser, removeUser, setUser };
};