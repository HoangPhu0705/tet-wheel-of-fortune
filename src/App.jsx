import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { PrizeProvider } from "./context/PrizeContext";
import SpinPage from "./pages/SpinPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  return (
    <PrizeProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="nav-container">
              <h1 className="nav-title">🧧 Tet Lucky Spin 2026</h1>
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  Spin
                </Link>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/settings" className="nav-link">
                  Settings
                </Link>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<SpinPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </PrizeProvider>
  );
}

export default App;
