import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TeamProvider } from "./context/TeamContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="924800932908-21qlpmse1j5rcbkeuvmhf0ad9di884fs.apps.googleusercontent.com">
    <TeamProvider>
      <App />
    </TeamProvider>
  </GoogleOAuthProvider>
);