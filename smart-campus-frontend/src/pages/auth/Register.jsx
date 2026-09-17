import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import axios from "axios";

import logo from "../../assets/images/smart-campus-logo.png";
import campusBg from "../../assets/images/smart-campus-bg.jpg";

import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill all required fields.");
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password
                }
            );

            setSuccess(
                response.data ||
                "Registration submitted successfully."
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (err) {

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError(
                    "Registration failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Left Side */}
                <div
                    className="auth-visual"
                    style={{
                        backgroundImage: `url(${campusBg})`
                    }}
                >
                    <div className="visual-overlay"></div>

                    <div className="visual-content">

                        <div className="visual-heading">
                            <span>AI-Powered</span>

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

                {/* Right Side */}
                <div className="auth-form-section">

                    <div className="auth-form-container register-container">

                        <div className="brand">

                            <img
                                src={logo}
                                alt="Smart Campus Logo"
                                className="brand-logo"
                            />

                            <h1>Smart Campus</h1>

                            <p>
                                Resource Intelligence System
                            </p>

                        </div>

                        <div className="form-heading">

                            <h2>Create your account</h2>

                            <p>
                                Join us to be part of a smarter campus
                            </p>

                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>

                            <div className="input-group">
                                <label>Full Name</label>

                                <div className="input-wrapper">

                                    <User size={18} />

                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>

                                <div className="input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>

                                <div className="input-wrapper">

                                    <Lock size={18} />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
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

                            <div className="input-group">
                                <label>Confirm Password</label>

                                <div className="input-wrapper">

                                    <Lock size={18} />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
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

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Register"}
                            </button>

                        </form>

                        <div className="auth-bottom-text">
                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;