import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    ShieldCheck,
    BadgeCheck,
    CalendarDays,
    Wrench,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/technicianProfile.css";

function TechnicianProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/auth/me");

            setProfile(response.data);
        } catch (err) {
            console.error("Failed to load profile:", err);

            if (err.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else if (err.response?.status === 403) {
                setError(
                    "You are not authorized to view this profile."
                );
            } else {
                setError(
                    "Unable to load profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "--";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "--";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getInitial = () => {
        if (!profile?.name) {
            return "T";
        }

        return profile.name
            .charAt(0)
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className="technician-profile-page">

                <div className="technician-profile-loading">

                    <div className="technician-profile-spinner"></div>

                    <p>
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="technician-profile-page">

                <div className="technician-profile-error">

                    <UserRound size={38} />

                    <h3>
                        Unable to load profile
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadProfile}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="technician-profile-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="technician-profile-header">

                <div>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        View your technician account information.
                    </p>

                </div>

            </div>


            {/* =========================
                PROFILE CARD
            ========================= */}

            <section className="technician-profile-card">

                <div className="technician-profile-cover">
                    <div className="technician-profile-cover-shape"></div>
                </div>

                <div className="technician-profile-main">

                    <div className="technician-profile-avatar">
                        {getInitial()}
                    </div>

                    <div className="technician-profile-content">

                        <div className="technician-profile-name-row">

                            <h2>
                                {profile?.name || "Technician"}
                            </h2>

                            <span className="technician-active-badge">
                                <span></span>
                                ACTIVE
                            </span>

                        </div>

                        <div className="technician-role">

                            <Wrench size={15} />

                            <span>
                                Technician
                            </span>

                        </div>

                        <div className="technician-id">

                            Technician ID:

                            <strong>
                                {profile?.username || "--"}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                LOWER SECTION
            ========================= */}

            <div className="technician-profile-grid">

                {/* ACCOUNT INFORMATION */}

                <section className="technician-account-card">

                    <div className="technician-card-header">

                        <div className="technician-card-icon purple">
                            <UserRound size={20} />
                        </div>

                        <div>

                            <h3>
                                Account Information
                            </h3>

                            <p>
                                Your registered technician details
                            </p>

                        </div>

                    </div>


                    <div className="technician-account-details">

                        <div className="technician-detail-item">

                            <div className="technician-detail-icon">
                                <UserRound size={17} />
                            </div>

                            <div>

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {profile?.name || "--"}
                                </strong>

                            </div>

                        </div>


                        <div className="technician-detail-item">

                            <div className="technician-detail-icon">
                                <Mail size={17} />
                            </div>

                            <div>

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {profile?.email || "--"}
                                </strong>

                            </div>

                        </div>


                        <div className="technician-detail-item">

                            <div className="technician-detail-icon">
                                <BadgeCheck size={17} />
                            </div>

                            <div>

                                <span>
                                    Technician ID
                                </span>

                                <strong>
                                    {profile?.username || "--"}
                                </strong>

                            </div>

                        </div>


                        <div className="technician-detail-item">

                            <div className="technician-detail-icon">
                                <ShieldCheck size={17} />
                            </div>

                            <div>

                                <span>
                                    Account Role
                                </span>

                                <strong>
                                    {profile?.role || "TECHNICIAN"}
                                </strong>

                            </div>

                        </div>


                        <div className="technician-detail-item technician-detail-last">

                            <div className="technician-detail-icon">
                                <CalendarDays size={17} />
                            </div>

                            <div>

                                <span>
                                    Joined On
                                </span>

                                <strong>
                                    {formatDate(
                                        profile?.createdAt
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* TECHNICIAN ACCOUNT */}

                <section className="technician-account-side-card">

                    <div className="technician-card-header">

                        <div className="technician-card-icon purple">
                            <ShieldCheck size={20} />
                        </div>

                        <div>

                            <h3>
                                Technician Account
                            </h3>

                            <p>
                                Your technician account is managed by the campus administrator.
                            </p>

                        </div>

                    </div>


                    <div className="technician-permissions">

                        <div>
                            <span></span>
                            Task Assignment
                        </div>

                        <div>
                            <span></span>
                            Complaint Management
                        </div>

                        <div>
                            <span></span>
                            System Notifications
                        </div>

                        <div>
                            <span></span>
                            Account Management
                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default TechnicianProfile;