import { useState } from "react";

import {
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    Menu,
} from "lucide-react";

import TechnicianSidebar from "../components/technicianSidebar";

import "../styles/technicianLayout.css";


function TechnicianLayout() {

    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isDashboard =
        location.pathname === "/technician/dashboard";


    const storage =
        sessionStorage.getItem("token")
            ? sessionStorage
            : localStorage;


    const technicianName =
        storage.getItem("name") ||
        storage.getItem("username") ||
        "Technician";


    const technicianInitial =
        technicianName
            .trim()
            .charAt(0)
            .toUpperCase() || "T";


    return (
        <div className="technician-layout">

            <TechnicianSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />


            <button
                type="button"
                className="technician-mobile-menu"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={21} />
            </button>


            <div className="technician-main">

                {isDashboard && (
                    <header className="technician-topbar">

                        <div className="technician-topbar-spacer"></div>

                        <div className="technician-topbar-user">

                            <div className="technician-topbar-avatar">
                                {technicianInitial}
                            </div>

                            <div className="technician-topbar-details">

                                <strong>
                                    {technicianName}
                                </strong>

                                <span>
                                    Technician
                                </span>

                            </div>

                        </div>

                    </header>
                )}


                <main
                    className={`technician-page ${
                        !isDashboard
                            ? "technician-page-no-topbar"
                            : ""
                    }`}
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default TechnicianLayout;