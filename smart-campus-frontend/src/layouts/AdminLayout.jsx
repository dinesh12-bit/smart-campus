import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "../styles/layout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <Sidebar />

            {/* RIGHT SIDE */}
            <div className="admin-main">

                {/* TOPBAR */}
                <header className="admin-topbar">
                    <Topbar />
                </header>

                {/* PAGE */}
                <main className="admin-page">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;