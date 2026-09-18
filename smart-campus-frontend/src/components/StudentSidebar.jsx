import {
    LayoutDashboard,
    PlusSquare,
    ClipboardList,
    Building2,
    UserRound,
    CircleHelp,
    Settings,
    LogOut,
    X,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import logo from "../assets/images/smart-campus-logo.png";

import "../styles/studentSidebar.css";


function StudentSidebar({
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
                className={`student-sidebar-overlay ${
                    isOpen ? "show" : ""
                }`}
                onClick={onClose}
                aria-hidden="true"
            />


            {/* SIDEBAR */}

            <aside
                className={`student-sidebar ${
                    isOpen ? "mobile-open" : ""
                }`}
            >

                {/* MOBILE CLOSE BUTTON */}

                <button
                    type="button"
                    className="student-sidebar-close"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X size={21} />
                </button>


                {/* BRAND */}

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


                {/* MENU LABEL */}

                <div className="student-menu-label">
                    MAIN MENU
                </div>


                {/* NAVIGATION */}

                <nav className="student-navigation">

                    {/* DASHBOARD */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/dashboard"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/dashboard"
                            )
                        }
                    >
                        <LayoutDashboard size={17} />

                        <span>
                            Dashboard
                        </span>
                    </button>


                    {/* RAISE COMPLAINT */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/complaints/new"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/complaints/new"
                            )
                        }
                    >
                        <PlusSquare size={17} />

                        <span>
                            Raise Complaint
                        </span>
                    </button>


                    {/* MY COMPLAINTS */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/complaints"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/complaints"
                            )
                        }
                    >
                        <ClipboardList size={17} />

                        <span>
                            My Complaints
                        </span>
                    </button>


                    {/* CAMPUS SERVICES */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/services"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/services"
                            )
                        }
                    >
                        <Building2 size={17} />

                        <span>
                            Campus Services
                        </span>
                    </button>


                    {/* PROFILE */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/profile"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/profile"
                            )
                        }
                    >
                        <UserRound size={17} />

                        <span>
                            Profile
                        </span>
                    </button>


                    {/* HELP */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/help"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/help"
                            )
                        }
                    >
                        <CircleHelp size={17} />

                        <span>
                            Help & Support
                        </span>
                    </button>

                </nav>


                {/* BOTTOM */}

                <div className="student-sidebar-bottom">

                    {/* SETTINGS */}

                    <button
                        type="button"
                        className={`student-nav-item ${
                            isActive(
                                "/student/settings"
                            )
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/student/settings"
                            )
                        }
                    >
                        <Settings size={17} />

                        <span>
                            Settings
                        </span>
                    </button>


                    {/* LOGOUT */}

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

        </>
    );
}

export default StudentSidebar;