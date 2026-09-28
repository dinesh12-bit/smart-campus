import { useEffect, useState } from "react";
import {
    ClipboardList,
    CheckCircle2,
    Clock3,
    CircleAlert,
    Plus,
    ArrowRight,
    Lightbulb,
    Thermometer,
    Droplets,
    Activity,
    RefreshCw,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/studentDashboard.css";

function Dashboard() {

    const [student, setStudent] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [sensorReading, setSensorReading] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // STUDENT SETTINGS
    // =========================================================

    const getStudentSettings = () => {
        try {
            const savedSettings =
                localStorage.getItem("studentSettings");

            if (!savedSettings) {
                return {
                    autoRefresh: true,
                    refreshInterval: 10,
                };
            }

            const settings = JSON.parse(savedSettings);

            return {
                autoRefresh:
                    settings.autoRefresh !== false,

                refreshInterval:
                    Number(settings.refreshInterval) > 0
                        ? Number(settings.refreshInterval)
                        : 10,
            };

        } catch (err) {

            console.error(
                "Student settings error:",
                err
            );

            return {
                autoRefresh: true,
                refreshInterval: 10,
            };
        }
    };


    // =========================================================
    // FETCH LATEST SENSOR DATA
    // =========================================================

    const fetchSensorData = async () => {

        try {

            const response =
                await api.get(
                    "/api/sensor/readings/room/ROOM-204/latest"
                );

            const readings =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            if (readings.length > 0) {

                // Backend latest endpoint returns latest
                // ROOM-204 reading first.
                setSensorReading(
                    readings[0]
                );

            } else {

                setSensorReading(null);

            }

        } catch (err) {

            console.error(
                "Sensor refresh error:",
                err
            );

            // Sensor failure should NOT destroy
            // the complete dashboard.
        }
    };


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    const loadDashboard = async (
        isRefresh = false
    ) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            // -------------------------------------------------
            // Load student + complaints independently
            // -------------------------------------------------

            const [
                studentResult,
                complaintsResult,
            ] = await Promise.allSettled([
                api.get("/api/auth/me"),
                api.get("/api/complaints"),
            ]);


            // -------------------------------------------------
            // STUDENT
            // -------------------------------------------------

            if (
                studentResult.status === "fulfilled"
            ) {

                const currentStudent =
                    studentResult.value.data;

                setStudent(currentStudent);

            } else {

                console.error(
                    "Student API error:",
                    studentResult.reason
                );

            }


            // -------------------------------------------------
            // COMPLAINTS
            // -------------------------------------------------

            if (
                complaintsResult.status === "fulfilled"
            ) {

                const allComplaints =
                    Array.isArray(
                        complaintsResult.value.data
                    )
                        ? complaintsResult.value.data
                        : [];

                const currentStudent =
                    studentResult.status === "fulfilled"
                        ? studentResult.value.data
                        : student;

                const studentId =
                    currentStudent?.id;

                const studentComplaints =
                    allComplaints.filter(
                        (complaint) =>
                            Number(
                                complaint.studentId
                            ) === Number(studentId)
                    );

                setComplaints(
                    studentComplaints
                );

            } else {

                console.error(
                    "Complaints API error:",
                    complaintsResult.reason
                );

            }


            // -------------------------------------------------
            // SENSOR
            // -------------------------------------------------

            await fetchSensorData();


            // -------------------------------------------------
            // ERROR MESSAGE
            // -------------------------------------------------

            const studentFailed =
                studentResult.status === "rejected";

            const complaintsFailed =
                complaintsResult.status === "rejected";

            if (
                studentFailed &&
                complaintsFailed
            ) {

                setError(
                    "Unable to load dashboard data from server."
                );

            } else if (studentFailed) {

                setError(
                    "Unable to load student information."
                );

            } else if (complaintsFailed) {

                setError(
                    "Unable to load complaint data."
                );

            } else {

                setError("");

            }

        } catch (err) {

            console.error(
                "Student dashboard error:",
                err
            );

            setError(
                "Unable to load dashboard data from server."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =========================================================
    // AUTO REFRESH SENSOR DATA
    // =========================================================

    useEffect(() => {

        const settings =
            getStudentSettings();

        if (!settings.autoRefresh) {
            return;
        }

        const intervalMilliseconds =
            settings.refreshInterval * 1000;

        const intervalId =
            setInterval(() => {

                fetchSensorData();

            }, intervalMilliseconds);

        return () => {

            clearInterval(
                intervalId
            );

        };

    }, []);


    // =========================================================
    // COMPLAINT STATISTICS
    // =========================================================

    const totalComplaints =
        complaints.length;


    const resolvedComplaints =
        complaints.filter(
            (complaint) =>
                complaint.status === "RESOLVED"
        ).length;


    const inProgressComplaints =
        complaints.filter(
            (complaint) =>
                complaint.status === "IN_PROGRESS"
        ).length;


    const openComplaints =
        complaints.filter(
            (complaint) =>
                complaint.status === "PENDING" ||
                complaint.status === "ASSIGNED"
        ).length;


    // =========================================================
    // STUDENT NAME
    // =========================================================

    const studentName =
        student?.name ||
        sessionStorage.getItem("name") ||
        localStorage.getItem("name") ||
        "Student";


    // =========================================================
    // SENSOR VALUES
    // =========================================================

    const lightValue =
        sensorReading?.lightLevel != null
            ? `${sensorReading.lightLevel}`
            : "--";


    const temperatureValue =
        sensorReading?.temperature != null
            ? `${Number(
                sensorReading.temperature
            ).toFixed(1)}°C`
            : "--";


    const humidityValue =
        sensorReading?.humidity != null
            ? `${Number(
                sensorReading.humidity
            ).toFixed(1)}%`
            : "--";


    const motionValue =
        sensorReading?.motionDetected != null
            ? sensorReading.motionDetected
                ? "Detected"
                : "No Motion"
            : "--";


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goTo = (path) => {
        window.location.href = path;
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="student-dashboard-loading">

                <div className="student-loader"></div>

                <span>
                    Loading dashboard...
                </span>

            </div>
        );

    }


    // =========================================================
    // DASHBOARD UI
    // =========================================================

    return (
        <div className="student-dashboard">

            {/* =================================================
                WELCOME HEADER
            ================================================= */}

            <div className="student-dashboard-header">

                <div>

                    <h2>
                        Welcome back, {studentName}! 👋
                    </h2>

                    <p>
                        Here's what's happening in your
                        campus today.
                    </p>

                </div>


                <button
                    type="button"
                    className="student-refresh-btn"
                    onClick={() =>
                        loadDashboard(true)
                    }
                    disabled={refreshing}
                >

                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "student-spin"
                                : ""
                        }
                    />

                    <span>
                        Refresh
                    </span>

                </button>

            </div>


            {/* =================================================
                BACKEND ERROR
            ================================================= */}

            {error && (

                <div className="student-server-error">

                    <div>

                        <strong>
                            Unable to load data
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard(true)
                        }
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================================
                COMPLAINT STATISTICS
            ================================================= */}

            <section className="student-stat-grid">

                {/* TOTAL */}

                <div className="student-stat-card">

                    <div className="student-stat-icon complaints">

                        <ClipboardList size={19} />

                    </div>

                    <div>

                        <span>
                            Total Complaints
                        </span>

                        <strong>
                            {totalComplaints}
                        </strong>

                    </div>

                </div>


                {/* RESOLVED */}

                <div className="student-stat-card">

                    <div className="student-stat-icon resolved">

                        <CheckCircle2 size={19} />

                    </div>

                    <div>

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {resolvedComplaints}
                        </strong>

                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="student-stat-card">

                    <div className="student-stat-icon progress">

                        <Clock3 size={19} />

                    </div>

                    <div>

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {inProgressComplaints}
                        </strong>

                    </div>

                </div>


                {/* OPEN */}

                <div className="student-stat-card">

                    <div className="student-stat-icon open">

                        <CircleAlert size={19} />

                    </div>

                    <div>

                        <span>
                            Open
                        </span>

                        <strong>
                            {openComplaints}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="student-section">

                <div className="student-section-heading">

                    <div>

                        <h3>
                            Quick Actions
                        </h3>

                        <p>
                            Quickly access common student
                            actions.
                        </p>

                    </div>

                </div>


                <div className="student-action-grid">

                    {/* RAISE COMPLAINT */}

                    <button
                        type="button"
                        className="student-action-card"
                        onClick={() =>
                            goTo(
                                "/student/complaints/new"
                            )
                        }
                    >

                        <div className="student-action-icon purple">

                            <Plus size={19} />

                        </div>

                        <div>

                            <strong>
                                Raise Complaint
                            </strong>

                            <span>
                                Report a new issue
                            </span>

                        </div>

                        <ArrowRight size={16} />

                    </button>


                    {/* MY COMPLAINTS */}

                    <button
                        type="button"
                        className="student-action-card"
                        onClick={() =>
                            goTo(
                                "/student/complaints"
                            )
                        }
                    >

                        <div className="student-action-icon green">

                            <ClipboardList size={19} />

                        </div>

                        <div>

                            <strong>
                                My Complaints
                            </strong>

                            <span>
                                Track your complaints
                            </span>

                        </div>

                        <ArrowRight size={16} />

                    </button>


                    {/* SUPPORT */}

                    <button
                        type="button"
                        className="student-action-card"
                        onClick={() =>
                            goTo(
                                "/student/help"
                            )
                        }
                    >

                        <div className="student-action-icon orange">

                            <CircleAlert size={19} />

                        </div>

                        <div>

                            <strong>
                                Contact Support
                            </strong>

                            <span>
                                Get help and support
                            </span>

                        </div>

                        <ArrowRight size={16} />

                    </button>

                </div>

            </section>


            {/* =================================================
                CAMPUS OVERVIEW
            ================================================= */}

            <section className="student-section">

                <div className="student-section-heading">

                    <div>

                        <h3>
                            Campus Overview
                        </h3>

                        <p>
                            Latest available IoT sensor
                            readings.
                        </p>

                    </div>


                    {sensorReading?.roomCode && (

                        <span className="student-room-badge">

                            {sensorReading.roomCode}

                        </span>

                    )}

                </div>


                <div className="student-overview-grid">

                    {/* LIGHT */}

                    <div className="student-overview-card light">

                        <div className="student-overview-icon">

                            <Lightbulb size={20} />

                        </div>

                        <div>

                            <span>
                                Light
                            </span>

                            <strong>
                                {lightValue}
                            </strong>

                        </div>

                    </div>


                    {/* TEMPERATURE */}

                    <div className="student-overview-card temperature">

                        <div className="student-overview-icon">

                            <Thermometer size={20} />

                        </div>

                        <div>

                            <span>
                                Temperature
                            </span>

                            <strong>
                                {temperatureValue}
                            </strong>

                        </div>

                    </div>


                    {/* HUMIDITY */}

                    <div className="student-overview-card humidity">

                        <div className="student-overview-icon">

                            <Droplets size={20} />

                        </div>

                        <div>

                            <span>
                                Humidity
                            </span>

                            <strong>
                                {humidityValue}
                            </strong>

                        </div>

                    </div>


                    {/* MOTION */}

                    <div className="student-overview-card motion">

                        <div className="student-overview-icon">

                            <Activity size={20} />

                        </div>

                        <div>

                            <span>
                                Motion
                            </span>

                            <strong>
                                {motionValue}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;