import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const LogoutButton = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
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
