import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";
import StudentLayout from "./layouts/StudentLayout";

import Dashboard from "./pages/admin/Dashboard";
import Rooms from "./pages/admin/Rooms";
import LiveMonitoring from "./pages/admin/LiveMonitoring";
import Sensors from "./pages/admin/Sensors";
import Complaints from "./pages/admin/Complaints";
import AIInsights from "./pages/admin/AIInsights";
import Predictions from "./pages/admin/Predictions";
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";

import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import MyTasks from "./pages/technician/MyTasks";
import TechnicianComplaints from "./pages/technician/Complaints";
import TechnicianProfile from "./pages/technician/TechnicianProfile.jsx";
import TechnicianSettings from "./pages/technician/Settings";

import StudentDashboard from "./pages/student/Dashboard";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import CampusServices from "./pages/student/CampusServices";
import StudentProfile from "./pages/student/Profile";
import HelpSupport from "./pages/student/HelpSupport";
import StudentSettings from "./pages/student/Settings";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


function App() {

    return (

        <Routes>

            {/* AUTH */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ROOT */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* ADMIN PANEL */}

            <Route
                path="/admin"
                element={<AdminLayout />}
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="rooms"
                    element={<Rooms />}
                />

                <Route
                    path="live-monitoring"
                    element={<LiveMonitoring />}
                />

                <Route
                    path="sensors"
                    element={<Sensors />}
                />

                <Route
                    path="complaints"
                    element={<Complaints />}
                />

                <Route
                    path="ai-insights"
                    element={<AIInsights />}
                />

                <Route
                    path="predictions"
                    element={<Predictions />}
                />

                <Route
                    path="analytics"
                    element={<Analytics />}
                />

                <Route
                    path="users"
                    element={<Users />}
                />

                <Route
                    path="reports"
                    element={<Reports />}
                />

                <Route
                    path="profile"
                    element={<Profile />}
                />

                <Route
                    path="settings"
                    element={<AdminSettings />}
                />

            </Route>


            {/* TECHNICIAN PANEL */}

            <Route
                path="/technician"
                element={<TechnicianLayout />}
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<TechnicianDashboard />}
                />

                <Route
                    path="tasks"
                    element={<MyTasks />}
                />

                <Route
                    path="complaints"
                    element={<TechnicianComplaints />}
                />

                <Route
                    path="profile"
                    element={<TechnicianProfile />}
                />

                <Route
                    path="settings"
                    element={<TechnicianSettings />}
                />

            </Route>


            {/* STUDENT PANEL */}

            <Route
                path="/student"
                element={<StudentLayout />}
            >

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="complaints/new"
                    element={<RaiseComplaint />}
                />

                <Route
                    path="complaints"
                    element={<MyComplaints />}
                />

                <Route
                    path="services"
                    element={<CampusServices />}
                />

                <Route
                    path="profile"
                    element={<StudentProfile />}
                />

                <Route
                    path="help"
                    element={<HelpSupport />}
                />

                <Route
                    path="settings"
                    element={<StudentSettings />}
                />

            </Route>


            {/* UNKNOWN ROUTE */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default App;