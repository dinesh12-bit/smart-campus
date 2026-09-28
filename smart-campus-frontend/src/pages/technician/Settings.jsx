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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/technicianSettings.css";


const defaultSettings = {
    taskNotifications: true,
    complaintNotifications: true,
    systemNotifications: true,
    appearance: "light",
};


// =========================================================
// GET ACTIVE STORAGE
// =========================================================

function getStorage() {

    return sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;
}


// =========================================================
// GET TECHNICIAN DATA
// =========================================================

function getTechnicianData() {

    const storage =
        getStorage();


    let user = null;


    try {

        const storedUser =
            storage.getItem("user") ||
            storage.getItem("currentUser");


        if (storedUser) {

            user =
                JSON.parse(storedUser);

        }

    } catch {

        user = null;

    }


    return {

        name:
            user?.name ||
            user?.fullName ||
            storage.getItem("name") ||
            user?.username ||
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
            user?.userId ||
            user?.id ||
            storage.getItem("technicianId") ||
            storage.getItem("employeeId") ||
            storage.getItem("userId") ||
            "Not available",


        username:
            user?.username ||
            storage.getItem("username") ||
            "Not available",


        role:
            user?.role ||
            storage.getItem("role") ||
            "TECHNICIAN",

    };
}


// =========================================================
// SETTINGS COMPONENT
// =========================================================

