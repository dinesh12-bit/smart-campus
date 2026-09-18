import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    KeyRound,
    ArrowLeft
} from "lucide-react";

import api from "../../api/axios";

import logo from "../../assets/images/smart-campus-logo.png";
import campusBg from "../../assets/images/smart-campus-bg.jpg";

import "./Auth.css";

function ResetPassword() {

    const navigate = useNavigate();

    const [token, setToken] = useState(
        sessionStorage.getItem("passwordResetToken") || ""
    );

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token.trim()) {
            setError("Please enter the reset token.");
            return;
        }

        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/api/auth/reset-password",
                {
                    token: token.trim(),
                    newPassword
                }
            );

            setSuccess(
                response.data ||
                "Password reset successfully."
            );

            sessionStorage.removeItem(
                "passwordResetToken"
            );

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1500);

        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            if (err.response?.data?.message) {

                setError(
                    err.response.data.message
                );

            } else if (err.response?.data) {

                setError(
                    err.response.data
                );

            } else {

                setError(
                    "Unable to reset password. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                {/* LEFT SIDE */}

                <div
                    className="auth-visual"
                    style={{
                        backgroundImage:
                            `url(${campusBg})`
                    }}
                >

                    <div className="visual-overlay"></div>

                    <div className="visual-content">

                        <div className="visual-heading">

                            <span>
                                AI-Powered
                            </span>

                            <strong>
                                Smart <em>Campus</em>
                            </strong>

                        </div>

                        <p className="visual-description">
                            Monitor. Analyze. Optimize.
                            <br />
                            For a better tomorrow.
                        </p>

                        <div className="visual-features">

                            <div className="visual-feature">

                                <div className="feature-icon">
                                    ◫
                                </div>

                                <div>

                                    <strong>
                                        Smart Monitoring
                                    </strong>

                                    <span>
                                        Real-time insights
                                    </span>

                                </div>

                            </div>

                            <div className="visual-feature">

                                <div className="feature-icon">
                                    ⌁
                                </div>

                                <div>

                                    <strong>
                                        Sustainable Campus
                                    </strong>

                                    <span>
                                        Greener tomorrow
                                    </span>

                                </div>

                            </div>

                            <div className="visual-feature">

                                <div className="feature-icon">
                                    ◇
                                </div>

                                <div>

                                    <strong>
                                        Safer Environment
                                    </strong>

                                    <span>
                                        For everyone
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="visual-footer">

                            SMART CAMPUS

                            <span>
                                BUILDING A SMARTER TOMORROW
                            </span>

                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="auth-form-section">

                    <div className="auth-form-container">

                        {/* BRAND */}

                        <div className="brand">

                            <img
                                src={logo}
                                alt="Smart Campus Logo"
                                className="brand-logo"
                            />

                            <h1>
                                Smart Campus
                            </h1>

                            <p>
                                Resource Intelligence System
                            </p>

                        </div>


                        {/* HEADING */}

                        <div className="form-heading">

                            <h2>
                                Reset Password
                            </h2>

                            <p>
                                Create a new password for your account
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="auth-success">
                                {success}
                            </div>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleResetPassword
                            }
                        >

                            {/* TOKEN */}

                            <div className="input-group">

                                <label>
                                    Reset Token
                                </label>

                                <div className="input-wrapper">

                                    <KeyRound size={18} />

                                    <input
                                        type="text"
                                        placeholder="Enter reset token"
                                        value={token}
                                        onChange={(e) =>
                                            setToken(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="input-group">

                                <label>
                                    New Password
                                </label>

                                <div className="input-wrapper">

                                    <Lock size={18} />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="input-group">

                                <label>
                                    Confirm Password
                                </label>

                                <div className="input-wrapper">

                                    <Lock size={18} />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm new password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* RESET BUTTON */}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"
                                }

                            </button>

                        </form>


                        {/* LOGIN */}

                        <div className="auth-bottom-text">

                            <Link
                                to="/login"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    marginLeft: 0
                                }}
                            >

                                <ArrowLeft size={14} />

                                Back to Login

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;