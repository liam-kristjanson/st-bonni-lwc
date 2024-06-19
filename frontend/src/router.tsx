import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/about-us",
        element: <AboutUs/>
    }
])