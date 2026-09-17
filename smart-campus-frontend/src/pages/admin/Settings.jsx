import { useEffect, useState } from "react";
import {
    Palette,
    Bell,
    LayoutDashboard,
    ShieldCheck,
    Info,
    Sun,
    Moon,
    Monitor,
    Check,
    ChevronDown,
    LockKeyhole,
} from "lucide-react";

import "../../styles/settings.css";

function Settings() {
    const [theme, setTheme] = useState(
        localStorage.getItem("adminTheme") || "light"
    );

    const [notifications, setNotifications] = useState({
        complaints: true,
        users: true,
        sensors: true,
        ai: true,
    });

    const [dashboard, setDashboard] = useState({
        autoRefresh: true,
        refreshInterval: "30",
        defaultRoom: "ALL",
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedNotifications =
            localStorage.getItem("adminNotifications");

        const savedDashboard =
            localStorage.getItem("adminDashboardSettings");

        if (savedNotifications) {
            setNotifications(
                JSON.parse(savedNotifications)
            );
        }

        if (savedDashboard) {
            setDashboard(
                JSON.parse(savedDashboard)
            );
        }
    }, []);

    const saveSettings = () => {
        localStorage.setItem(
            "adminTheme",
            theme
        );

        localStorage.setItem(
            "adminNotifications",
            JSON.stringify(notifications)
        );

        localStorage.setItem(
            "adminDashboardSettings",
            JSON.stringify(dashboard)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2200);
    };

    const handleThemeChange = (value) => {
        setTheme(value);
        localStorage.setItem("adminTheme", value);
    };

    const toggleNotification = (key) => {
        setNotifications((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const toggleAutoRefresh = () => {
        setDashboard((previous) => ({
            ...previous,
            autoRefresh: !previous.autoRefresh,
        }));
    };

    return (
        <div className="settings-page">

            {/* PAGE HEADER */}

            <div className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>
                        Manage your admin panel preferences.
                    </p>
                </div>

                <button
                    type="button"
                    className={`settings-save-button ${
                        saved ? "saved" : ""
                    }`}
                    onClick={saveSettings}
                >
                    {saved ? (
                        <>
                            <Check size={16} />
                            Saved
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>

            <div className="settings-layout">

                {/* =========================
                    APPEARANCE
                ========================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon appearance">
                            <Palette size={19} />
                        </div>

                        <div>
                            <h2>Appearance</h2>
                            <p>
                                Customize how the admin panel looks.
                            </p>
                        </div>

                    </div>

                    <div className="settings-section-content">

                        <div className="settings-row-block">

                            <div>
                                <strong>Theme</strong>
                                <span>
                                    Choose your preferred interface theme.
                                </span>
                            </div>

                        </div>

                        <div className="theme-options">

                            <button
                                type="button"
                                className={`theme-option ${
                                    theme === "light"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleThemeChange("light")
                                }
                            >
                                <div className="theme-preview light-preview">
                                    <Sun size={20} />
                                </div>

                                <div className="theme-option-text">
                                    <strong>Light</strong>
                                    <span>
                                        Clean light interface
                                    </span>
                                </div>

                                {theme === "light" && (
                                    <div className="theme-check">
                                        <Check size={13} />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                className={`theme-option ${
                                    theme === "dark"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleThemeChange("dark")
                                }
                            >
                                <div className="theme-preview dark-preview">
                                    <Moon size={20} />
                                </div>

                                <div className="theme-option-text">
                                    <strong>Dark</strong>
                                    <span>
                                        Dark interface
                                    </span>
                                </div>

                                {theme === "dark" && (
                                    <div className="theme-check">
                                        <Check size={13} />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                className={`theme-option ${
                                    theme === "system"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleThemeChange("system")
                                }
                            >
                                <div className="theme-preview system-preview">
                                    <Monitor size={20} />
                                </div>

                                <div className="theme-option-text">
                                    <strong>System</strong>
                                    <span>
                                        Follow system preference
                                    </span>
                                </div>

                                {theme === "system" && (
                                    <div className="theme-check">
                                        <Check size={13} />
                                    </div>
                                )}
                            </button>

                        </div>

                    </div>
                </section>

                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon notifications">
                            <Bell size={19} />
                        </div>

                        <div>
                            <h2>Notifications</h2>
                            <p>
                                Choose which alerts you want to receive.
                            </p>
                        </div>

                    </div>

                    <div className="settings-section-content">

                        <SettingToggle
                            title="Complaint Alerts"
                            description="Get notified about new and updated complaints."
                            enabled={notifications.complaints}
                            onClick={() =>
                                toggleNotification("complaints")
                            }
                        />

                        <SettingToggle
                            title="New User Requests"
                            description="Get notified when a new user registration is submitted."
                            enabled={notifications.users}
                            onClick={() =>
                                toggleNotification("users")
                            }
                        />

                        <SettingToggle
                            title="Sensor Alerts"
                            description="Receive alerts for unusual environmental readings."
                            enabled={notifications.sensors}
                            onClick={() =>
                                toggleNotification("sensors")
                            }
                        />

                        <SettingToggle
                            title="AI Insights"
                            description="Receive notifications when new AI insights are available."
                            enabled={notifications.ai}
                            onClick={() =>
                                toggleNotification("ai")
                            }
                        />

                    </div>
                </section>

                {/* =========================
                    DASHBOARD
                ========================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon dashboard">
                            <LayoutDashboard size={19} />
                        </div>

                        <div>
                            <h2>Dashboard Preferences</h2>
                            <p>
                                Configure how dashboard data is displayed.
                            </p>
                        </div>

                    </div>

                    <div className="settings-section-content">

                        <SettingToggle
                            title="Auto Refresh"
                            description="Automatically refresh live sensor data."
                            enabled={dashboard.autoRefresh}
                            onClick={toggleAutoRefresh}
                        />

                        <div className="settings-control-row">

                            <div>
                                <strong>Refresh Interval</strong>
                                <span>
                                    How often dashboard data should refresh.
                                </span>
                            </div>

                            <CustomSelect
                                value={dashboard.refreshInterval}
                                options={[
                                    {
                                        value: "15",
                                        label: "15 seconds",
                                    },
                                    {
                                        value: "30",
                                        label: "30 seconds",
                                    },
                                    {
                                        value: "60",
                                        label: "1 minute",
                                    },
                                    {
                                        value: "120",
                                        label: "2 minutes",
                                    },
                                ]}
                                onChange={(value) =>
                                    setDashboard((previous) => ({
                                        ...previous,
                                        refreshInterval: value,
                                    }))
                                }
                            />

                        </div>

                        <div className="settings-control-row">

                            <div>
                                <strong>Default Room</strong>
                                <span>
                                    Select the room shown by default.
                                </span>
                            </div>

                            <CustomSelect
                                value={dashboard.defaultRoom}
                                options={[
                                    {
                                        value: "ALL",
                                        label: "All Rooms",
                                    },
                                    {
                                        value: "ROOM-204",
                                        label: "ROOM-204",
                                    },
                                ]}
                                onChange={(value) =>
                                    setDashboard((previous) => ({
                                        ...previous,
                                        defaultRoom: value,
                                    }))
                                }
                            />

                        </div>

                    </div>
                </section>

                {/* =========================
                    SECURITY
                ========================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon security">
                            <ShieldCheck size={19} />
                        </div>

                        <div>
                            <h2>Security</h2>
                            <p>
                                Manage your administrator account security.
                            </p>
                        </div>

                    </div>

                    <div className="settings-section-content">

                        <div className="security-option">

                            <div className="security-option-icon">
                                <LockKeyhole size={17} />
                            </div>

                            <div className="security-option-content">
                                <strong>
                                    Password
                                </strong>

                                <span>
                                    Change your administrator password
                                    using the password reset system.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="settings-outline-button"
                                onClick={() =>
                                    alert(
                                        "Password change can be completed through Forgot Password."
                                    )
                                }
                            >
                                Change Password
                            </button>

                        </div>

                    </div>
                </section>

                {/* =========================
                    SYSTEM INFORMATION
                ========================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon system">
                            <Info size={19} />
                        </div>

                        <div>
                            <h2>System Information</h2>
                            <p>
                                Current Smart Campus system details.
                            </p>
                        </div>

                    </div>

                    <div className="system-info-grid">

                        <InfoItem
                            label="Application"
                            value="Smart Campus"
                        />

                        <InfoItem
                            label="Version"
                            value="1.0.0"
                        />

                        <InfoItem
                            label="Backend"
                            value="Spring Boot"
                        />

                        <InfoItem
                            label="Database"
                            value="MySQL"
                        />

                        <InfoItem
                            label="IoT Device"
                            value="ESP32"
                        />

                        <InfoItem
                            label="AI Service"
                            value="Python"
                        />

                    </div>

                </section>

            </div>
        </div>
    );
}


/* =========================
   TOGGLE COMPONENT
========================= */

function SettingToggle({
                           title,
                           description,
                           enabled,
                           onClick,
                       }) {
    return (
        <div className="settings-control-row">

            <div>
                <strong>{title}</strong>
                <span>{description}</span>
            </div>

            <button
                type="button"
                className={`settings-toggle ${
                    enabled ? "active" : ""
                }`}
                onClick={onClick}
                aria-pressed={enabled}
            >
                <span className="settings-toggle-knob" />
            </button>

        </div>
    );
}


/* =========================
   CUSTOM SELECT
========================= */

function CustomSelect({
                          value,
                          options,
                          onChange,
                      }) {
    const [open, setOpen] = useState(false);

    const selectedOption =
        options.find(
            (option) => option.value === value
        ) || options[0];

    return (
        <div className="custom-select">

            <button
                type="button"
                className={`custom-select-button ${
                    open ? "open" : ""
                }`}
                onClick={() =>
                    setOpen((previous) => !previous)
                }
            >
                <span>
                    {selectedOption.label}
                </span>

                <ChevronDown
                    size={15}
                    className={
                        open ? "select-arrow rotate" : "select-arrow"
                    }
                />
            </button>

            {open && (
                <>
                    <div
                        className="custom-select-backdrop"
                        onClick={() => setOpen(false)}
                    />

                    <div className="custom-select-menu">

                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`custom-select-option ${
                                    option.value === value
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                <span>
                                    {option.label}
                                </span>

                                {option.value === value && (
                                    <Check size={14} />
                                )}
                            </button>
                        ))}

                    </div>
                </>
            )}

        </div>
    );
}


/* =========================
   INFO ITEM
========================= */

function InfoItem({
                      label,
                      value,
                  }) {
    return (
        <div className="system-info-item">

            <span>{label}</span>

            <strong>{value}</strong>

        </div>
    );
}

export default Settings;