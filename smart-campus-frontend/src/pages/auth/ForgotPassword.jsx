import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import api from "../../api/axios";

import logo from "../../assets/images/smart-campus-logo.png";
import campusBg from "../../assets/images/smart-campus-bg.jpg";

import "./Auth.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/api/auth/forgot-password",
                {
                    email: email.trim()
                }
            );

            /*
             * Backend currently returns the reset token.
             * We temporarily store it so the Reset Password
             * page can use it during development/testing.
             */
            const token = response.data;

            sessionStorage.setItem(
                "passwordResetToken",
                token
            );

            setSuccess(
                "Reset token generated successfully. Redirecting..."
            );

            setTimeout(() => {
                navigate("/reset-password");
            }, 1200);

        } catch (err) {

            console.error(
                "Forgot password error:",
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
                    "Unable to process your request. Please try again."
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
                                Forgot Password?
                            </h2>

                            <p>
                                Enter your registered email address
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
                                handleForgotPassword
                            }
                        >

                            <div className="input-group">

                                <label>
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Generating Token..."
                                    : "Send Reset Token"
                                }

                            </button>

                        </form>


                        {/* BACK TO LOGIN */}

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

export default ForgotPassword;