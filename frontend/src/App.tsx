import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboardPage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import { Navbar } from "./components/navbar/navbar";

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
    );
}

export default App;
