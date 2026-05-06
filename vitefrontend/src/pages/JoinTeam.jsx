// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../services/api";

// export default function JoinTeam() {
//     const { token } = useParams();
//     const navigate = useNavigate();
//     const [status, setStatus] = useState("joining");

//     useEffect(() => {
//         const userToken = localStorage.getItem("token");

//         if (!userToken) {
//             // Save invite token and redirect to login
//             localStorage.setItem("pendingInvite", token);
//             navigate("/login");
//             return;
//         }

//         api.post(`/teams/join/${token}`)
//             .then(() => {
//                 setStatus("success");
//                 setTimeout(() => navigate("/"), 2000);
//             })
//             .catch(() => {
//                 setStatus("error");
//             });
//     }, [token]);

//     return (
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
//             {status === "joining" && <h2>⏳ Joining team...</h2>}
//             {status === "success" && <h2>✅ Joined! Redirecting...</h2>}
//             {status === "error" && <h2>❌ Invalid or expired invite link.</h2>}
//         </div>
//     );
// }


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
            // ✅ FIX: use "pending_invite" to match Login.jsx
            localStorage.setItem("pending_invite", token);
            navigate("/login");
            return;
        }

        api.post(`/teams/join/${token}`)
            // ✅ fix
            .then((res) => {
                setStatus("success");
                localStorage.removeItem("pending_invite");

                // ✅ Save user info after joining
                api.get("/user/settings").then(r => {
                    localStorage.setItem("user", JSON.stringify({
                        id: r.data.id,
                        name: r.data.name,
                        email: r.data.email
                    }));
                });

                setTimeout(() => navigate("/teams"), 2000);
            })
            .catch((err) => {
                const msg = err?.response?.data?.detail;
                if (msg === "Already a member of this team") {
                    setStatus("already");
                    setTimeout(() => navigate("/teams"), 2000);
                } else {
                    setStatus("error");
                }
            });
    }, [token]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: "12px" }}>
            {status === "joining" && <h2>⏳ Joining team...</h2>}
            {status === "success" && <h2>✅ Joined! Redirecting to teams...</h2>}
            {status === "already" && <h2>✅ Already a member! Redirecting...</h2>}
            {status === "error" && <h2>❌ Invalid or expired invite link.</h2>}
        </div>
    );
}