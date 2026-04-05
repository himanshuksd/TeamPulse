import { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { logoutUser } from "../services/auth";
import {
  User, Lock, Bell, Palette, Shield, ChevronRight,
  Camera, Check, Eye, EyeOff, Sparkles, Moon, Sun,
  Mail, Smartphone, Save, AlertTriangle, LogOut
} from "lucide-react";
import { applyTheme, getSavedTheme } from "../hooks/useTheme";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      <input
        className={`w-full ${Icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
        focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
        {...props}
      />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-200"
        }`}
      style={{ height: 22, width: 40 }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"
          }`}
      />
    </button>
  );
}

function SaveBanner({ saved, error, onSave, loading }) {
  return (
    <div className="flex items-center justify-between pt-5 mt-5 border-t">
      {error ? (
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <AlertTriangle size={13} />
          {error}
        </div>
      ) : saved ? (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check size={14} />
          Changes saved!
        </div>
      ) : (
        <p className="text-xs text-gray-400">Unsaved changes</p>
      )}

      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Saving..." : <Save size={14} />}
        Save
      </button>
    </div>
  );
}

export default function Settings() {
  const { activeTeam } = useTeam();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    role: "",
    bio: "",
    phone: "",
    location: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifs, setNotifs] = useState({
    taskAssigned: true,
    taskCompleted: true,
    teamMessages: false,
    aiInsights: true,
    weeklyReport: true,
    emailNotifs: true,
    pushNotifs: false,
  });

  const [appearance, setAppearance] = useState({
    theme: getSavedTheme(),
    fontSize: "medium",
  });

  useEffect(() => {
    applyTheme(appearance.theme);
  }, [appearance.theme]);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await api.put("/user/settings", { profile, notifs, appearance });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          name: profile.name,
          email: profile.email,
        })
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.put("/user/password", security);
      setSaved(true);
    } catch {
      setError("Password change failed");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const initials = profile.name
    ? profile.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
    : "??";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-6">

        {/* LEFT MENU */}
        <div className="w-48 space-y-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm ${activeTab === id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              <Icon size={15} />
              {label}
              {activeTab === id && <ChevronRight size={13} className="ml-auto" />}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 px-3 py-2"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white border rounded-xl p-6">

          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-xl text-lg font-bold">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-xs text-gray-400">
                    {activeTeam?.name || "TeamPulse"}
                  </p>
                </div>
              </div>

              <Field label="Full Name">
                <Input
                  icon={User}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </Field>

              <Field label="Email">
                <Input
                  icon={Mail}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </Field>

              <Field label="Phone">
                <Input
                  icon={Smartphone}
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </Field>

              <SaveBanner
                saved={saved}
                error={error}
                onSave={handleSave}
                loading={saving}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <Field label="Current Password">
                <Input
                  icon={Lock}
                  type={showPass ? "text" : "password"}
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, currentPassword: e.target.value })
                  }
                />
              </Field>

              <Field label="New Password">
                <Input
                  icon={Lock}
                  type={showNew ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, newPassword: e.target.value })
                  }
                />
              </Field>

              <Field label="Confirm Password">
                <Input
                  icon={Lock}
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Field>

              <SaveBanner
                saved={saved}
                error={error}
                onSave={handlePasswordChange}
                loading={saving}
              />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              {Object.keys(notifs).map((key) => (
                <div key={key} className="flex justify-between">
                  <span className="text-sm">{key}</span>
                  <Toggle
                    value={notifs[key]}
                    onChange={(v) =>
                      setNotifs({ ...notifs, [key]: v })
                    }
                  />
                </div>
              ))}

              <SaveBanner
                saved={saved}
                error={error}
                onSave={handleSave}
                loading={saving}
              />
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">Theme</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setAppearance({ ...appearance, theme: "light" })}
                  className="border px-4 py-2 rounded-lg"
                >
                  <Sun size={16} /> Light
                </button>

                <button
                  onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                  className="border px-4 py-2 rounded-lg"
                >
                  <Moon size={16} /> Dark
                </button>
              </div>

              <SaveBanner
                saved={saved}
                error={error}
                onSave={handleSave}
                loading={saving}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}