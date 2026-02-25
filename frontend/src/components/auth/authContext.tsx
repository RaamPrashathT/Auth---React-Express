import { createContext, useContext, useState } from "react";
import { getAccessToken, setAccessToken } from "../../lib/tokenStore";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setToken] = useState<string | null>(null);

    const handleSetToken = (token: string | null) => {
        setAccessToken(token); 
        setToken(token); 
    };
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};
