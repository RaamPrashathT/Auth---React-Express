import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type Props = {
    readonly children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/auth/me", {
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }).catch(() => {
            setIsAuthenticated(false);
        });
    }, [])

    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
}