import { createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";
import BookingAvail from "./routes/BookingAvail";
import TimeAvail from "./routes/TimeAvail";
import Serves from "./routes/Serves";
import Contact from "./routes/Contact";
import Login from "./routes/Login";

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
        path: "/booking-availability",
        element: <BookingAvail/>
    },
    {
        path: "/time-availability",
        element: <TimeAvail/>
    },
    {
        path: "/lawn-services",
        element:<Serves/>
    },
    {
        path:"/contact",
        element:<Contact/>
    }, {
        path:"/login",
        element:<Login/>
    }
])