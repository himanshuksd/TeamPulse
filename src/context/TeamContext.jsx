// import { createContext, useContext, useState, useEffect } from "react";
// import api from "../services/api";

// const TeamContext = createContext();

// export function TeamProvider({ children }) {
//   const [teams, setTeams] = useState([]);
//   const [activeTeamId, setActiveTeamId] = useState(null);
//   const [teamsLoading, setTeamsLoading] = useState(true);

//   const [token, setToken] = useState(() => localStorage.getItem("token"));

//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === "token") setToken(e.newValue);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   useEffect(() => {
//     if (!token) {
//       setTeams([]);
//       setActiveTeamId(null);
//       setTeamsLoading(false);
//       return;
//     }

//     setTeamsLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) return;  // ← add this before the api.get("/teams") call
//     api.get("/teams")
//       .then(res => {
//         // ✅ Safety check — ensure data is always an array
//         const data = Array.isArray(res.data) ? res.data : [];
//         console.log("Teams fetched:", data); // debug — remove later
//         setTeams(data);

//         if (data.length > 0) {
//           const storedId = Number(localStorage.getItem("activeTeamId"));
//           const exists = data.find(t => t.id === storedId);
//           setActiveTeamId(exists ? storedId : data[0].id);
//         } else {
//           setActiveTeamId(null);
//           localStorage.removeItem("activeTeamId");
//         }
//       })
//       .catch(err => console.error("Failed to fetch teams:", err))
//       .finally(() => setTeamsLoading(false));
//   }, [token]);

//   useEffect(() => {
//     if (activeTeamId) localStorage.setItem("activeTeamId", activeTeamId);
//   }, [activeTeamId]);

//   const activeTeam = teams.find(t => t.id === activeTeamId) || null;

//   return (
//     <TeamContext.Provider value={{ teams, activeTeam, activeTeamId, setActiveTeamId, teamsLoading }}>
//       {children}
//     </TeamContext.Provider>
//   );
// }

// export function useTeam() {
//   const context = useContext(TeamContext);
//   if (!context) throw new Error("useTeam must be used inside a <TeamProvider>");
//   return context;
// }

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [teamsLoading, setTeamsLoading] = useState(true);

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!token) {
      setTeams([]);
      setActiveTeamId(null);
      setTeamsLoading(false);
      return;
    }

    setTeamsLoading(true);

    api.get("/teams")
      .then(res => {
        // ✅ Safety check — ensure data is always an array
        const data = Array.isArray(res.data) ? res.data : [];
        console.log("Teams fetched:", data); // debug — remove later
        setTeams(data);

        if (data.length > 0) {
          const storedId = Number(localStorage.getItem("activeTeamId"));
          const exists = data.find(t => t.id === storedId);
          setActiveTeamId(exists ? storedId : data[0].id);
        } else {
          setActiveTeamId(null);
          localStorage.removeItem("activeTeamId");
        }
      })
      .catch(err => console.error("Failed to fetch teams:", err))
      .finally(() => setTeamsLoading(false));
  }, [token]);

  useEffect(() => {
    if (activeTeamId) localStorage.setItem("activeTeamId", activeTeamId);
  }, [activeTeamId]);

  const activeTeam = teams.find(t => t.id === activeTeamId) || null;

  return (
    <TeamContext.Provider value={{ teams, activeTeam, activeTeamId, setActiveTeamId, teamsLoading }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used inside a <TeamProvider>");
  return context;
}