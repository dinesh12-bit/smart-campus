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


    const fetchSensorData = async () => {

        try {

            const sensorResponse =
                await api.get(
                    "/api/sensor/readings"
                );

            const readings = Array.isArray(
                sensorResponse.data
            )
                ? sensorResponse.data
                : [];

            if (readings.length === 0) {
                setSensorReading(null);
                return;
            }

            const room204Readings =
                readings.filter(
                    (reading) =>
                        reading.roomCode === "ROOM-204"
                );

            const availableReadings =
                room204Readings.length > 0
                    ? room204Readings
                    : readings;

            const latestReading = [
                ...availableReadings,
            ].sort(
                (a, b) =>
                    new Date(b.recordedAt) -
                    new Date(a.recordedAt)
            )[0];

            setSensorReading(
                latestReading || null
            );

        } catch (err) {

            console.error(
                "Sensor refresh error:",
                err
            );

        }
    };


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

            const [
                studentResponse,
                complaintsResponse,
                sensorResponse,
            ] = await Promise.all([
                api.get("/api/auth/me"),
                api.get("/api/complaints"),
                api.get("/api/sensor/readings"),
            ]);

            const currentStudent =
                studentResponse.data;

            setStudent(currentStudent);

            const studentId =
                currentStudent?.id;

            const allComplaints =
                Array.isArray(
                    complaintsResponse.data
                )
                    ? complaintsResponse.data
                    : [];

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

            const readings =
                Array.isArray(
                    sensorResponse.data
                )
                    ? sensorResponse.data
                    : [];

            if (readings.length > 0) {

                const room204Readings =
                    readings.filter(
                        (reading) =>
                            reading.roomCode ===
                            "ROOM-204"
                    );

                const availableReadings =
                    room204Readings.length > 0
                        ? room204Readings
                        : readings;

                const latestReading = [
                    ...availableReadings,
                ].sort(
                    (a, b) =>
                        new Date(b.recordedAt) -
                        new Date(a.recordedAt)
                )[0];

                setSensorReading(
                    latestReading || null
                );

            } else {

                setSensorReading(null);

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


    useEffect(() => {

        loadDashboard();

    }, []);


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
            clearInterval(intervalId);
        };

    }, []);


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


    const studentName =
        student?.name ||
        sessionStorage.getItem("name") ||
        localStorage.getItem("name") ||
        "Student";


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


    const goTo = (path) => {
        window.location.href = path;
    };


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


    return (
        <div className="student-dashboard">

            {/* Welcome Header */}

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


            {/* Backend Error */}

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


            {/* Complaint Statistics */}

            <section className="student-stat-grid">

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


            {/* Quick Actions */}

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


                    <button
                        type="button"
                        className="student-action-card"
                        onClick={() =>
                            goTo("/student/help")
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


            {/* Campus Overview */}

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