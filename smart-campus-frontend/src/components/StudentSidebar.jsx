import {
    LayoutDashboard,
    PlusSquare,
    ClipboardList,
    Building2,
    UserRound,
    CircleHelp,
    Settings,
    LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/smart-campus-logo.png";
import "../styles/studentSidebar.css";

function StudentSidebar() {
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
        <aside className="student-sidebar">

            <div className="student-sidebar-brand">

                <img
                    src={logo}
                    alt="Smart Campus"
                    className="student-logo"
                />

                <span>
                    Smart Campus
                </span>

            </div>

            <div className="student-menu-label">
                MAIN MENU
            </div>

            <nav className="student-navigation">

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/dashboard")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/dashboard")
                    }
                >
                    <LayoutDashboard size={17} />

                    <span>
                        Dashboard
                    </span>
                </button>

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/complaints/new")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/complaints/new")
                    }
                >
                    <PlusSquare size={17} />

                    <span>
                        Raise Complaint
                    </span>
                </button>

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/complaints")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/complaints")
                    }
                >
                    <ClipboardList size={17} />

                    <span>
                        My Complaints
                    </span>
                </button>

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/services")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/services")
                    }
                >
                    <Building2 size={17} />

                    <span>
                        Campus Services
                    </span>
                </button>

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/profile")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/profile")
                    }
                >
                    <UserRound size={17} />

                    <span>
                        Profile
                    </span>
                </button>

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/help")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/help")
                    }
                >
                    <CircleHelp size={17} />

                    <span>
                        Help & Support
                    </span>
                </button>

            </nav>

            <div className="student-sidebar-bottom">

                <button
                    type="button"
                    className={`student-nav-item ${
                        isActive("/student/settings")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        navigate("/student/settings")
                    }
                >
                    <Settings size={17} />

                    <span>
                        Settings
                    </span>
                </button>

                <button
                    type="button"
                    className="student-nav-item student-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={17} />

                    <span>
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    );
}

export default StudentSidebar;