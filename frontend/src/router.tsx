import { createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";
import BookingAvail from "./routes/BookingAvail";
import TimeAvail from "./routes/TimeAvail";
import Confirmation from "./routes/Confirmation";
import Serves from "./routes/Serves";
import Contact from "./routes/Contact";
import AdminBook from "./routes/AdminBook";
import Login from "./routes/Login";
import AdminDashboard from "./routes/AdminDashboard";
import Schedule from "./routes/Schedule";
import Reviews from "./routes/Reviews";
import AdminReview from "./routes/AdminReview";

import ProtectedRoute from "./components/ProtectedRoute";
import MyAccount from "./routes/MyAccount";


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
        path: "/confirmation",
        element: <Confirmation/>
    },
    {
        path: "/lawn-services",
        element:<Serves/>
    },
    {
        path:"/contact",
        element:<Contact/>
    },
    {
        path: "/ad-book",
        element:<AdminBook/>
    }, 
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/admin/dashboard",
        element: 
        <ProtectedRoute validRoles={['admin']}>
            <AdminDashboard/>
        </ProtectedRoute>
    },
    {
        path: "/admin/schedule",
        element:
        <ProtectedRoute validRoles={['admin']}>
            <Schedule/>
        </ProtectedRoute>
    },
    {
        path:"/reviews",
        element:<Reviews/>
    },
    {
        path:"/admin/reviews",
        element:
        <ProtectedRoute validRoles={['admin']}>
            <AdminReview/>
        </ProtectedRoute>
    },
    {
        path: "/admin/my-account",
        element:
        <ProtectedRoute validRoles={['admin']}>
            <MyAccount/>
        </ProtectedRoute>
    }

])