function Settings() {

    const navigate =
        useNavigate();


    const [technician, setTechnician] =
        useState(
            getTechnicianData()
        );


    const [settings, setSettings] =
        useState(
            defaultSettings
        );


    const [saved, setSaved] =
        useState(false);


    // =========================================================
    // LOAD SETTINGS
    // =========================================================

    useEffect(() => {

        setTechnician(
            getTechnicianData()
        );


        try {

            const stored =
                localStorage.getItem(
                    "technicianSettings"
                );


            if (stored) {

                setSettings({

                    ...defaultSettings,

                    ...JSON.parse(
                        stored
                    ),

                });

            }

        } catch {

            setSettings(
                defaultSettings
            );

        }

    }, []);


    // =========================================================
    // UPDATE SETTING
    // =========================================================

    const updateSetting = (
        key,
        value
    ) => {

        setSettings(
            (previous) => ({

                ...previous,

                [key]: value,

            })
        );


        setSaved(false);

    };


    // =========================================================
    // APPLY APPEARANCE
    // =========================================================

    const applyAppearance = (
        appearance
    ) => {

        if (
            appearance ===
            "dark"
        ) {

            document.documentElement
                .classList
                .add(
                    "dark-mode"
                );

        } else {

            document.documentElement
                .classList
                .remove(
                    "dark-mode"
                );

        }

    };


    // =========================================================
    // SAVE SETTINGS
    // =========================================================

    const saveSettings = () => {

        localStorage.setItem(
            "technicianSettings",
            JSON.stringify(
                settings
            )
        );


        applyAppearance(
            settings.appearance
        );


        setSaved(true);


        setTimeout(() => {

            setSaved(false);

        }, 2500);

    };


    // =========================================================
    // RESET SETTINGS
    // =========================================================

    const resetSettings = () => {

        setSettings(
            defaultSettings
        );


        localStorage.setItem(
            "technicianSettings",
            JSON.stringify(
                defaultSettings
            )
        );


        applyAppearance(
            "light"
        );


        setSaved(true);


        setTimeout(() => {

            setSaved(false);

        }, 2500);

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        sessionStorage.removeItem(
            "token"
        );

        sessionStorage.removeItem(
            "jwt"
        );

        sessionStorage.removeItem(
            "user"
        );

        sessionStorage.removeItem(
            "currentUser"
        );

        sessionStorage.removeItem(
            "userId"
        );

        sessionStorage.removeItem(
            "name"
        );

        sessionStorage.removeItem(
            "username"
        );

        sessionStorage.removeItem(
            "email"
        );

        sessionStorage.removeItem(
            "role"
        );


        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "jwt"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "name"
        );

        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "email"
        );

        localStorage.removeItem(
            "role"
        );


        navigate(
            "/login",
            {
                replace: true,
            }
        );

    };


    // =========================================================
    // TECHNICIAN INITIAL
    // =========================================================

    const technicianInitial =
        technician.name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "T";


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="technician-settings-page">

            <div className="technician-settings-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="settings-heading">

                    <div>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your technician account and application preferences.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {saved && (

                    <div className="settings-success">

                        <CheckCircle
                            size={17}
                        />

                        <span>
                            Settings saved successfully
                        </span>

                    </div>

                )}


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-purple">

                            <User
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Your currently authenticated technician account.
                            </p>

                        </div>

                    </div>


                    <div className="account-information">


                        {/* AVATAR */}

                        <div className="account-avatar">

                            {technicianInitial}

                        </div>


                        {/* DETAILS */}

                        <div className="account-details">


                            <div className="account-detail">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {
                                        technician.name
                                    }
                                </strong>

                            </div>


                            <div className="account-detail">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        technician.email
                                    }
                                </strong>

                            </div>


                            <div className="account-detail">

                                <span>
                                    Technician ID
                                </span>

                                <strong>
                                    {
                                        technician.technicianId
                                    }
                                </strong>

                            </div>


                            <div className="account-detail">

                                <span>
                                    Role
                                </span>

                                <strong>
                                    Technician
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-blue">

                            <Bell
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Choose which notifications you want to receive.
                            </p>

                        </div>

                    </div>


                    <div className="settings-options">


                        {/* TASK */}

                        <div className="setting-row">

                            <div className="setting-row-icon blue">

                                <Bell
                                    size={17}
                                />

                            </div>


                            <div className="setting-row-content">

                                <h3>
                                    Task Assignments
                                </h3>

                                <p>
                                    Receive notifications when a new task is assigned to you.
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

                                aria-label="Toggle task notifications"

                                aria-pressed={
                                    settings.taskNotifications
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* COMPLAINT */}

                        <div className="setting-row">

                            <div className="setting-row-icon green">

                                <CheckCircle
                                    size={17}
                                />

                            </div>


                            <div className="setting-row-content">

                                <h3>
                                    Complaint Updates
                                </h3>

                                <p>
                                    Receive notifications when the status of your complaints changes.
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

                                aria-label="Toggle complaint notifications"

                                aria-pressed={
                                    settings.complaintNotifications
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* SYSTEM */}

                        <div className="setting-row">

                            <div className="setting-row-icon orange">

                                <Shield
                                    size={17}
                                />

                            </div>


                            <div className="setting-row-content">

                                <h3>
                                    System Notifications
                                </h3>

                                <p>
                                    Receive important Smart Campus system notifications.
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

                                aria-label="Toggle system notifications"

                                aria-pressed={
                                    settings.systemNotifications
                                }
                            >

                                <span />

                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    APPEARANCE
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-yellow">

                            <Palette
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Appearance
                            </h2>

                            <p>
                                Choose how Smart Campus should appear on your device.
                            </p>

                        </div>

                    </div>


                    <div className="appearance-options">


                        {/* LIGHT */}

                        <button
                            type="button"

                            className={`appearance-option ${
                                settings.appearance ===
                                "light"
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

                                <Sun
                                    size={18}
                                />

                            </div>


                            <div>

                                <strong>
                                    Light
                                </strong>

                                <span>
                                    Use the light interface
                                </span>

                            </div>


                            {settings.appearance ===
                                "light" && (

                                    <CheckCircle
                                        size={17}
                                    />

                                )}

                        </button>


                        {/* SYSTEM */}

                        <button
                            type="button"

                            className={`appearance-option ${
                                settings.appearance ===
                                "system"
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

                                <Monitor
                                    size={18}
                                />

                            </div>


                            <div>

                                <strong>
                                    System
                                </strong>

                                <span>
                                    Follow your device preference
                                </span>

                            </div>


                            {settings.appearance ===
                                "system" && (

                                    <CheckCircle
                                        size={17}
                                    />

                                )}

                        </button>


                        {/* DARK */}

                        <button
                            type="button"

                            className={`appearance-option ${
                                settings.appearance ===
                                "dark"
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

                                <Moon
                                    size={18}
                                />

                            </div>


                            <div>

                                <strong>
                                    Dark
                                </strong>

                                <span>
                                    Use the dark interface
                                </span>

                            </div>


                            {settings.appearance ===
                                "dark" && (

                                    <CheckCircle
                                        size={17}
                                    />

                                )}

                        </button>

                    </div>

                </section>


                {/* =================================================
                    SECURITY
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon settings-icon-red">

                            <Shield
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Manage your account session.
                            </p>

                        </div>

                    </div>


                    <div className="security-content">

                        <div>

                            <h3>
                                Sign out from this device
                            </h3>

                            <p>
                                Remove your current authentication session and return to the login screen.
                            </p>

                        </div>


                        <button
                            type="button"

                            className="logout-settings-button"

                            onClick={
                                handleLogout
                            }
                        >

                            <LogOut
                                size={16}
                            />

                            Logout

                        </button>

                    </div>

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="settings-actions">

                    <button
                        type="button"

                        className="reset-settings-button"

                        onClick={
                            resetSettings
                        }
                    >

                        <RotateCcw
                            size={16}
                        />

                        Reset

                    </button>


                    <button
                        type="button"

                        className="save-settings-button"

                        onClick={
                            saveSettings
                        }
                    >

                        <Save
                            size={16}
                        />

                        Save Changes

                    </button>

                </div>


            </div>

        </div>

    );
}


export default Settings;