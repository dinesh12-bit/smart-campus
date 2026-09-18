import {
    NavLink,
    useLocation,
} from "react-router-dom";

import {
    LayoutDashboard,
    DoorOpen,
    Activity,
    Cpu,
    MessageSquareWarning,
    BrainCircuit,
    TrendingUp,
    BarChart3,
    Users,
    FileText,
    X,
} from "lucide-react";

import "../styles/sidebar.css";
import logo from "../assets/images/smart-campus-logo.png";


function Sidebar({
                     isOpen = false,
                     onClose = () => {},
                 }) {

    const location = useLocation();


    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Rooms",
            path: "/admin/rooms",
            icon: DoorOpen,
        },
        {
            name: "Live Monitoring",
            path: "/admin/live-monitoring",
            icon: Activity,
        },
        {
            name: "Sensors",
            path: "/admin/sensors",
            icon: Cpu,
        },
        {
            name: "Complaints",
            path: "/admin/complaints",
            icon: MessageSquareWarning,
        },
        {
            name: "AI Insights",
            path: "/admin/ai-insights",
            icon: BrainCircuit,
        },
        {
            name: "Predictions",
            path: "/admin/predictions",
            icon: TrendingUp,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: FileText,
        },
    ];


    return (
        <>

            {/* MOBILE OVERLAY */}

            <div
                className={`sidebar-overlay ${
                    isOpen ? "show" : ""
                }`}
                onClick={onClose}
            />


            {/* SIDEBAR */}

            <aside
                className={`admin-sidebar ${
                    isOpen ? "sidebar-open" : ""
                }`}
            >

                {/* MOBILE CLOSE */}

                <button
                    type="button"
                    className="sidebar-close"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X size={21} />
                </button>


                {/* BRAND */}

                <div className="sidebar-brand">

                    <div className="brand-logo">

                        <img
                            src={logo}
                            alt="Smart Campus"
                        />

                    </div>


                    <div className="brand-text">

                        <h2>
                            SMART CAMPUS
                        </h2>

                        <p>
                            AI + IoT Intelligence System
                        </p>

                    </div>

                </div>


                {/* MAIN MENU */}

                <nav className="sidebar-navigation">

                    <div className="sidebar-section-title">
                        MAIN MENU
                    </div>


                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            location.pathname ===
                            item.path;


                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`}
                                onClick={onClose}
                            >

                                <Icon
                                    size={18}
                                    strokeWidth={1.8}
                                />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>

            </aside>

        </>
    );
}

export default Sidebar;