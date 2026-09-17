import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    Bot,
    Droplets,
    Lightbulb,
    Radio,
    RefreshCw,
    Thermometer,
} from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import "../../styles/dashboard.css";


function Dashboard() {

    const [rooms, setRooms] = useState([]);
    const [readings, setReadings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                roomsResponse,
                readingsResponse
            ] = await Promise.all([
                api.get("/api/rooms"),
                api.get("/api/sensor/readings")
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

        } catch (err) {

            console.error(
                "Dashboard API error:",
                err
            );

            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "You do not have permission to access dashboard data."
                );

            } else {

                setError(
                    "Unable to connect with backend. Please make sure Spring Boot is running."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboardData();

        const interval = setInterval(
            loadDashboardData,
            10000
        );

        return () => {
            clearInterval(interval);
        };

    }, []);


    const validTemperatureReadings =
        useMemo(() => {

            return readings.filter(
                (reading) =>
                    reading.temperature !== null &&
                    reading.temperature !== undefined
            );

        }, [readings]);


    const validHumidityReadings =
        useMemo(() => {

            return readings.filter(
                (reading) =>
                    reading.humidity !== null &&
                    reading.humidity !== undefined
            );

        }, [readings]);


    const validLightReadings =
        useMemo(() => {

            return readings.filter(
                (reading) =>
                    reading.lightLevel !== null &&
                    reading.lightLevel !== undefined
            );

        }, [readings]);


    const averageTemperature =
        useMemo(() => {

            if (
                validTemperatureReadings.length === 0
            ) {
                return null;
            }

            const total =
                validTemperatureReadings.reduce(
                    (sum, reading) =>
                        sum + Number(
                            reading.temperature
                        ),
                    0
                );

            return (
                total /
                validTemperatureReadings.length
            ).toFixed(1);

        }, [validTemperatureReadings]);


    const averageHumidity =
        useMemo(() => {

            if (
                validHumidityReadings.length === 0
            ) {
                return null;
            }

            const total =
                validHumidityReadings.reduce(
                    (sum, reading) =>
                        sum + Number(
                            reading.humidity
                        ),
                    0
                );

            return (
                total /
                validHumidityReadings.length
            ).toFixed(1);

        }, [validHumidityReadings]);


    const averageLightLevel =
        useMemo(() => {

            if (
                validLightReadings.length === 0
            ) {
                return null;
            }

            const total =
                validLightReadings.reduce(
                    (sum, reading) =>
                        sum + Number(
                            reading.lightLevel
                        ),
                    0
                );

            return Math.round(
                total /
                validLightReadings.length
            );

        }, [validLightReadings]);


    const activeRoomCodes =
        useMemo(() => {

            const codes = new Set();

            readings.forEach(
                (reading) => {

                    if (reading.roomCode) {

                        codes.add(
                            reading.roomCode
                        );

                    }

                }
            );

            return codes;

        }, [readings]);


    const activeRooms =
        activeRoomCodes.size;


    const temperatureChartData =
        useMemo(() => {

            const sorted =
                [...validTemperatureReadings]
                    .sort(
                        (a, b) =>
                            new Date(
                                a.recordedAt
                            ) -
                            new Date(
                                b.recordedAt
                            )
                    )
                    .slice(-20);


            return sorted.map(
                (reading) => ({

                    time:
                        new Date(
                            reading.recordedAt
                        ).toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        ),

                    temperature:
                        Number(
                            reading.temperature
                        ),

                    room:
                    reading.roomCode,

                })
            );

        }, [validTemperatureReadings]);


    const roomStatus =
        useMemo(() => {

            const latestByRoom = {};


            [...readings]
                .sort(
                    (a, b) =>
                        new Date(
                            b.recordedAt
                        ) -
                        new Date(
                            a.recordedAt
                        )
                )
                .forEach(
                    (reading) => {

                        if (
                            reading.roomCode &&
                            !latestByRoom[
                                reading.roomCode
                                ]
                        ) {

                            latestByRoom[
                                reading.roomCode
                                ] = reading;

                        }

                    }
                );


            let normal = 0;
            let warning = 0;
            let critical = 0;


            Object.values(
                latestByRoom
            ).forEach(
                (reading) => {

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

                }
            );


            return {
                normal,
                warning,
                critical
            };

        }, [readings]);


    const valueOrDash =
        (
            value,
            suffix = ""
        ) => {

            if (
                value === null ||
                value === undefined
            ) {
                return "--";
            }

            return `${value}${suffix}`;

        };


    return (

        <div className="dashboard-page">


            {error && (

                <div className="dashboard-error">

                    <AlertTriangle size={16} />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={loadDashboardData}
                    >

                        <RefreshCw size={14} />

                        Retry

                    </button>

                </div>

            )}


            {loading && !error && (

                <div className="dashboard-loading">
                    Loading dashboard data...
                </div>

            )}


            <div className="stats-grid">


                <div className="stat-card temperature-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            <Thermometer size={19} />
                        </div>

                        <div className="live-label">
                            <span></span>
                            LIVE
                        </div>

                    </div>


                    <div className="stat-content">

                        <span>
                            Average Temperature
                        </span>

                        <strong>
                            {valueOrDash(
                                averageTemperature,
                                "°C"
                            )}
                        </strong>

                    </div>

                </div>


                <div className="stat-card humidity-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            <Droplets size={19} />
                        </div>

                        <div className="live-label">
                            <span></span>
                            LIVE
                        </div>

                    </div>


                    <div className="stat-content">

                        <span>
                            Average Humidity
                        </span>

                        <strong>
                            {valueOrDash(
                                averageHumidity,
                                "%"
                            )}
                        </strong>

                    </div>

                </div>


                <div className="stat-card active-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            <Radio size={19} />
                        </div>

                        <div className="live-label">
                            <span></span>
                            LIVE
                        </div>

                    </div>


                    <div className="stat-content">

                        <span>
                            Active Rooms
                        </span>

                        <strong>
                            {activeRooms}/{rooms.length}
                        </strong>

                    </div>

                </div>


                <div className="stat-card light-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            <Lightbulb size={19} />
                        </div>

                        <div className="live-label">
                            <span></span>
                            LIVE
                        </div>

                    </div>


                    <div className="stat-content">

                        <span>
                            Average Light Level
                        </span>

                        <strong>
                            {valueOrDash(
                                averageLightLevel
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div className="dashboard-main-grid">


                <section className="temperature-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Temperature Trend
                            </h2>

                            <p>
                                Latest live sensor readings
                            </p>

                        </div>


                        <button
                            type="button"
                            className="refresh-button"
                            onClick={
                                loadDashboardData
                            }
                            title="Refresh data"
                        >

                            <RefreshCw size={14} />

                        </button>

                    </div>


                    <div className="chart-wrapper">

                        {temperatureChartData.length === 0 ? (

                            <div className="empty-chart">

                                <Activity size={28} />

                                <span>
                                    No temperature data available
                                </span>

                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={
                                        temperatureChartData
                                    }
                                    margin={{
                                        top: 10,
                                        right: 12,
                                        left: -20,
                                        bottom: 5,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#edf0f5"
                                    />

                                    <XAxis
                                        dataKey="time"
                                        tick={{
                                            fontSize: 9,
                                            fill: "#9299ac",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 9,
                                            fill: "#9299ac",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            border:
                                                "1px solid #e4e7ef",
                                            borderRadius:
                                                "8px",
                                            fontSize:
                                                "10px",
                                        }}
                                        formatter={
                                            (value) => [
                                                `${value}°C`,
                                                "Temperature",
                                            ]
                                        }
                                        labelFormatter={
                                            (label) =>
                                                `Time: ${label}`
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#6246e5"
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        )}

                    </div>


                    <div className="chart-footer">

                        <span>

                            {validTemperatureReadings.length}
                            {" "}
                            temperature readings

                        </span>


                        <span>

                            Latest:{" "}

                            {temperatureChartData.length
                                ? `${temperatureChartData[
                                temperatureChartData.length - 1
                                    ].temperature}°C`
                                : "--"
                            }

                        </span>

                    </div>

                </section>


                <section className="insights-card">

                    <div className="card-header">

                        <div className="insight-heading">

                            <div className="insight-icon">
                                <Bot size={19} />
                            </div>

                            <div>

                                <h2>
                                    AI Insights
                                </h2>

                                <p>
                                    Intelligent campus analysis
                                </p>

                            </div>

                        </div>


                        <div className="ai-badge">
                            AI
                        </div>

                    </div>


                    <div className="insights-list">


                        <div className="insight-item">

                            <h3>
                                Environment Analysis
                            </h3>

                            <p>
                                Current sensor readings are available for AI analysis.
                            </p>

                            <button type="button">

                                View insights

                                <ArrowUpRight size={11} />

                            </button>

                        </div>


                        <div className="insight-item">

                            <h3>
                                Resource Optimization
                            </h3>

                            <p>
                                AI recommendations will use real campus usage patterns.
                            </p>

                            <button type="button">

                                View insights

                                <ArrowUpRight size={11} />

                            </button>

                        </div>

                    </div>

                </section>

            </div>


            <section className="demo-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Live Campus Status
                        </h2>

                        <p>
                            Based on latest room sensor readings
                        </p>

                    </div>

                </div>


                <div className="activity-grid">


                    <div className="activity-card">

                        <span>
                            Normal Rooms
                        </span>

                        <strong>
                            {roomStatus.normal}
                        </strong>

                        <small className="success-text">

                            <Activity size={10} />

                            Current status

                        </small>

                    </div>


                    <div className="activity-card">

                        <span>
                            Warning Rooms
                        </span>

                        <strong>
                            {roomStatus.warning}
                        </strong>

                        <small className="warning-text">

                            <AlertTriangle size={10} />

                            Attention required

                        </small>

                    </div>


                    <div className="activity-card">

                        <span>
                            Critical Rooms
                        </span>

                        <strong>
                            {roomStatus.critical}
                        </strong>

                        <small className="critical-text">

                            <AlertTriangle size={10} />

                            Immediate attention

                        </small>

                    </div>

                </div>


                <div className="recent-alerts">

                    <h3>
                        Recent Alerts
                    </h3>

                    <p>
                        Alerts will appear here when the alert/complaint module is available.
                    </p>


                    <div className="no-alerts">

                        <AlertTriangle size={16} />

                        <span>
                            No recent alerts
                        </span>

                    </div>

                </div>

            </section>

        </div>

    );
}


export default Dashboard;