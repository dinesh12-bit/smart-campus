import { useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    Download,
    FileText,
    RefreshCw,
    Thermometer,
    Droplets,
    Lightbulb,
    Building2
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import api from "../../api/axios";

import "../../styles/reports.css";


function Reports() {

    const [rooms, setRooms] = useState([]);
    const [readings, setReadings] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedRoom, setSelectedRoom] =
        useState("ALL");


    // =========================
    // LOAD DATA
    // =========================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                roomsResponse,
                readingsResponse,
                complaintsResponse
            ] = await Promise.all([
                api.get("/api/rooms"),
                api.get("/api/sensor/readings"),
                api.get("/api/complaints")
            ]);


            setRooms(
                Array.isArray(roomsResponse.data)
                    ? roomsResponse.data
                    : []
            );


            setReadings(
                Array.isArray(readingsResponse.data)
                    ? readingsResponse.data
                    : []
            );


            setComplaints(
                Array.isArray(complaintsResponse.data)
                    ? complaintsResponse.data
                    : []
            );


        } catch (err) {

            console.error(
                "Failed to load reports:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (
                err.response?.status === 403
            ) {

                setError(
                    "You do not have permission to access reports."
                );

            } else {

                setError(
                    "Unable to load report data. Please check the backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // AUTO REFRESH
    // =========================

    useEffect(() => {

        loadData();

        const interval =
            setInterval(() => {

                loadData();

            }, 10000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // =========================
    // FILTER READINGS
    // =========================

    const filteredReadings =
        useMemo(() => {

            if (
                selectedRoom === "ALL"
            ) {

                return readings;

            }


            return readings.filter(
                (reading) =>
                    reading.roomCode ===
                    selectedRoom
            );

        }, [
            readings,
            selectedRoom
        ]);


    // =========================
    // LATEST READING PER ROOM
    // =========================

    const latestReadings =
        useMemo(() => {

            const latestMap = {};


            [...readings]
                .sort(
                    (a, b) =>
                        new Date(b.recordedAt) -
                        new Date(a.recordedAt)
                )
                .forEach((reading) => {

                    if (
                        reading.roomCode &&
                        !latestMap[
                            reading.roomCode
                            ]
                    ) {

                        latestMap[
                            reading.roomCode
                            ] = reading;

                    }

                });


            return latestMap;

        }, [readings]);


    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(() => {

            if (
                filteredReadings.length === 0
            ) {

                return {
                    averageTemperature: 0,
                    averageHumidity: 0,
                    averageLight: 0,
                    motionEvents: 0
                };

            }


            const temperatures =
                filteredReadings
                    .map((item) =>
                        Number(item.temperature)
                    )
                    .filter(Number.isFinite);


            const humidities =
                filteredReadings
                    .map((item) =>
                        Number(item.humidity)
                    )
                    .filter(Number.isFinite);


            const lights =
                filteredReadings
                    .map((item) =>
                        Number(item.lightLevel)
                    )
                    .filter(Number.isFinite);


            const motionEvents =
                filteredReadings.filter(
                    (item) =>
                        item.motionDetected === true ||
                        item.motionDetected === 1 ||
                        item.motionDetected === "1"
                ).length;


            const average =
                (values) =>
                    values.length
                        ? values.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) / values.length
                        : 0;


            return {

                averageTemperature:
                    average(temperatures),

                averageHumidity:
                    average(humidities),

                averageLight:
                    average(lights),

                motionEvents

            };

        }, [filteredReadings]);


    // =========================
    // MONITORING STATUS
    // =========================

    const monitoringSummary =
        useMemo(() => {

            let normal = 0;
            let warning = 0;
            let critical = 0;


            rooms.forEach((room) => {

                const reading =
                    latestReadings[
                        room.roomCode
                        ];


                if (!reading) {

                    return;

                }


                const temperature =
                    Number(
                        reading.temperature
                    );


                const humidity =
                    Number(
                        reading.humidity
                    );


                if (
                    temperature >= 35 ||
                    humidity >= 85
                ) {

                    critical++;

                } else if (
                    temperature >= 30 ||
                    humidity >= 75
                ) {

                    warning++;

                } else {

                    normal++;

                }

            });


            return {
                normal,
                warning,
                critical
            };

        }, [
            rooms,
            latestReadings
        ]);


    // =========================
    // ROOM REPORT
    // =========================

    const roomReport =
        useMemo(() => {

            return rooms.map((room) => {

                const reading =
                    latestReadings[
                        room.roomCode
                        ];


                if (!reading) {

                    return {

                        ...room,

                        temperature: null,
                        humidity: null,
                        lightLevel: null,
                        motion: false,
                        status: "No Data"

                    };

                }


                const temperature =
                    Number(
                        reading.temperature
                    );


                const humidity =
                    Number(
                        reading.humidity
                    );


                let status =
                    "Normal";


                if (
                    temperature >= 35 ||
                    humidity >= 85
                ) {

                    status =
                        "Critical";

                } else if (
                    temperature >= 30 ||
                    humidity >= 75
                ) {

                    status =
                        "Warning";

                }


                return {

                    ...room,

                    temperature,
                    humidity,

                    lightLevel:
                        Number(
                            reading.lightLevel
                        ),

                    motion:
                        reading.motionDetected === true ||
                        reading.motionDetected === 1 ||
                        reading.motionDetected === "1",

                    status

                };

            });

        }, [
            rooms,
            latestReadings
        ]);


    // =========================
    // CHART DATA
    // =========================

    const chartData =
        useMemo(() => {

            const sorted =
                [...filteredReadings]
                    .sort(
                        (a, b) =>
                            new Date(a.recordedAt) -
                            new Date(b.recordedAt)
                    )
                    .slice(-20);


            return sorted.map(
                (reading, index) => ({

                    time:
                        new Date(
                            reading.recordedAt
                        ).toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        ),

                    temperature:
                        Number(
                            reading.temperature
                        ),

                    humidity:
                        Number(
                            reading.humidity
                        ),

                    index

                })
            );

        }, [filteredReadings]);


    // =========================
    // COMPLAINT SUMMARY
    // =========================

    const complaintSummary =
        useMemo(() => {

            const total =
                complaints.length;


            let open = 0;
            let resolved = 0;


            complaints.forEach(
                (complaint) => {

                    const status =
                        String(
                            complaint.status ||
                            ""
                        ).toLowerCase();


                    if (
                        status.includes("resolved") ||
                        status.includes("closed")
                    ) {

                        resolved++;

                    } else {

                        open++;

                    }

                }
            );


            return {
                total,
                open,
                resolved
            };

        }, [complaints]);


    // =========================
    // SOURCE COUNTS
    // =========================

    const sourceSummary =
        useMemo(() => {

            let real = 0;
            let simulated = 0;
            let manual = 0;


            rooms.forEach((room) => {

                const source =
                    String(
                        room.dataSource ||
                        ""
                    ).toUpperCase();


                if (
                    source.includes("REAL") ||
                    source.includes("IOT")
                ) {

                    real++;

                } else if (
                    source.includes("SIMULATED") ||
                    source.includes("SIMULATION")
                ) {

                    simulated++;

                } else {

                    manual++;

                }

            });


            return {
                real,
                simulated,
                manual
            };

        }, [rooms]);


    // =========================
    // GENERATE REPORT
    // =========================

    const generateReport =
        () => {

            const generatedAt =
                new Date()
                    .toLocaleString();


            const lines = [

                "SMART CAMPUS RESOURCE & ENVIRONMENT MANAGEMENT SYSTEM",

                "",

                "ADMIN ENVIRONMENT REPORT",

                `Generated: ${generatedAt}`,

                "",

                "SUMMARY",

                `Total Rooms: ${rooms.length}`,

                `Total Sensor Readings: ${readings.length}`,

                `Total Complaints: ${complaints.length}`,

                `Average Temperature: ${summary.averageTemperature.toFixed(2)} °C`,

                `Average Humidity: ${summary.averageHumidity.toFixed(2)} %`,

                `Average Light Level: ${summary.averageLight.toFixed(2)}`,

                `Motion Events: ${summary.motionEvents}`,

                "",

                "MONITORING STATUS",

                `Normal Rooms: ${monitoringSummary.normal}`,

                `Warning Rooms: ${monitoringSummary.warning}`,

                `Critical Rooms: ${monitoringSummary.critical}`,

                "",

                "COMPLAINT SUMMARY",

                `Total Complaints: ${complaintSummary.total}`,

                `Open Complaints: ${complaintSummary.open}`,

                `Resolved Complaints: ${complaintSummary.resolved}`,

                "",

                "DATA SOURCE",

                `Real IoT Rooms: ${sourceSummary.real}`,

                `Simulated Rooms: ${sourceSummary.simulated}`,

                `Manual Rooms: ${sourceSummary.manual}`,

                "",

                "ROOM REPORT",

                "Room | Building | Floor | Source | Temperature | Humidity | Light | Motion | Status"

            ];


            roomReport.forEach(
                (room) => {

                    lines.push(

                        `${room.roomCode || "--"} | ` +
                        `${room.building || "--"} | ` +
                        `${room.floor ?? "--"} | ` +
                        `${room.dataSource || "--"} | ` +
                        `${room.temperature !== null ? room.temperature.toFixed(1) : "--"} | ` +
                        `${room.humidity !== null ? room.humidity.toFixed(1) : "--"} | ` +
                        `${room.lightLevel !== null ? room.lightLevel : "--"} | ` +
                        `${room.motion ? "Detected" : "No Motion"} | ` +
                        `${room.status}`

                    );

                }
            );


            const blob =
                new Blob(
                    [
                        lines.join("\n")
                    ],
                    {
                        type:
                            "text/plain;charset=utf-8"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                `smart-campus-report-${new Date()
                    .toISOString()
                    .slice(0, 10)}.txt`;


            document.body.appendChild(
                link
            );


            link.click();

            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        };


    return (

        <div className="reports-page">


            {/* =========================
                ACTION BAR
            ========================= */}

            <section className="reports-actions-bar">

                <div></div>

                <div className="reports-actions">

                    <button
                        className="reports-refresh-btn"
                        onClick={loadData}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "reports-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    <button
                        className="reports-download-btn"
                        onClick={generateReport}
                        disabled={
                            loading ||
                            rooms.length === 0
                        }
                    >

                        <Download
                            size={16}
                        />

                        Generate Report

                    </button>

                </div>

            </section>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="reports-error">

                    {error}

                </div>

            )}


            {/* =========================
                ROOM FILTER
            ========================= */}

            <section className="reports-filter-card">

                <div className="reports-filter-left">

                    <Activity
                        size={18}
                    />

                    <div>

                        <strong>
                            Report Scope
                        </strong>

                        <span>
                            Select a room or view the complete campus
                        </span>

                    </div>

                </div>


                <select
                    value={selectedRoom}
                    onChange={(event) =>
                        setSelectedRoom(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Rooms
                    </option>

                    {rooms.map(
                        (room) => (

                            <option
                                key={room.id}
                                value={
                                    room.roomCode
                                }
                            >
                                {room.roomCode}
                            </option>

                        )
                    )}

                </select>

            </section>


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <section className="reports-summary-grid">

                <div className="report-summary-card">

                    <div className="report-summary-icon rooms">

                        <Building2
                            size={20}
                        />

                    </div>

                    <div>

                        <span>
                            Total Rooms
                        </span>

                        <strong>
                            {rooms.length}
                        </strong>

                    </div>

                </div>


                <div className="report-summary-card">

                    <div className="report-summary-icon temperature">

                        <Thermometer
                            size={20}
                        />

                    </div>

                    <div>

                        <span>
                            Avg. Temperature
                        </span>

                        <strong>
                            {summary.averageTemperature.toFixed(1)}
                            <small>°C</small>
                        </strong>

                    </div>

                </div>


                <div className="report-summary-card">

                    <div className="report-summary-icon humidity">

                        <Droplets
                            size={20}
                        />

                    </div>

                    <div>

                        <span>
                            Avg. Humidity
                        </span>

                        <strong>
                            {summary.averageHumidity.toFixed(1)}
                            <small>%</small>
                        </strong>

                    </div>

                </div>


                <div className="report-summary-card">

                    <div className="report-summary-icon light">

                        <Lightbulb
                            size={20}
                        />

                    </div>

                    <div>

                        <span>
                            Avg. Light Level
                        </span>

                        <strong>
                            {summary.averageLight.toFixed(1)}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =========================
                STATUS + COMPLAINTS
            ========================= */}

            <section className="reports-secondary-grid">

                <div className="report-panel">

                    <div className="report-panel-header">

                        <div>

                            <span className="report-panel-label">
                                MONITORING STATUS
                            </span>

                            <h2>
                                Room Health Overview
                            </h2>

                        </div>

                        <BarChart3
                            size={20}
                        />

                    </div>


                    <div className="status-overview">

                        <div className="status-item normal">

                            <div className="status-item-icon">

                                <CheckCircle2
                                    size={18}
                                />

                            </div>

                            <div>

                                <span>
                                    Normal
                                </span>

                                <strong>
                                    {monitoringSummary.normal}
                                </strong>

                            </div>

                        </div>


                        <div className="status-item warning">

                            <div className="status-item-icon">

                                <AlertTriangle
                                    size={18}
                                />

                            </div>

                            <div>

                                <span>
                                    Warning
                                </span>

                                <strong>
                                    {monitoringSummary.warning}
                                </strong>

                            </div>

                        </div>


                        <div className="status-item critical">

                            <div className="status-item-icon">

                                <AlertTriangle
                                    size={18}
                                />

                            </div>

                            <div>

                                <span>
                                    Critical
                                </span>

                                <strong>
                                    {monitoringSummary.critical}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="report-panel">

                    <div className="report-panel-header">

                        <div>

                            <span className="report-panel-label">
                                COMPLAINTS
                            </span>

                            <h2>
                                Complaint Overview
                            </h2>

                        </div>

                        <FileText
                            size={20}
                        />

                    </div>


                    <div className="complaint-overview">

                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                {complaintSummary.total}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Open
                            </span>

                            <strong>
                                {complaintSummary.open}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Resolved
                            </span>

                            <strong>
                                {complaintSummary.resolved}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                ENVIRONMENTAL TREND
            ========================= */}

            <section className="report-panel report-chart-panel">

                <div className="report-panel-header">

                    <div>

                        <span className="report-panel-label">
                            ENVIRONMENTAL TREND
                        </span>

                        <h2>
                            Temperature & Humidity
                        </h2>

                    </div>

                    <div className="chart-live">

                        <span></span>

                        LIVE

                    </div>

                </div>


                {chartData.length === 0 ? (

                    <div className="report-empty">

                        No sensor readings available for this report.

                    </div>

                ) : (

                    <div className="report-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="time"
                                    tick={{
                                        fontSize: 11
                                    }}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 11
                                    }}
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    name="Temperature °C"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="humidity"
                                    name="Humidity %"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </section>


            {/* =========================
                ROOM REPORT
            ========================= */}

            <section className="report-panel room-report-panel">

                <div className="report-panel-header">

                    <div>

                        <span className="report-panel-label">
                            ROOM REPORT
                        </span>

                        <h2>
                            Latest Room Conditions
                        </h2>

                    </div>

                    <span className="report-record-count">

                        {roomReport.length}
                        {" "}
                        Rooms

                    </span>

                </div>


                <div className="room-report-table-wrapper">

                    <table className="room-report-table">

                        <thead>

                        <tr>

                            <th>
                                Room
                            </th>

                            <th>
                                Building
                            </th>

                            <th>
                                Floor
                            </th>

                            <th>
                                Source
                            </th>

                            <th>
                                Temperature
                            </th>

                            <th>
                                Humidity
                            </th>

                            <th>
                                Light
                            </th>

                            <th>
                                Motion
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {roomReport.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="9"
                                    className="table-empty"
                                >

                                    No rooms available.

                                </td>

                            </tr>

                        ) : (

                            roomReport.map(
                                (room) => (

                                    <tr
                                        key={room.id}
                                    >

                                        <td>

                                            <strong>
                                                {room.roomCode}
                                            </strong>

                                            <span className="room-name">
                                                    {room.name}
                                                </span>

                                        </td>


                                        <td>
                                            {room.building || "--"}
                                        </td>


                                        <td>
                                            {room.floor ?? "--"}
                                        </td>


                                        <td>

                                                <span
                                                    className={
                                                        `source-badge ${
                                                            String(
                                                                room.dataSource ||
                                                                ""
                                                            ).toLowerCase()
                                                        }`
                                                    }
                                                >

                                                    {String(
                                                        room.dataSource ||
                                                        "MANUAL"
                                                    ).replaceAll(
                                                        "_",
                                                        " "
                                                    )}

                                                </span>

                                        </td>


                                        <td>

                                            {room.temperature !== null
                                                ? `${room.temperature.toFixed(1)}°C`
                                                : "--"}

                                        </td>


                                        <td>

                                            {room.humidity !== null
                                                ? `${room.humidity.toFixed(1)}%`
                                                : "--"}

                                        </td>


                                        <td>

                                            {room.lightLevel !== null
                                                ? room.lightLevel
                                                : "--"}

                                        </td>


                                        <td>

                                                <span
                                                    className={
                                                        room.motion
                                                            ? "motion-detected"
                                                            : "motion-none"
                                                    }
                                                >

                                                    {room.motion
                                                        ? "Detected"
                                                        : "No Motion"}

                                                </span>

                                        </td>


                                        <td>

                                                <span
                                                    className={
                                                        `room-status ${room.status
                                                            .toLowerCase()
                                                            .replaceAll(
                                                                " ",
                                                                "-"
                                                            )}`
                                                    }
                                                >

                                                    {room.status}

                                                </span>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =========================
                DATA SOURCE
            ========================= */}

            <section className="reports-source-card">

                <div className="reports-source-heading">

                    <div className="reports-source-icon">

                        <Activity
                            size={20}
                        />

                    </div>

                    <div>

                        <span>
                            DATA SOURCE
                        </span>

                        <strong>
                            Campus Data Distribution
                        </strong>

                    </div>

                </div>


                <div className="reports-source-stats">

                    <div>

                        <strong>
                            {sourceSummary.real}
                        </strong>

                        <span>
                            Real IoT
                        </span>

                    </div>


                    <div>

                        <strong>
                            {sourceSummary.simulated}
                        </strong>

                        <span>
                            Simulated
                        </span>

                    </div>


                    <div>

                        <strong>
                            {sourceSummary.manual}
                        </strong>

                        <span>
                            Manual
                        </span>

                    </div>

                </div>

            </section>


            <div className="reports-footer-note">

                <span>
                    Live report data refreshes automatically every 10 seconds.
                </span>

                <span>
                    Generated reports contain the latest available backend data.
                </span>

            </div>


        </div>

    );

}


export default Reports;