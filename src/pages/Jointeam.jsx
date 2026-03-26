import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function JoinTeam() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("joining");

    useEffect(() => {
        const userToken = localStorage.getItem("token");

        if (!userToken) {
            // Save invite token and redirect to login
            localStorage.setItem("pendingInvite", token);
            navigate("/login");
            return;
        }

        api.post(`/teams/join/${token}`)
            .then(() => {
                setStatus("success");
                setTimeout(() => navigate("/"), 2000);
            })
            .catch(() => {
                setStatus("error");
            });
    }, [token]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
            {status === "joining" && <h2>⏳ Joining team...</h2>}
            {status === "success" && <h2>✅ Joined! Redirecting...</h2>}
            {status === "error" && <h2>❌ Invalid or expired invite link.</h2>}
        </div>
    );
}