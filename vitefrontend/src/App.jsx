import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import MainLayout from "./layout/MainLayout";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import ChatPage from "./pages/ChatPage";
import Settings from "./pages/Settings";
import Gamification from "./pages/Gamification";
import ProjectDetail from './pages/ProjectDetail';
import JoinTeam from "./pages/JoinTeam.jsx";
import { applyTheme, getSavedTheme } from "./hooks/useTheme";
function App() {
  applyTheme(getSavedTheme());
  return (
    <Router>
      <Routes>

        {/* Public Routes — no Navbar/Sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes — wrapped in MainLayout (has Navbar + Sidebar) */}
        <Route element={<MainLayout />}>
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard"  element={<Dashboard />}  />
          <Route path="/teams"      element={<Teams />}      />
          <Route path="/projects"   element={<Projects />}   />
          <Route path="/projects/:id" element={
          
              <ProjectDetail />
          
          } />
          <Route path="/tasks"      element={<Tasks />}      />
          <Route path="/analytics"  element={<Analytics />}  />
          <Route path="/chat" element={<ChatPage />} />

          <Route path="/join/:token" element={<JoinTeam />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
