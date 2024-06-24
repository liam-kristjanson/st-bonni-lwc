import { useAuth } from "../hooks/useAuth"

export default function AdminDashboard() {
    const { user } = useAuth();
    
    return (
        <>
            <h1>This is the admin dashboard</h1>

            <p>User name: {user?.name ?? "Not found"}</p>

            <p>User email: {user?.email ?? "Not found"}</p>

            <p>User auth token: {user?.authToken ?? "Not found"}</p>

            <p>Local storage user: {localStorage.getItem('user')}</p>
        </>
    )
}