import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboardPage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import OAuthSuccess from "./pages/auth/oauth-success";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
            </Routes>
        </div>
    );
}

export default App;
