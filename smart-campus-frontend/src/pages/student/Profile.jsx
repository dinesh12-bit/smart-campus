import { useEffect, useState } from "react";
import {
    ArrowLeft,
    UserRound,
    Mail,
    Phone,
    GraduationCap,
    Hash,
    Building2,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../styles/studentProfile.css";

function Profile() {
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/auth/me"
            );

            setStudent(response.data);

        } catch (err) {
            console.error(err);

            setError(
                "Unable to load profile from server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const getValue = (...values) => {
        const value = values.find(
            (item) =>
                item !== undefined &&
                item !== null &&
                String(item).trim() !== ""
        );

        return value || "Not available";
    };

    const studentName = getValue(
        student?.name,
        student?.fullName,
        student?.username
    );

    const studentInitial =
        studentName
            .trim()
            .charAt(0)
            .toUpperCase() || "S";

    const email = getValue(
        student?.email,
        student?.username
    );

    const studentId = getValue(
        student?.studentId,
        student?.rollNumber,
        student?.userId,
        student?.id
    );

    const phone = getValue(
        student?.phone,
        student?.phoneNumber,
        student?.mobile
    );

    const department = getValue(
        student?.department,
        student?.course,
        student?.program
    );

    const year = getValue(
        student?.year,
        student?.yearOfStudy,
        student?.academicYear
    );

    const building = getValue(
        student?.building,
        student?.campus
    );

    if (loading) {
        return (
            <div className="student-profile-page">

                <div className="student-profile-loading">

                    <div className="student-profile-loader">
                        <RefreshCw size={22} />
                    </div>

                    <span>
                        Loading your profile...
                    </span>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="student-profile-page">

                <div className="student-profile-error">

                    <div className="student-profile-error-icon">
                        <UserRound size={25} />
                    </div>

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
                        <RefreshCw size={14} />
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="student-profile-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="student-profile-header">

                <div className="student-profile-title-row">

                    <button
                        type="button"
                        className="student-profile-back"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div>

                        <h1>
                            Profile
                        </h1>

                        <div className="student-profile-breadcrumb">

                            <span>
                                Dashboard
                            </span>

                            <span>
                                ›
                            </span>

                            <strong>
                                Profile
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                PROFILE HERO
            ========================= */}

            <div className="student-profile-hero">

                <div className="student-profile-avatar">
                    {studentInitial}
                </div>

                <div className="student-profile-hero-info">

                    <h2>
                        {studentName}
                    </h2>

                    <p>
                        {email}
                    </p>

                    <span className="student-profile-role">
                        <ShieldCheck size={12} />
                        Student
                    </span>

                </div>

            </div>


            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            <div className="student-profile-card">

                <div className="student-profile-card-header">

                    <div className="student-profile-section-icon purple">
                        <UserRound size={18} />
                    </div>

                    <div>

                        <h2>
                            Personal Information
                        </h2>

                        <p>
                            Your registered student information
                        </p>

                    </div>

                </div>


                <div className="student-profile-info-grid">

                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon purple">
                            <Mail size={17} />
                        </div>

                        <div>
                            <span>
                                Email Address
                            </span>

                            <strong>
                                {email}
                            </strong>
                        </div>

                    </div>


                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon blue">
                            <Phone size={17} />
                        </div>

                        <div>
                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {phone}
                            </strong>
                        </div>

                    </div>


                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon green">
                            <Hash size={17} />
                        </div>

                        <div>
                            <span>
                                Student ID
                            </span>

                            <strong>
                                {studentId}
                            </strong>
                        </div>

                    </div>


                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon orange">
                            <GraduationCap size={17} />
                        </div>

                        <div>
                            <span>
                                Department / Course
                            </span>

                            <strong>
                                {department}
                            </strong>
                        </div>

                    </div>


                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon yellow">
                            <Building2 size={17} />
                        </div>

                        <div>
                            <span>
                                Academic Year
                            </span>

                            <strong>
                                {year}
                            </strong>
                        </div>

                    </div>


                    <div className="student-profile-info-item">

                        <div className="student-profile-info-icon red">
                            <Building2 size={17} />
                        </div>

                        <div>
                            <span>
                                Campus / Building
                            </span>

                            <strong>
                                {building}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                ACCOUNT INFORMATION
            ========================= */}

            <div className="student-profile-card">

                <div className="student-profile-card-header">

                    <div className="student-profile-section-icon green">
                        <ShieldCheck size={18} />
                    </div>

                    <div>

                        <h2>
                            Account Information
                        </h2>

                        <p>
                            Current account status and role
                        </p>

                    </div>

                </div>


                <div className="student-account-row">

                    <div className="student-account-item">

                        <span>
                            Account Status
                        </span>

                        <strong className="student-account-active">
                            <span></span>
                            {getValue(
                                student?.status,
                                "ACTIVE"
                            )}
                        </strong>

                    </div>


                    <div className="student-account-item">

                        <span>
                            Account Role
                        </span>

                        <strong>
                            {getValue(
                                student?.role,
                                "STUDENT"
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;