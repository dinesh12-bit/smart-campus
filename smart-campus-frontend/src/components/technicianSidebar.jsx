import {
    LayoutDashboard,
    ClipboardList,
    MessageSquareText,
    UserRound,
    Settings,
    LogOut,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import logo from "../assets/images/smart-campus-logo.png";

import "../styles/technicianSidebar.css";

function TechnicianSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <aside className="technician-sidebar">

            {/* =========================
                BRAND
            ========================= */}

            <div className="technician-sidebar-brand">

                <img
                    src={logo}
                    alt="Smart Campus"
                    className="technician-logo"
                />

                <div className="technician-brand-text">
                    <strong>
                        Smart Campus
                    </strong>

                    <span>
                        Resource Management
                    </span>
                </div>

            </div>


            {/* =========================
                MAIN MENU
            ========================= */}

            <div className="technician-menu-label">
                MAIN MENU
            </div>

            <nav className="technician-navigation">

                <button
                    type="button"
                    className={`technician-nav-item ${
                        isActive(
                            "/technician/dashboard"
                        )
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate(
                            "/technician/dashboard"
                        )
                    }
                >
                    <LayoutDashboard size={18} />

                    <span>
                        Dashboard
                    </span>
                </button>


                <button
                    type="button"
                    className={`technician-nav-item ${
                        isActive(
                            "/technician/tasks"
                        )
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate(
                            "/technician/tasks"
                        )
                    }
                >
                    <ClipboardList size={18} />

                    <span>
                        My Tasks
                    </span>
                </button>


                <button
                    type="button"
                    className={`technician-nav-item ${
                        isActive(
                            "/technician/complaints"
                        )
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate(
                            "/technician/complaints"
                        )
                    }
                >
                    <MessageSquareText
                        size={18}
                    />

                    <span>
                        Complaints
                    </span>
                </button>


                <button
                    type="button"
                    className={`technician-nav-item ${
                        isActive(
                            "/technician/profile"
                        )
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate(
                            "/technician/profile"
                        )
                    }
                >
                    <UserRound size={18} />

                    <span>
                        Profile
                    </span>
                </button>

            </nav>


            {/* =========================
                BOTTOM
            ========================= */}

            <div className="technician-sidebar-bottom">

                <button
                    type="button"
                    className={`technician-nav-item ${
                        isActive("/technician/settings")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/technician/settings")
                    }
                >
                    <Settings size={18} />

                    <span>
        Settings
    </span>
                </button>


                <button
                    type="button"
                    className="technician-nav-item technician-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />

                    <span>
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    );
}

export default TechnicianSidebar;