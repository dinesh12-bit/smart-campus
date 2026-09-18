import {
    ChevronDown,
    Menu,
    UserRound,
    Settings,
    LogOut,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import "../styles/topbar.css";


function getPageTitle(pathname) {

    if (
        pathname === "/admin" ||
        pathname === "/admin/"
    ) {
        return "Dashboard";
    }

    if (pathname.startsWith("/admin/rooms")) {
        return "Rooms";
    }

    if (
        pathname.startsWith(
            "/admin/live-monitoring"
        )
    ) {
        return "Live Monitoring";
    }

    if (pathname.startsWith("/admin/sensors")) {
        return "Sensors";
    }

    if (
        pathname.startsWith("/admin/complaints")
    ) {
        return "Complaints";
    }

    if (
        pathname.startsWith("/admin/ai-insights")
    ) {
        return "AI Insights";
    }

    if (
        pathname.startsWith("/admin/predictions")
    ) {
        return "Predictions";
    }

    if (
        pathname.startsWith("/admin/analytics")
    ) {
        return "Analytics";
    }

    if (pathname.startsWith("/admin/users")) {
        return "Users";
    }

    if (pathname.startsWith("/admin/reports")) {
        return "Reports";
    }

    if (
        pathname.startsWith("/admin/settings")
    ) {
        return "Settings";
    }

    if (
        pathname.startsWith("/admin/profile")
    ) {
        return "Profile";
    }

    return "Dashboard";
}


function Topbar({
                    onMenuClick = () => {},
                }) {

    const location = useLocation();
    const navigate = useNavigate();

    const [
        dropdownOpen,
        setDropdownOpen,
    ] = useState(false);

    const dropdownRef = useRef(null);


    const storage =
        sessionStorage.getItem("token")
            ? sessionStorage
            : localStorage;


    const adminName =
        storage.getItem("name") ||
        "System Admin";


    const adminEmail =
        storage.getItem("email") ||
        "admin@smartcampus.com";


    const pageTitle =
        getPageTitle(
            location.pathname
        );


    const adminInitial =
        adminName
            .trim()
            .charAt(0)
            .toUpperCase() || "A";


    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setDropdownOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };

    }, []);


    const handleProfile = () => {

        setDropdownOpen(false);

        navigate("/admin/profile");
    };


    const handleSettings = () => {

        setDropdownOpen(false);

        navigate("/admin/settings");
    };


    const handleLogout = () => {

        setDropdownOpen(false);

        sessionStorage.clear();
        localStorage.clear();

        navigate("/login", {
            replace: true,
        });
    };


    return (
        <div className="topbar">

            {/* LEFT */}

            <div className="topbar-left">

                <button
                    type="button"
                    className="topbar-menu"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                >
                    <Menu
                        size={19}
                        strokeWidth={2}
                    />
                </button>


                <h1>
                    {pageTitle}
                </h1>

            </div>


            {/* RIGHT */}

            <div className="topbar-right">

                <div
                    className="topbar-user-wrapper"
                    ref={dropdownRef}
                >

                    <button
                        type="button"
                        className={`topbar-user ${
                            dropdownOpen
                                ? "dropdown-open"
                                : ""
                        }`}
                        onClick={() =>
                            setDropdownOpen(
                                previous =>
                                    !previous
                            )
                        }
                        aria-expanded={
                            dropdownOpen
                        }
                    >

                        <div className="user-avatar">
                            {adminInitial}
                        </div>


                        <div className="user-details">

                            <strong>
                                {adminName}
                            </strong>

                            <span>
                                Super Admin
                            </span>

                        </div>


                        <ChevronDown
                            size={17}
                            className={`user-chevron ${
                                dropdownOpen
                                    ? "rotate"
                                    : ""
                            }`}
                        />

                    </button>


                    {dropdownOpen && (

                        <div className="topbar-dropdown">

                            <div className="dropdown-user-info">

                                <div className="dropdown-avatar">
                                    {adminInitial}
                                </div>

                                <div>

                                    <strong>
                                        {adminName}
                                    </strong>

                                    <span>
                                        {adminEmail}
                                    </span>

                                </div>

                            </div>


                            <div className="dropdown-divider" />


                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={
                                    handleProfile
                                }
                            >
                                <span className="dropdown-item-icon profile-icon">
                                    <UserRound
                                        size={16}
                                    />
                                </span>

                                <span>
                                    Profile
                                </span>
                            </button>


                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={
                                    handleSettings
                                }
                            >
                                <span className="dropdown-item-icon settings-icon">
                                    <Settings
                                        size={16}
                                    />
                                </span>

                                <span>
                                    Settings
                                </span>
                            </button>


                            <div className="dropdown-divider" />


                            <button
                                type="button"
                                className="dropdown-item logout-item"
                                onClick={
                                    handleLogout
                                }
                            >
                                <span className="dropdown-item-icon logout-icon">
                                    <LogOut
                                        size={16}
                                    />
                                </span>

                                <span>
                                    Logout
                                </span>
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Topbar;