// src/hooks/useTheme.js
// Call this once in App.jsx or main.jsx to apply saved theme on startup

export function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
}

export function getSavedTheme() {
    return localStorage.getItem("theme") || "light";
}