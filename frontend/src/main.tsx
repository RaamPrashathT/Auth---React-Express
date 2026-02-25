import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/authContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <AuthProvider>
        <BrowserRouter>
            <StrictMode>
                <App />
            </StrictMode>
        </BrowserRouter>
    </AuthProvider>
);
