import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = globalThis.location.hash;
        const params = new URLSearchParams(hash.replace("#", "?"));
        const accessToken = params.get("access_token");

        if (accessToken) {
            login(accessToken);
            navigate("/dashboard");
        }
    });

    return (
        <div>
            <h1>Please wait a second...</h1>
        </div>
    );
}
