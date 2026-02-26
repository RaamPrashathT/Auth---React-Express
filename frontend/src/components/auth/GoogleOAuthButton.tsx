import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const GoogleOAuthButton = () => {
    const handleLogin = async() => {
        window.location.href = "http://localhost:5000/auth/google";
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleLogin}
        >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
        </Button>
    );
};