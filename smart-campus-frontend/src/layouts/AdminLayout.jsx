import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "../styles/layout.css";


function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    return (
        <div className="admin-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <div className="admin-main">

                <header className="admin-topbar">

                    <Topbar
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                    />

                </header>

                <main className="admin-page">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;