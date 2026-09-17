import { useEffect, useState } from "react";
import {
    User,
    Bell,
    Palette,
    Shield,
    CheckCircle,
    RotateCcw,
    LogOut,
    Moon,
    Sun,
    Monitor,
    Save,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/technicianSettings.css";

const defaultSettings = {
    taskNotifications: true,
    complaintNotifications: true,
    systemNotifications: true,
    appearance: "light",
};

function getStorage() {
    return sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;
}

function getTechnicianData() {
    const storage = getStorage();

    let user = null;

    try {
        const storedUser =
            storage.getItem("user") ||
            storage.getItem("currentUser");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch {
        user = null;
    }

    return {
        name:
            user?.name ||
            user?.fullName ||
            user?.username ||
            storage.getItem("name") ||
            storage.getItem("username") ||
            "Technician",

        email:
            user?.email ||
            storage.getItem("email") ||
            "Not available",

        technicianId:
            user?.technicianId ||
            user?.employeeId ||
            user?.technicianID ||
            storage.getItem("technicianId") ||
            storage.getItem("employeeId") ||
            "Not available",

        role:
            user?.role ||
            storage.getItem("role") ||
            "TECHNICIAN",
    };
}

function Settings() {
    const navigate = useNavigate();

    const [technician, setTechnician] = useState(
        getTechnicianData()
    );

    const [settings, setSettings] = useState(
        defaultSettings
    );

    const [saved, setSaved] = useState(false);

    const loadSettings = () => {
        const currentTechnician =
            getTechnicianData();

        setTechnician(currentTechnician);

        try {
            const stored =
                localStorage.getItem(
                    "technicianSettings"
                );

            if (stored) {
                setSettings({
                    ...defaultSettings,
                    ...JSON.parse(stored),
                });
            }
        } catch {
            setSettings(defaultSettings);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSetting = (key, value) => {
        setSettings((previous) => ({
            ...previous,
            [key]: value,
        }));

        setSaved(false);
    };

    const saveSettings = () => {
        localStorage.setItem(
            "technicianSettings",
            JSON.stringify(settings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    const resetSettings = () => {
        setSettings(defaultSettings);

        localStorage.setItem(
            "technicianSettings",
            JSON.stringify(defaultSettings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("currentUser");

        localStorage.removeItem("token");
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");

        navigate("/login", {
            replace: true,
        });
    };

    const technicianInitial =
        technician.name
            .trim()
            .charAt(0)
            .toUpperCase() || "T";

    return (
        <div className="technician-settings-page">

            <div className="technician-settings-container">

                {/* HEADER */}

                <div className="settings-heading">

                    <div>

                        <p className="settings-breadcrumb">
                            Technician
                            <span>/</span>
                            Settings
                        </p>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your account and application preferences.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="settings-refresh-button"
                        onClick={loadSettings}
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>

                </div>


                {/* SUCCESS */}

                {saved && (
                    <div className="settings-success">

                        <CheckCircle size={18} />

                        <span>
                            Settings saved successfully
                        </span>

                    </div>
                )}


                {/* TECHNICIAN INFORMATION */}

                <section className="technician-info-card">

                    <div className="technician-info-profile">

                        <div className="technician-info-avatar">
                            {technicianInitial}
                        </div>

                        <div className="technician-info-main">

                            <div className="technician-name-row">

                                <h2>
                                    {technician.name}
                                </h2>

                                <span className="technician-active-badge">
                                    <span></span>
                                    ACTIVE
                                </span>

                            </div>

                            <div className="technician-role">

                                <User size={16} />

                                <span>
                                    Technician
                                </span>

                            </div>

                            <p className="technician-id">
                                Technician ID:{" "}
                                <strong>
                                    {technician.technicianId}
                                </strong>
                            </p>

                        </div>

                    </div>

                </section>


                {/* ACCOUNT INFORMATION */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-purple">
                            <User size={20} />
                        </div>

                        <div>

                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Your registered technician account details.
                            </p>

                        </div>

                    </div>

                    <div className="account-grid">

                        <div className="account-item">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {technician.name}
                            </strong>

                        </div>

                        <div className="account-item">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {technician.email}
                            </strong>

                        </div>

                        <div className="account-item">

                            <span>
                                Technician ID
                            </span>

                            <strong>
                                {technician.technicianId}
                            </strong>

                        </div>

                        <div className="account-item">

                            <span>
                                Account Role
                            </span>

                            <strong>
                                {technician.role}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* NOTIFICATIONS */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-blue">
                            <Bell size={20} />
                        </div>

                        <div>

                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Control the notifications you receive.
                            </p>

                        </div>

                    </div>

                    <div className="settings-options">

                        <div className="setting-row">

                            <div className="setting-row-icon blue">
                                <Bell size={18} />
                            </div>

                            <div className="setting-row-content">

                                <h3>
                                    Task Assignments
                                </h3>

                                <p>
                                    Notifications for newly assigned technician tasks.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`settings-switch ${
                                    settings.taskNotifications
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    updateSetting(
                                        "taskNotifications",
                                        !settings.taskNotifications
                                    )
                                }
                                aria-pressed={
                                    settings.taskNotifications
                                }
                            >
                                <span></span>
                            </button>

                        </div>


                        <div className="setting-row">

                            <div className="setting-row-icon green">
                                <CheckCircle size={18} />
                            </div>

                            <div className="setting-row-content">

                                <h3>
                                    Complaint Updates
                                </h3>

                                <p>
                                    Notifications when complaint status changes.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`settings-switch ${
                                    settings.complaintNotifications
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    updateSetting(
                                        "complaintNotifications",
                                        !settings.complaintNotifications
                                    )
                                }
                                aria-pressed={
                                    settings.complaintNotifications
                                }
                            >
                                <span></span>
                            </button>

                        </div>


                        <div className="setting-row">

                            <div className="setting-row-icon orange">
                                <Shield size={18} />
                            </div>

                            <div className="setting-row-content">

                                <h3>
                                    System Notifications
                                </h3>

                                <p>
                                    Important Smart Campus system notifications.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`settings-switch ${
                                    settings.systemNotifications
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    updateSetting(
                                        "systemNotifications",
                                        !settings.systemNotifications
                                    )
                                }
                                aria-pressed={
                                    settings.systemNotifications
                                }
                            >
                                <span></span>
                            </button>

                        </div>

                    </div>

                </section>


                {/* APPEARANCE */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-yellow">
                            <Palette size={20} />
                        </div>

                        <div>

                            <h2>
                                Appearance
                            </h2>

                            <p>
                                Choose your preferred application appearance.
                            </p>

                        </div>

                    </div>

                    <div className="appearance-options">

                        <button
                            type="button"
                            className={`appearance-option ${
                                settings.appearance === "light"
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                updateSetting(
                                    "appearance",
                                    "light"
                                )
                            }
                        >

                            <div className="appearance-icon light">
                                <Sun size={18} />
                            </div>

                            <div>
                                <strong>
                                    Light
                                </strong>

                                <span>
                                    Light interface
                                </span>
                            </div>

                            {settings.appearance === "light" && (
                                <CheckCircle size={18} />
                            )}

                        </button>


                        <button
                            type="button"
                            className={`appearance-option ${
                                settings.appearance === "system"
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                updateSetting(
                                    "appearance",
                                    "system"
                                )
                            }
                        >

                            <div className="appearance-icon system">
                                <Monitor size={18} />
                            </div>

                            <div>
                                <strong>
                                    System
                                </strong>

                                <span>
                                    Follow device preference
                                </span>
                            </div>

                            {settings.appearance === "system" && (
                                <CheckCircle size={18} />
                            )}

                        </button>


                        <button
                            type="button"
                            className={`appearance-option ${
                                settings.appearance === "dark"
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                updateSetting(
                                    "appearance",
                                    "dark"
                                )
                            }
                        >

                            <div className="appearance-icon dark">
                                <Moon size={18} />
                            </div>

                            <div>
                                <strong>
                                    Dark
                                </strong>

                                <span>
                                    Dark interface
                                </span>
                            </div>

                            {settings.appearance === "dark" && (
                                <CheckCircle size={18} />
                            )}

                        </button>

                    </div>

                </section>


                {/* SECURITY */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-red">
                            <Shield size={20} />
                        </div>

                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Manage your current account session.
                            </p>

                        </div>

                    </div>

                    <div className="security-content">

                        <div>

                            <h3>
                                Sign out from this device
                            </h3>

                            <p>
                                End your current Smart Campus session.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="logout-settings-button"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>

                </section>


                {/* ACTIONS */}

                <div className="settings-actions">

                    <button
                        type="button"
                        className="reset-settings-button"
                        onClick={resetSettings}
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>

                    <button
                        type="button"
                        className="save-settings-button"
                        onClick={saveSettings}
                    >
                        <Save size={16} />
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;