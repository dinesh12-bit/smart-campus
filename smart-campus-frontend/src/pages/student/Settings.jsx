import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Bell,
    Check,
    ChevronDown,
    LockKeyhole,
    Monitor,
    Moon,
    Palette,
    RefreshCw,
    Save,
    Sun,
    Type,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "../../styles/studentSettings.css";

const defaultSettings = {
    theme: "light",
    fontSize: "medium",

    notifications: {
        complaintUpdates: true,
        statusChanges: true,
        systemAlerts: true,
    },

    dashboard: {
        autoRefresh: true,
        refreshInterval: "30",
        preferredRoom: "ROOM-204",
    },
};

function Settings() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(defaultSettings);
    const [saved, setSaved] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const savedSettings =
            localStorage.getItem("studentSettings");

        if (savedSettings) {
            try {
                setSettings({
                    ...defaultSettings,
                    ...JSON.parse(savedSettings),
                });
            } catch {
                localStorage.removeItem("studentSettings");
            }
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-student-theme",
            settings.theme
        );

        document.documentElement.setAttribute(
            "data-student-font",
            settings.fontSize
        );

        return () => {
            document.documentElement.removeAttribute(
                "data-student-theme"
            );

            document.documentElement.removeAttribute(
                "data-student-font"
            );
        };
    }, [settings.theme, settings.fontSize]);

    const updateNotification = (key) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }));
    };

    const updateDashboard = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            dashboard: {
                ...prev.dashboard,
                [key]: value,
            },
        }));
    };

    const handleSave = () => {
        localStorage.setItem(
            "studentSettings",
            JSON.stringify(settings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);
    };

    const handlePasswordChange = (event) => {
        event.preventDefault();

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            alert("Please fill all password fields.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        if (passwords.newPassword.length < 6) {
            alert("New password must contain at least 6 characters.");
            return;
        }

        alert(
            "Password change request is ready. Connect this form with the backend password API."
        );

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="student-settings-page">

            <div className="student-settings-header">

                <button
                    type="button"
                    className="student-settings-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <h1>Settings</h1>

                    <div className="student-settings-breadcrumb">
                        <span>Dashboard</span>
                        <span>›</span>
                        <strong>Settings</strong>
                    </div>
                </div>

            </div>

            <div className="student-settings-content">

                <section className="student-settings-card">

                    <div className="student-settings-card-header">
                        <div className="student-settings-title-icon appearance">
                            <Palette size={19} />
                        </div>

                        <div>
                            <h2>Appearance</h2>
                            <p>
                                Customize how your Student Panel looks.
                            </p>
                        </div>
                    </div>

                    <div className="student-settings-row">
                        <div className="student-settings-row-info">
                            <strong>Theme</strong>
                            <span>
                                Choose your preferred appearance.
                            </span>
                        </div>

                        <div className="student-theme-options">

                            <button
                                type="button"
                                className={
                                    settings.theme === "light"
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        theme: "light",
                                    }))
                                }
                            >
                                <Sun size={16} />
                                Light

                                {settings.theme === "light" && (
                                    <Check size={15} />
                                )}
                            </button>

                            <button
                                type="button"
                                className={
                                    settings.theme === "dark"
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        theme: "dark",
                                    }))
                                }
                            >
                                <Moon size={16} />
                                Dark

                                {settings.theme === "dark" && (
                                    <Check size={15} />
                                )}
                            </button>

                            <button
                                type="button"
                                className={
                                    settings.theme === "system"
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        theme: "system",
                                    }))
                                }
                            >
                                <Monitor size={16} />
                                System

                                {settings.theme === "system" && (
                                    <Check size={15} />
                                )}
                            </button>

                        </div>
                    </div>

                    <div className="student-settings-row">

                        <div className="student-settings-row-info">
                            <strong>Font Size</strong>
                            <span>
                                Adjust text size across the Student Panel.
                            </span>
                        </div>

                        <div className="student-font-options">

                            {["small", "medium", "large"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={
                                        settings.fontSize === size
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            fontSize: size,
                                        }))
                                    }
                                >
                                    <Type size={15} />

                                    {size.charAt(0).toUpperCase() +
                                        size.slice(1)}

                                    {settings.fontSize === size && (
                                        <Check size={15} />
                                    )}
                                </button>
                            ))}

                        </div>

                    </div>

                </section>

                <section className="student-settings-card">

                    <div className="student-settings-card-header">

                        <div className="student-settings-title-icon notifications">
                            <Bell size={19} />
                        </div>

                        <div>
                            <h2>Notifications</h2>
                            <p>
                                Choose which notifications you want to receive.
                            </p>
                        </div>

                    </div>

                    <NotificationRow
                        title="Complaint Updates"
                        description="Receive updates related to your complaints."
                        enabled={settings.notifications.complaintUpdates}
                        onChange={() =>
                            updateNotification("complaintUpdates")
                        }
                    />

                    <NotificationRow
                        title="Complaint Status Changes"
                        description="Get notified when your complaint status changes."
                        enabled={settings.notifications.statusChanges}
                        onChange={() =>
                            updateNotification("statusChanges")
                        }
                    />

                    <NotificationRow
                        title="System Alerts"
                        description="Receive important campus system alerts."
                        enabled={settings.notifications.systemAlerts}
                        onChange={() =>
                            updateNotification("systemAlerts")
                        }
                    />

                </section>

                <section className="student-settings-card">

                    <div className="student-settings-card-header">

                        <div className="student-settings-title-icon dashboard">
                            <RefreshCw size={19} />
                        </div>

                        <div>
                            <h2>Dashboard Preferences</h2>
                            <p>
                                Configure how dashboard information is refreshed.
                            </p>
                        </div>

                    </div>

                    <div className="student-settings-row">

                        <div className="student-settings-row-info">
                            <strong>Auto Refresh</strong>
                            <span>
                                Automatically refresh live campus data.
                            </span>
                        </div>

                        <Toggle
                            enabled={settings.dashboard.autoRefresh}
                            onChange={() =>
                                updateDashboard(
                                    "autoRefresh",
                                    !settings.dashboard.autoRefresh
                                )
                            }
                        />

                    </div>

                    <div className="student-settings-row">

                        <div className="student-settings-row-info">
                            <strong>Refresh Interval</strong>
                            <span>
                                Select how frequently the dashboard refreshes.
                            </span>
                        </div>

                        <div className="student-settings-select">

                            <select
                                value={settings.dashboard.refreshInterval}
                                onChange={(event) =>
                                    updateDashboard(
                                        "refreshInterval",
                                        event.target.value
                                    )
                                }
                                disabled={!settings.dashboard.autoRefresh}
                            >
                                <option value="15">15 seconds</option>
                                <option value="30">30 seconds</option>
                                <option value="60">1 minute</option>
                                <option value="120">2 minutes</option>
                            </select>

                            <ChevronDown size={16} />

                        </div>

                    </div>

                    <div className="student-settings-row">

                        <div className="student-settings-row-info">
                            <strong>Preferred Room</strong>
                            <span>
                                Room used as the default campus overview.
                            </span>
                        </div>

                        <div className="student-settings-select">

                            <select
                                value={settings.dashboard.preferredRoom}
                                onChange={(event) =>
                                    updateDashboard(
                                        "preferredRoom",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="ROOM-204">
                                    ROOM-204
                                </option>

                                <option value="ROOM-101">
                                    ROOM-101
                                </option>

                                <option value="ROOM-102">
                                    ROOM-102
                                </option>

                                <option value="ROOM-201">
                                    ROOM-201
                                </option>
                            </select>

                            <ChevronDown size={16} />

                        </div>

                    </div>

                </section>

                <section className="student-settings-card">

                    <div className="student-settings-card-header">

                        <div className="student-settings-title-icon security">
                            <LockKeyhole size={19} />
                        </div>

                        <div>
                            <h2>Security</h2>
                            <p>
                                Manage your student account security.
                            </p>
                        </div>

                    </div>

                    <form
                        className="student-password-form"
                        onSubmit={handlePasswordChange}
                    >

                        <div className="student-password-field">
                            <label>Current Password</label>

                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(event) =>
                                    setPasswords((prev) => ({
                                        ...prev,
                                        currentPassword:
                                        event.target.value,
                                    }))
                                }
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="student-password-field">
                            <label>New Password</label>

                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(event) =>
                                    setPasswords((prev) => ({
                                        ...prev,
                                        newPassword:
                                        event.target.value,
                                    }))
                                }
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="student-password-field">
                            <label>Confirm New Password</label>

                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(event) =>
                                    setPasswords((prev) => ({
                                        ...prev,
                                        confirmPassword:
                                        event.target.value,
                                    }))
                                }
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="student-password-button"
                        >
                            <LockKeyhole size={16} />
                            Change Password
                        </button>

                    </form>

                </section>

                <div className="student-settings-actions">

                    <button
                        type="button"
                        className="student-settings-cancel"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="student-settings-save"
                        onClick={handleSave}
                    >
                        {saved ? (
                            <>
                                <Check size={17} />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                Save Changes
                            </>
                        )}
                    </button>

                </div>

            </div>

        </div>
    );
}

function NotificationRow({
                             title,
                             description,
                             enabled,
                             onChange,
                         }) {
    return (
        <div className="student-settings-row">

            <div className="student-settings-row-info">
                <strong>{title}</strong>
                <span>{description}</span>
            </div>

            <Toggle
                enabled={enabled}
                onChange={onChange}
            />

        </div>
    );
}

function Toggle({ enabled, onChange }) {
    return (
        <button
            type="button"
            className={`student-toggle ${
                enabled ? "enabled" : ""
            }`}
            onClick={onChange}
            aria-label="Toggle setting"
        >
            <span></span>
        </button>
    );
}

export default Settings;