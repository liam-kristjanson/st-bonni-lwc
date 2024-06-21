import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import AboutUs from "./routes/AboutUs";
import BookingAvail from "./routes/BookingAvail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>
    },
    {
        path: "/about-us",
        element: <AboutUs/>
    },
    {
        path: "/booking-availability",
        element: <BookingAvail/>
    }
])