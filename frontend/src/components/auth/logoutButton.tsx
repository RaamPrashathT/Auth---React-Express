import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "./authContext";

export const LogoutButton = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        auth.setAccessToken(null);
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
