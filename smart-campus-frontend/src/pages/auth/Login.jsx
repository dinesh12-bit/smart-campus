import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import api from "../../api/axios";

import logo from "../../assets/images/smart-campus-logo.png";
import campusBg from "../../assets/images/smart-campus-bg.jpg";

import "./Auth.css";


function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [rememberMe, setRememberMe] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        if (
            !username.trim() ||
            !password.trim()
        ) {

            setError(
                "Please enter username and password."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/api/auth/login",
                    {
                        username:
                            username.trim(),

                        password
                    }
                );


            const data =
                response.data;


            /*
             * Remove old login/session data.
             * This prevents an old Technician/Student
             * token from being used for Admin.
             */

            localStorage.clear();
            sessionStorage.clear();


            const storage =
                rememberMe
                    ? localStorage
                    : sessionStorage;


            storage.setItem(
                "token",
                data.token
            );

            storage.setItem(
                "userId",
                data.userId
            );

            storage.setItem(
                "name",
                data.name
            );

            storage.setItem(
                "username",
                data.username || ""
            );

            storage.setItem(
                "email",
                data.email
            );

            storage.setItem(
                "role",
                data.role
            );


            /*
             * Redirect according to
             * authenticated backend role.
             */

            if (
                data.role === "ADMIN"
            ) {

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

            } else if (
                data.role === "TECHNICIAN"
            ) {

                navigate(
                    "/technician/dashboard",
                    {
                        replace: true
                    }
                );

            } else if (
                data.role === "STUDENT"
            ) {

                navigate(
                    "/student/dashboard",
                    {
                        replace: true
                    }
                );

            } else {

                setError(
                    "Invalid user role."
                );

            }

        } catch (err) {

            console.error(
                "Login error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                setError(
                    "Invalid username or password."
                );

            } else if (
                err.response?.status === 403
            ) {

                setError(
                    "Your account is not active or you do not have access."
                );

            } else if (
                err.response?.data?.message
            ) {

                setError(
                    err.response.data.message
                );

            } else {

                setError(
                    "Unable to login. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

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


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

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
                                Sign in to your account
                            </h2>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">

                                {error}

                            </div>

                        )}


                        {/* LOGIN FORM */}

                        <form
                            onSubmit={handleLogin}
                        >


                            {/* USERNAME */}

                            <div className="input-group">

                                <label>
                                    Email or Username
                                </label>


                                <div className="input-wrapper">

                                    <Mail
                                        size={18}
                                    />


                                    <input
                                        type="text"
                                        placeholder="Enter email or username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="username"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="input-group">

                                <label>
                                    Password
                                </label>


                                <div className="input-wrapper">

                                    <Lock
                                        size={18}
                                    />


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="current-password"
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

                                            <EyeOff
                                                size={18}
                                            />

                                        ) : (

                                            <Eye
                                                size={18}
                                            />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* OPTIONS */}

                            <div className="form-options">


                                <label className="remember-option">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target.checked
                                            )
                                        }
                                    />


                                    <span>
                                        Remember me
                                    </span>

                                </label>


                                <Link
                                    to="/forgot-password"
                                    className="forgot-link"
                                >
                                    Forgot Password?
                                </Link>


                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }

                            </button>


                        </form>


                        {/* REGISTER */}

                        <div className="auth-bottom-text">

                            Don't have an account?

                            <Link to="/register">
                                Register
                            </Link>

                        </div>


                    </div>

                </div>


            </div>

        </div>

    );
}


export default Login;