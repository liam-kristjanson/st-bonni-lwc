import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";
import Serves from "./routes/Serves";
import Contact from "./routes/Contact";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/about-us",
        element: <AboutUs/>
    },
    {
        path: "/lawn-services",
        element:<Serves/>
    },
    {
        path:"/contact",
        element:<Contact/>
    }
])