import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
    RefreshCw,
    Thermometer,
    Droplets,
    Activity,
    MessageSquare,
    CalendarDays
} from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "../../styles/analytics.css";


function Analytics() {

    const [rooms, setRooms] = useState([]);
    const [readings, setReadings] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const [selectedRoom, setSelectedRoom] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD REAL DATA
    // =========================

    const loadAnalytics = async () => {

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
                "Failed to load analytics:",
                err
            );


            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "You do not have permission to access analytics data."
                );

            } else {

                setError(
                    "Unable to load analytics data. Please check the backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadAnalytics();

        const interval = setInterval(() => {
            loadAnalytics();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    // =========================
    // FILTER READINGS
    // =========================

    const filteredReadings = useMemo(() => {

        if (selectedRoom === "ALL") {
            return readings;
        }

        return readings.filter(
            (reading) =>
                reading.roomCode === selectedRoom
        );

    }, [
        readings,
        selectedRoom
    ]);


    // =========================
    // DATE FORMAT
    // =========================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================
    // TEMPERATURE DATA
    // =========================

    const temperatureData = useMemo(() => {

        return [...filteredReadings]

            .filter(
                (reading) =>
                    reading.temperature !== null &&
                    reading.temperature !== undefined &&
                    reading.recordedAt
            )

            .sort(
                (a, b) =>
                    new Date(a.recordedAt) -
                    new Date(b.recordedAt)
            )

            .slice(-20)

            .map((reading) => ({

                time:
                    formatTime(
                        reading.recordedAt
                    ),

                value:
                    Number(
                        reading.temperature
                    )

            }));

    }, [
        filteredReadings
    ]);


    // =========================
    // HUMIDITY DATA
    // =========================

    const humidityData = useMemo(() => {

        return [...filteredReadings]

            .filter(
                (reading) =>
                    reading.humidity !== null &&
                    reading.humidity !== undefined &&
                    reading.recordedAt
            )

            .sort(
                (a, b) =>
                    new Date(a.recordedAt) -
                    new Date(b.recordedAt)
            )

            .slice(-20)

            .map((reading) => ({

                time:
                    formatTime(
                        reading.recordedAt
                    ),

                value:
                    Number(
                        reading.humidity
                    )

            }));

    }, [
        filteredReadings
    ]);


    // =========================
    // MOTION DATA
    // =========================

    const motionData = useMemo(() => {

        return [...filteredReadings]

            .filter(
                (reading) =>
                    reading.recordedAt
            )

            .sort(
                (a, b) =>
                    new Date(a.recordedAt) -
                    new Date(b.recordedAt)
            )

            .slice(-20)

            .map((reading) => ({

                time:
                    formatTime(
                        reading.recordedAt
                    ),

                value:
                    reading.motionDetected === true
                        ? 1
                        : 0

            }));

    }, [
        filteredReadings
    ]);


    // =========================
    // COMPLAINT DATA
    // =========================

    const complaintData = useMemo(() => {

        const grouped = {};


        complaints.forEach(
            (complaint) => {

                if (!complaint.createdAt) {
                    return;
                }


                const date =
                    new Date(
                        complaint.createdAt
                    );


                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {
                    return;
                }


                const key =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short"
                        }
                    );


                grouped[key] =
                    (grouped[key] || 0) + 1;

            }
        );


        return Object.entries(grouped)

            .slice(-10)

            .map(
                ([date, value]) => ({

                    date,
                    value

                })
            );

    }, [
        complaints
    ]);


    // =========================
    // SUMMARY VALUES
    // =========================

    const summary = useMemo(() => {

        const average = (
            data,
            field
        ) => {

            const valid =
                data.filter(
                    (item) =>
                        item[field] !== null &&
                        item[field] !== undefined &&
                        Number.isFinite(
                            Number(
                                item[field]
                            )
                        )
                );


            if (
                valid.length === 0
            ) {
                return null;
            }


            return (
                valid.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item[field]
                        ),
                    0
                ) / valid.length
            );

        };


        const motionCount =
            filteredReadings.filter(
                (reading) =>
                    reading.motionDetected === true
            ).length;


        return {

            temperature:
                average(
                    filteredReadings,
                    "temperature"
                ),

            humidity:
                average(
                    filteredReadings,
                    "humidity"
                ),

            motion:
            motionCount,

            complaints:
            complaints.length

        };

    }, [
        filteredReadings,
        complaints
    ]);


    // =========================
    // CHART COMPONENT
    // =========================

    const SensorChart = ({
                             data,
                             unit,
                             emptyText
                         }) => {

        if (
            data.length === 0
        ) {

            return (

                <div className="analytics-empty-chart">

                    {emptyText}

                </div>

            );

        }


        const dataKey =
            data[0]?.date
                ? "date"
                : "time";


        return (

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <LineChart
                    data={data}
                    margin={{
                        top: 8,
                        right: 8,
                        left: -20,
                        bottom: 0
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#eef0f4"
                    />


                    <XAxis
                        dataKey={dataKey}
                        tick={{
                            fontSize: 9,
                            fill: "#9297a2"
                        }}
                        axisLine={false}
                        tickLine={false}
                    />


                    <YAxis
                        tick={{
                            fontSize: 9,
                            fill: "#9297a2"
                        }}
                        axisLine={false}
                        tickLine={false}
                    />


                    <Tooltip
                        formatter={(value) =>
                            `${value}${unit || ""}`
                        }
                    />


                    <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                        dot={{
                            r: 2
                        }}
                        activeDot={{
                            r: 4
                        }}
                    />

                </LineChart>

            </ResponsiveContainer>

        );

    };


    return (

        <div className="analytics-page">


            {/* FILTER BAR */}

            <section className="analytics-filter-bar">

                <div className="analytics-filter">

                    <label>
                        Room
                    </label>


                    <select
                        value={selectedRoom}
                        onChange={(e) =>
                            setSelectedRoom(
                                e.target.value
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
                                    value={room.roomCode}
                                >

                                    {room.roomCode}

                                </option>

                            )
                        )}

                    </select>

                </div>


                <div className="analytics-date">

                    <CalendarDays size={15} />

                    <span>
                        Latest available sensor data
                    </span>

                </div>


                <button
                    className="analytics-refresh-btn"
                    onClick={loadAnalytics}
                    disabled={loading}
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "analytics-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </section>


            {/* ERROR */}

            {error && (

                <div className="analytics-error">

                    {error}

                </div>

            )}


            {/* SUMMARY */}

            <section className="analytics-summary">


                <div className="analytics-summary-card">

                    <div className="analytics-summary-icon temp">

                        <Thermometer size={20} />

                    </div>


                    <div>

                        <span>
                            Avg Temperature
                        </span>


                        <strong>

                            {summary.temperature !== null

                                ? `${summary.temperature.toFixed(1)}°C`

                                : "—"

                            }

                        </strong>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-summary-icon humidity">

                        <Droplets size={20} />

                    </div>


                    <div>

                        <span>
                            Avg Humidity
                        </span>


                        <strong>

                            {summary.humidity !== null

                                ? `${summary.humidity.toFixed(1)}%`

                                : "—"

                            }

                        </strong>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-summary-icon motion">

                        <Activity size={20} />

                    </div>


                    <div>

                        <span>
                            Motion Events
                        </span>


                        <strong>
                            {summary.motion}
                        </strong>

                    </div>

                </div>


                <div className="analytics-summary-card">

                    <div className="analytics-summary-icon complaints">

                        <MessageSquare size={20} />

                    </div>


                    <div>

                        <span>
                            Total Complaints
                        </span>


                        <strong>
                            {summary.complaints}
                        </strong>

                    </div>

                </div>

            </section>


            {/* CHARTS */}

            <section className="analytics-chart-grid">


                {/* TEMPERATURE */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">

                        <div>

                            <span>
                                REAL SENSOR DATA
                            </span>

                            <h3>
                                Temperature (°C)
                            </h3>

                        </div>


                        <div className="chart-icon temperature">

                            <Thermometer size={17} />

                        </div>

                    </div>


                    <div className="analytics-chart">

                        {loading ? (

                            <div className="analytics-empty-chart">
                                Loading...
                            </div>

                        ) : (

                            <SensorChart
                                data={temperatureData}
                                unit="°C"
                                emptyText="No temperature data available"
                            />

                        )}

                    </div>

                </div>


                {/* HUMIDITY */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">

                        <div>

                            <span>
                                REAL SENSOR DATA
                            </span>

                            <h3>
                                Humidity (%)
                            </h3>

                        </div>


                        <div className="chart-icon humidity">

                            <Droplets size={17} />

                        </div>

                    </div>


                    <div className="analytics-chart">

                        {loading ? (

                            <div className="analytics-empty-chart">
                                Loading...
                            </div>

                        ) : (

                            <SensorChart
                                data={humidityData}
                                unit="%"
                                emptyText="No humidity data available"
                            />

                        )}

                    </div>

                </div>


                {/* MOTION */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">

                        <div>

                            <span>
                                REAL PIR DATA
                            </span>

                            <h3>
                                Motion Events
                            </h3>

                        </div>


                        <div className="chart-icon motion">

                            <Activity size={17} />

                        </div>

                    </div>


                    <div className="analytics-chart">

                        {loading ? (

                            <div className="analytics-empty-chart">
                                Loading...
                            </div>

                        ) : (

                            <SensorChart
                                data={motionData}
                                emptyText="No motion data available"
                            />

                        )}

                    </div>

                </div>


                {/* COMPLAINTS */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">

                        <div>

                            <span>
                                REAL BACKEND DATA
                            </span>

                            <h3>
                                Complaints
                            </h3>

                        </div>


                        <div className="chart-icon complaints">

                            <MessageSquare size={17} />

                        </div>

                    </div>


                    <div className="analytics-chart">

                        {loading ? (

                            <div className="analytics-empty-chart">
                                Loading...
                            </div>

                        ) : (

                            <SensorChart
                                data={complaintData}
                                emptyText="No complaint data available"
                            />

                        )}

                    </div>

                </div>

            </section>


            {/* DATA INFORMATION */}

            <section className="analytics-info">

                <div className="analytics-info-icon">

                    <Activity size={19} />

                </div>


                <div>

                    <strong>
                        Analytics based on actual backend data
                    </strong>


                    <p>
                        Temperature, humidity and motion
                        charts are generated from sensor
                        readings stored by the Spring Boot
                        backend. Complaint statistics are
                        loaded from the complaints API.
                    </p>

                </div>

            </section>


        </div>

    );

}


export default Analytics;