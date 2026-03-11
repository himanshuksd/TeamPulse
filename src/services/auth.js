import api from "./api";

// ================= LOGIN =================
export const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/login", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        // Notify TeamContext in the same tab that token changed
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: response.data.access_token }));

        const userData = {
            id: response.data.user_id,
            name: response.data.name,
            email: response.data.email,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("activeTeamId");
    }

    return response.data;
};

// ================= REGISTER =================
export const registerUser = async (name, email, password) => {
    const response = await api.post("/register", {
        name,
        email,
        password,
    });

    if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        // Notify TeamContext in the same tab that token changed
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: response.data.access_token }));

        const userData = {
            id: response.data.user_id,
            name: response.data.name,
            email: response.data.email,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("activeTeamId");
    }

    return response.data;
};

// ================= LOGOUT =================
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeTeamId");
    // Notify TeamContext in the same tab that token was removed
    window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
};