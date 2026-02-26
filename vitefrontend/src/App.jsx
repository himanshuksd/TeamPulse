import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useMemo, useState, useEffect } from "react";

function App() {
  // ✅ Load saved theme (no flash)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ Persist theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ✅ Sync with your CSS variables
  useEffect(() => {
    const mode = darkMode ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.setAttribute("data-mui-color-scheme", mode);
  }, [darkMode]);

  // ✅ MUI theme
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: true,

        palette: {
          mode: darkMode ? "dark" : "light",

          primary: {
            main: "#4f46e5",
          },

          background: {
            default: darkMode ? "#0f172a" : "#f6f8fb",
            paper: darkMode ? "#1e293b" : "#ffffff",
          },
        },

        shape: {
          borderRadius: 12,
        },

        typography: {
          fontFamily: '"Poppins", system-ui, sans-serif',
          h4: { fontWeight: 700 },
          h6: { fontWeight: 600 },
        },

        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(10px)",
              },
            },
          },
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className="app-root">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
