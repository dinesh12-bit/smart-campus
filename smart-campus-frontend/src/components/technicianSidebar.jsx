import {
    LayoutDashboard,
    ClipboardList,
    MessageSquareText,
    UserRound,
    Settings,
    LogOut,
    X,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import logo from "../assets/images/smart-campus-logo.png";

import "../styles/technicianSidebar.css";


function TechnicianSidebar({
                               isOpen = false,
                               onClose = () => {},
                           }) {

    const location = useLocation();
    const navigate = useNavigate();


    const isActive = (path) => {
        return location.pathname === path;
    };


    const handleNavigation = (path) => {

        navigate(path);

        onClose();
    };


    const handleLogout = () => {

        sessionStorage.clear();
        localStorage.clear();

        onClose();

        navigate("/login", {
            replace: true,
        });
    };


    return (
        <>

            {/* MOBILE OVERLAY */}

            <div
                className={`technician-sidebar-overlay ${
                    isOpen ? "show" : ""
                }`}
                onClick={onClose}
                aria-hidden="true"
            />


            {/* SIDEBAR */}

            <aside
                className={`technician-sidebar ${
                    isOpen ? "mobile-open" : ""
                }`}
            >

                {/* MOBILE CLOSE BUTTON */}

                <button
                    type="button"
                    className="technician-sidebar-close"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X size={21} />
                </button>


                {/* BRAND */}

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


                {/* MENU LABEL */}

                <div className="technician-menu-label">
                    MAIN MENU
                </div>


                {/* NAVIGATION */}

                <nav className="technician-navigation">

                    {/* DASHBOARD */}

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
                            handleNavigation(
                                "/technician/dashboard"
                            )
                        }
                    >

                        <LayoutDashboard size={18} />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* MY TASKS */}

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
                            handleNavigation(
                                "/technician/tasks"
                            )
                        }
                    >

                        <ClipboardList size={18} />

                        <span>
                            My Tasks
                        </span>

                    </button>


                    {/* COMPLAINTS */}

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
                            handleNavigation(
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


                    {/* PROFILE */}

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
                            handleNavigation(
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


                {/* BOTTOM */}

                <div className="technician-sidebar-bottom">

                    {/* SETTINGS */}

                    <button
                        type="button"
                        className={`technician-nav-item ${
                            isActive(
                                "/technician/settings"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/technician/settings"
                            )
                        }
                    >

                        <Settings size={18} />

                        <span>
                            Settings
                        </span>

                    </button>


                    {/* LOGOUT */}

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

        </>
    );
}

export default TechnicianSidebar;