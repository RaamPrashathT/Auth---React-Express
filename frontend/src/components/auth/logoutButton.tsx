import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

export const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        logout();
        await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigate("/login");
    };
    return (
        <Button variant="destructive" onClick={handleLogout}>
            Logout
        </Button>
    );
};
