import { Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/studentLayout.css";

function StudentLayout() {
    const location = useLocation();

    const isDashboard =
        location.pathname === "/student/dashboard";

    const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;

    const studentName =
        storage.getItem("name") || "Student";

    const studentInitial =
        studentName.trim().charAt(0).toUpperCase() || "S";

    return (
        <div className="student-layout">

            <StudentSidebar />

            <div className="student-main">

                {isDashboard && (
                    <header className="student-topbar">

                        <div className="student-topbar-spacer"></div>

                        <div className="student-topbar-user">

                            <div className="student-topbar-avatar">
                                {studentInitial}
                            </div>

                            <div className="student-topbar-details">

                                <strong>
                                    {studentName}
                                </strong>

                                <span>
                                    Student
                                </span>

                            </div>

                        </div>

                    </header>
                )}

                <main
                    className={`student-page ${
                        !isDashboard
                            ? "student-page-no-topbar"
                            : ""
                    }`}
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default StudentLayout;