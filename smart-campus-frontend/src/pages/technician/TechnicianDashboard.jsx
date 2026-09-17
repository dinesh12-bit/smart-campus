import { useEffect, useState } from "react";

import {
    ClipboardList,
    UserCheck,
    Clock3,
    CheckCircle2,
    RefreshCw,
    ArrowRight,
    Lightbulb,
    Thermometer,
    Droplets,
    Activity,
    AlertCircle,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

import "../../styles/technicianDashboard.css";


function TechnicianDashboard() {

    const navigate = useNavigate();


    const [complaints, setComplaints] =
        useState([]);

    const [technician, setTechnician] =
        useState(null);

    const [sensorReading, setSensorReading] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                meResponse,
                complaintsResponse,
                sensorResponse,
            ] = await Promise.all([
                api.get("/api/auth/me"),
                api.get("/api/complaints"),
                api.get("/api/sensor/readings"),
            ]);


            const me =
                meResponse.data;


            const allComplaints =
                Array.isArray(
                    complaintsResponse.data
                )
                    ? complaintsResponse.data
                    : [];


            const allReadings =
                Array.isArray(
                    sensorResponse.data
                )
                    ? sensorResponse.data
                    : [];


            const technicianId =
                me?.id ??
                me?.userId;


            const assignedComplaints =
                allComplaints.filter(
                    (complaint) =>
                        Number(
                            complaint.technicianId
                        ) ===
                        Number(
                            technicianId
                        )
                );


            assignedComplaints.sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            );


            /*
             * ROOM-204 is the actual IoT room.
             * Prefer its latest reading.
             */

            const room204Readings =
                allReadings.filter(
                    (reading) =>
                        String(
                            reading.roomCode ||
                            reading.roomId ||
                            ""
                        ).toUpperCase() ===
                        "ROOM-204"
                );


            let latestReading = null;


            if (
                room204Readings.length >
                0
            ) {

                latestReading =
                    room204Readings.reduce(
                        (latest, current) => {

                            if (!latest) {
                                return current;
                            }

                            return new Date(
                                current.recordedAt ||
                                0
                            ) >
                            new Date(
                                latest.recordedAt ||
                                0
                            )
                                ? current
                                : latest;
                        },
                        null
                    );

            } else if (
                allReadings.length > 0
            ) {

                latestReading =
                    allReadings.reduce(
                        (latest, current) => {

                            if (!latest) {
                                return current;
                            }

                            return new Date(
                                current.recordedAt ||
                                0
                            ) >
                            new Date(
                                latest.recordedAt ||
                                0
                            )
                                ? current
                                : latest;
                        },
                        null
                    );

            }


            setTechnician(me);

            setComplaints(
                assignedComplaints
            );

            setSensorReading(
                latestReading
            );

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load dashboard data from server."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    /* =========================
       COMPLAINT COUNTS
    ========================= */

    const totalTasks =
        complaints.length;


    const assignedCount =
        complaints.filter(
            (item) =>
                item.status ===
                "ASSIGNED"
        ).length;


    const progressCount =
        complaints.filter(
            (item) =>
                item.status ===
                "IN_PROGRESS"
        ).length;


    const resolvedCount =
        complaints.filter(
            (item) =>
                item.status ===
                "RESOLVED"
        ).length;


    /* =========================
       SENSOR VALUES
    ========================= */

    const lightValue =
        sensorReading?.lightLevel ??
        null;


    const temperatureValue =
        sensorReading?.temperature ??
        null;


    const humidityValue =
        sensorReading?.humidity ??
        null;


    const motionValue =
        sensorReading?.motionDetected;


    const formatNumber = (
        value,
        suffix = ""
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "--";
        }

        const number =
            Number(value);

        if (
            Number.isNaN(number)
        ) {
            return `${value}${suffix}`;
        }

        return `${number.toFixed(1)}${suffix}`;
    };


    const getMotionText = () => {

        if (
            motionValue ===
            null ||
            motionValue ===
            undefined
        ) {
            return "--";
        }

        if (
            motionValue === true ||
            motionValue === "true" ||
            motionValue === 1 ||
            motionValue === "1"
        ) {
            return "Motion Detected";
        }

        return "No Motion";
    };


    const getStatusLabel = (
        status
    ) => {

        const map = {
            PENDING: "Open",
            ASSIGNED: "Assigned",
            IN_PROGRESS: "In Progress",
            RESOLVED: "Resolved",
        };

        return (
            map[status] ||
            status ||
            "-"
        );

    };


    const getStatusClass = (
        status
    ) => {

        if (
            status ===
            "RESOLVED"
        ) {
            return "resolved";
        }

        if (
            status ===
            "IN_PROGRESS"
        ) {
            return "progress";
        }

        if (
            status ===
            "ASSIGNED"
        ) {
            return "assigned";
        }

        return "open";

    };


    if (loading) {

        return (
            <div className="technician-dashboard-page">

                <div className="technician-dashboard-loader">

                    <div className="technician-loader-circle">
                        <RefreshCw
                            size={22}
                        />
                    </div>

                    <span>
                        Loading dashboard...
                    </span>

                </div>

            </div>
        );

    }


    return (
        <div className="technician-dashboard-page">


            {/* =========================
                WELCOME HEADER
            ========================= */}

            <div className="technician-dashboard-header">

                <div>

                    <h1>
                        Welcome back,{" "}
                        {
                            technician?.name ||
                            technician?.username ||
                            "Technician"
                        }! 👋
                    </h1>

                    <p>
                        Here's what's happening
                        with your assigned tasks
                        today.
                    </p>

                </div>


                <button
                    type="button"
                    className="technician-refresh-button"
                    onClick={
                        loadDashboard
                    }
                >

                    <RefreshCw
                        size={15}
                    />

                    Refresh

                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="technician-dashboard-error">

                    <div className="technician-error-icon">
                        <AlertCircle
                            size={17}
                        />
                    </div>

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
                        onClick={
                            loadDashboard
                        }
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="technician-stat-grid">


                <div className="technician-stat-card">

                    <div className="technician-stat-icon blue">
                        <ClipboardList
                            size={21}
                        />
                    </div>

                    <div className="technician-stat-content">

                        <span>
                            Total Tasks
                        </span>

                        <strong>
                            {totalTasks}
                        </strong>

                    </div>

                </div>


                <div className="technician-stat-card">

                    <div className="technician-stat-icon orange">
                        <UserCheck
                            size={21}
                        />
                    </div>

                    <div className="technician-stat-content">

                        <span>
                            Assigned
                        </span>

                        <strong>
                            {assignedCount}
                        </strong>

                    </div>

                </div>


                <div className="technician-stat-card">

                    <div className="technician-stat-icon purple">
                        <Clock3
                            size={21}
                        />
                    </div>

                    <div className="technician-stat-content">

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {progressCount}
                        </strong>

                    </div>

                </div>


                <div className="technician-stat-card">

                    <div className="technician-stat-icon green">
                        <CheckCircle2
                            size={21}
                        />
                    </div>

                    <div className="technician-stat-content">

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {resolvedCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <div className="technician-quick-section">

                <div className="technician-section-heading">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Quickly access common
                            technician actions.
                        </p>

                    </div>

                </div>


                <div className="technician-action-grid">


                    <button
                        type="button"
                        className="technician-action-card"
                        onClick={() =>
                            navigate(
                                "/technician/tasks"
                            )
                        }
                    >

                        <div className="technician-action-icon purple">
                            <ClipboardList
                                size={20}
                            />
                        </div>

                        <div className="technician-action-content">

                            <strong>
                                My Tasks
                            </strong>

                            <span>
                                View assigned tasks
                            </span>

                        </div>

                        <ArrowRight
                            size={16}
                            className="technician-action-arrow"
                        />

                    </button>


                    <button
                        type="button"
                        className="technician-action-card"
                        onClick={() =>
                            navigate(
                                "/technician/complaints"
                            )
                        }
                    >

                        <div className="technician-action-icon green">
                            <CheckCircle2
                                size={20}
                            />
                        </div>

                        <div className="technician-action-content">

                            <strong>
                                Complaints
                            </strong>

                            <span>
                                Manage complaints
                            </span>

                        </div>

                        <ArrowRight
                            size={16}
                            className="technician-action-arrow"
                        />

                    </button>


                    <button
                        type="button"
                        className="technician-action-card"
                        onClick={() =>
                            navigate(
                                "/technician/profile"
                            )
                        }
                    >

                        <div className="technician-action-icon blue">
                            <UserCheck
                                size={20}
                            />
                        </div>

                        <div className="technician-action-content">

                            <strong>
                                My Profile
                            </strong>

                            <span>
                                View your profile
                            </span>

                        </div>

                        <ArrowRight
                            size={16}
                            className="technician-action-arrow"
                        />

                    </button>


                </div>

            </div>


            {/* =========================
                CAMPUS OVERVIEW
            ========================= */}

            <div className="technician-overview-section">


                <div className="technician-section-heading">

                    <div>

                        <h2>
                            Campus Overview
                        </h2>

                        <p>
                            Latest available IoT
                            sensor readings.
                        </p>

                    </div>


                    <span className="technician-room-badge">
                        ROOM-204
                    </span>

                </div>


                <div className="technician-overview-grid">


                    {/* LIGHT */}

                    <div className="technician-overview-card">

                        <div className="technician-overview-icon light">

                            <Lightbulb
                                size={23}
                                strokeWidth={2.2}
                            />

                        </div>

                        <div className="technician-overview-content">

                            <span>
                                Light
                            </span>

                            <strong>
                                {
                                    lightValue ===
                                    null ||
                                    lightValue ===
                                    undefined
                                        ? "--"
                                        : lightValue
                                }
                            </strong>

                            <small>
                                Light Level
                            </small>

                        </div>

                    </div>


                    {/* TEMPERATURE */}

                    <div className="technician-overview-card">

                        <div className="technician-overview-icon temperature">

                            <Thermometer
                                size={23}
                                strokeWidth={2.2}
                            />

                        </div>

                        <div className="technician-overview-content">

                            <span>
                                Temperature
                            </span>

                            <strong>
                                {formatNumber(
                                    temperatureValue,
                                    " °C"
                                )}
                            </strong>

                            <small>
                                Current
                            </small>

                        </div>

                    </div>


                    {/* HUMIDITY */}

                    <div className="technician-overview-card">

                        <div className="technician-overview-icon humidity">

                            <Droplets
                                size={23}
                                strokeWidth={2.2}
                            />

                        </div>

                        <div className="technician-overview-content">

                            <span>
                                Humidity
                            </span>

                            <strong>
                                {formatNumber(
                                    humidityValue,
                                    "%"
                                )}
                            </strong>

                            <small>
                                Current
                            </small>

                        </div>

                    </div>


                    {/* MOTION */}

                    <div className="technician-overview-card">

                        <div className="technician-overview-icon motion">

                            <Activity
                                size={23}
                                strokeWidth={2.2}
                            />

                        </div>

                        <div className="technician-overview-content">

                            <span>
                                Motion
                            </span>

                            <strong className="motion-value">
                                {getMotionText()}
                            </strong>

                            <small>
                                PIR Sensor
                            </small>

                        </div>

                    </div>


                </div>

            </div>


            {/* =========================
                RECENT TASKS
            ========================= */}

            <div className="technician-dashboard-section">

                <div className="technician-section-heading">

                    <div>

                        <h2>
                            Recent Tasks
                        </h2>

                        <p>
                            Latest complaints assigned
                            to you.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/technician/tasks"
                            )
                        }
                    >
                        View All
                        <ArrowRight
                            size={14}
                        />
                    </button>

                </div>


                <div className="technician-dashboard-table-wrapper">

                    <table className="technician-dashboard-table">

                        <thead>

                        <tr>
                            <th>
                                ID
                            </th>

                            <th>
                                Complaint
                            </th>

                            <th>
                                Room
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Priority
                            </th>

                            <th>
                                Status
                            </th>
                        </tr>

                        </thead>


                        <tbody>

                        {complaints
                            .slice(0, 5)
                            .map(
                                (
                                    complaint
                                ) => (

                                    <tr
                                        key={
                                            complaint.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                complaint.id
                                            }
                                        </td>


                                        <td>

                                            <strong>
                                                {
                                                    complaint.subject ||
                                                    "Complaint"
                                                }
                                            </strong>

                                        </td>


                                        <td>

                                            {
                                                complaint.location ||
                                                complaint.roomCode ||
                                                "-"
                                            }

                                        </td>


                                        <td>
                                            {
                                                complaint.category ||
                                                "-"
                                            }
                                        </td>


                                        <td>

                                                <span
                                                    className={`technician-priority ${
                                                        (
                                                            complaint.priority ||
                                                            ""
                                                        ).toLowerCase()
                                                    }`}
                                                >
                                                    {
                                                        complaint.priority ||
                                                        "-"
                                                    }
                                                </span>

                                        </td>


                                        <td>

                                                <span
                                                    className={`technician-status ${getStatusClass(
                                                        complaint.status
                                                    )}`}
                                                >
                                                    {
                                                        getStatusLabel(
                                                            complaint.status
                                                        )
                                                    }
                                                </span>

                                        </td>

                                    </tr>

                                )
                            )}


                        {complaints.length ===
                            0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="technician-no-data"
                                    >
                                        No tasks assigned
                                        to you yet.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


        </div>
    );
}


export default TechnicianDashboard;