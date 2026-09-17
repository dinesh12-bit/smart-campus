import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    ShieldCheck,
    BadgeCheck,
    CalendarDays,
    RefreshCw,
    LockKeyhole,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/adminProfile.css";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadProfile = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/api/auth/me");

            setProfile(response.data);
        } catch (err) {
            console.error("Failed to load admin profile:", err);

            if (err.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else if (err.response?.status === 403) {
                setError(
                    "You are not authorized to view this profile."
                );
            } else {
                setError("Unable to load profile.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
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

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getInitial = () => {
        if (!profile?.name) {
            return "A";
        }

        return profile.name
            .trim()
            .charAt(0)
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className="admin-profile-page">
                <div className="admin-profile-loading">
                    <div className="admin-profile-spinner" />
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-profile-page">
                <div className="admin-profile-error">
                    <UserRound size={38} />

                    <h3>Unable to load profile</h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => loadProfile(true)}
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-profile-page">

            {/* PAGE HEADER */}

            <div className="admin-profile-header">

                <div>
                    <h1>My Profile</h1>

                    <p>
                        View your administrator account information.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-profile-refresh"
                    onClick={() => loadProfile(true)}
                    disabled={refreshing}
                    title="Refresh profile"
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "admin-profile-refresh-spin"
                                : ""
                        }
                    />
                </button>

            </div>


            {/* PROFILE HERO */}

            <section className="admin-profile-card">

                <div className="admin-profile-cover">
                    <div className="admin-profile-cover-pattern" />
                </div>

                <div className="admin-profile-main">

                    <div className="admin-profile-avatar">
                        {getInitial()}
                    </div>

                    <div className="admin-profile-identity">

                        <div className="admin-profile-name-row">

                            <h2>
                                {profile?.name || "System Admin"}
                            </h2>

                            <span className="admin-profile-active">
                                <span />
                                {profile?.status || "ACTIVE"}
                            </span>

                        </div>

                        <p className="admin-profile-role">
                            <ShieldCheck size={15} />
                            Super Admin
                        </p>

                        <p className="admin-profile-email">
                            {profile?.email ||
                                "admin@smartcampus.com"}
                        </p>

                    </div>

                </div>

            </section>


            {/* LOWER CONTENT */}

            <div className="admin-profile-grid">

                {/* ACCOUNT INFORMATION */}

                <section className="admin-profile-info-card">

                    <div className="admin-profile-card-title">

                        <div className="admin-profile-title-icon">
                            <UserRound size={18} />
                        </div>

                        <div>
                            <h3>Account Information</h3>

                            <p>
                                Your registered administrator details
                            </p>
                        </div>

                    </div>


                    <div className="admin-profile-details">

                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <UserRound size={17} />
                            </div>

                            <div>
                                <span>Full Name</span>

                                <strong>
                                    {profile?.name || "--"}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <Mail size={17} />
                            </div>

                            <div>
                                <span>Email Address</span>

                                <strong>
                                    {profile?.email || "--"}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <BadgeCheck size={17} />
                            </div>

                            <div>
                                <span>Account Role</span>

                                <strong>
                                    Super Admin
                                </strong>
                            </div>

                        </div>


                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <ShieldCheck size={17} />
                            </div>

                            <div>
                                <span>System Role</span>

                                <strong>
                                    {profile?.role || "ADMIN"}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <CalendarDays size={17} />
                            </div>

                            <div>
                                <span>Joined On</span>

                                <strong>
                                    {formatDate(
                                        profile?.createdAt
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-profile-detail">

                            <div className="admin-profile-detail-icon">
                                <LockKeyhole size={17} />
                            </div>

                            <div>
                                <span>Password</span>

                                <strong>
                                    Protected
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ADMIN NOTICE */}

                <section className="admin-profile-notice-card">

                    <div className="admin-profile-notice-icon">
                        <ShieldCheck size={21} />
                    </div>

                    <div>

                        <h3>Administrator Account</h3>

                        <p>
                            This account has full administrative
                            access to the Smart Campus system.
                        </p>

                        <div className="admin-profile-permission">

                            <div>
                                <span className="permission-dot" />
                                User Management
                            </div>

                            <div>
                                <span className="permission-dot" />
                                Room Management
                            </div>

                            <div>
                                <span className="permission-dot" />
                                Complaint Management
                            </div>

                            <div>
                                <span className="permission-dot" />
                                System Monitoring
                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Profile;