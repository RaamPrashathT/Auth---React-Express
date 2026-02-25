/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { setAccessToken } from "@/lib/tokenStore";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : { children: React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const login = (token: string) => {
        setAccessToken(token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        setAccessToken(null);
        setIsAuthenticated(false);
    }

    const contextValue = useMemo(
        () => ({ isAuthenticated, login, logout }),
        [isAuthenticated]
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};