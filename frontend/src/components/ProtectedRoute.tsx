import { Navigate} from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode,
    validRoles?: string[] | null;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
    const user = useAuthContext().state.user;

    if (user && props.validRoles?.includes(user.role)) {
        return props.children;
    }

    return <Navigate to={'/login'}/>
}