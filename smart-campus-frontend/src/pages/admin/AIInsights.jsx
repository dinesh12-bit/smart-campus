import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import {
    RefreshCw,
    Thermometer,
    Droplets,
    Lightbulb,
    Activity,
    AlertTriangle,
    CheckCircle2,
    BrainCircuit,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

import "../../styles/ai-insights.css";


function AIInsights() {

    const [rooms, setRooms] = useState([]);
    const [readings, setReadings] = useState([]);

    const [aiResult, setAiResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD REAL DATA + AI
    // =========================

    const loadData = async () => {

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


            const loadedRooms =
                Array.isArray(roomsResponse.data)
                    ? roomsResponse.data
                    : [];


            const loadedReadings =
                Array.isArray(readingsResponse.data)
                    ? readingsResponse.data
                    : [];


            setRooms(loadedRooms);
            setReadings(loadedReadings);


            // =========================
            // LATEST ROOM-204 DATA
            // =========================

            const latestRoom204 =
                [...loadedReadings]
                    .filter(
                        (reading) =>
                            reading.roomCode === "ROOM-204"
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.recordedAt) -
                            new Date(a.recordedAt)
                    )[0];


            // =========================
            // PYTHON AI THROUGH
            // SPRING BOOT
            // =========================

            if (!latestRoom204) {

                setAiResult(null);

                return;
            }


            try {

                const aiResponse =
                    await api.post(
                        "/api/ai/anomaly",
                        {
                            temperature:
                                Number(
                                    latestRoom204.temperature
                                ),

                            humidity:
                                Number(
                                    latestRoom204.humidity
                                ),

                            motionDetected:
                                latestRoom204.motionDetected === true ||
                                latestRoom204.motionDetected === 1 ||
                                latestRoom204.motionDetected === "1"
                                    ? 1
                                    : 0,

                            lightLevel:
                                Number(
                                    latestRoom204.lightLevel
                                )
                        }
                    );


                setAiResult(
                    aiResponse.data
                );


            } catch (aiError) {

                console.error(
                    "AI anomaly prediction failed:",
                    aiError
                );

                setAiResult(null);

            }

        } catch (err) {

            console.error(
                "Failed to load AI insights data:",
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
                    "You do not have permission to access AI insights data."
                );

            } else {

                setError(
                    "Unable to load sensor insights. Please check the backend."
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

                    const roomCode =
                        reading.roomCode;


                    if (
                        roomCode &&
                        !latestMap[roomCode]
                    ) {

                        latestMap[roomCode] =
                            reading;

                    }

                });


            return latestMap;

        }, [readings]);


    // =========================
    // GENERATE INSIGHTS
    // =========================

    const insights =
        useMemo(() => {

            const result = [];


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


                const lightLevel =
                    Number(
                        reading.lightLevel
                    );


                const motionDetected =
                    reading.motionDetected === true ||
                    reading.motionDetected === 1 ||
                    reading.motionDetected === "1";


                // =========================
                // HIGH TEMPERATURE
                // =========================

                if (
                    Number.isFinite(temperature) &&
                    temperature >= 30
                ) {

                    result.push({

                        id:
                            `${room.id}-temperature`,

                        roomCode:
                        room.roomCode,

                        roomName:
                        room.name,

                        type:
                            "temperature",

                        title:
                            "High Temperature Detected",

                        value:
                            `${temperature.toFixed(1)}°C`,

                        description:
                            "Temperature is above the normal monitoring threshold.",

                        threshold:
                            "Threshold: 30°C",

                        recommendation:
                            temperature >= 35
                                ? "Check HVAC operation immediately and increase room ventilation."
                                : "Increase room ventilation or check HVAC operation.",

                        severity:
                            temperature >= 35
                                ? "critical"
                                : "warning",

                        icon:
                        Thermometer

                    });

                }


                // =========================
                // HIGH HUMIDITY
                // =========================

                if (
                    Number.isFinite(humidity) &&
                    humidity >= 75
                ) {

                    result.push({

                        id:
                            `${room.id}-humidity`,

                        roomCode:
                        room.roomCode,

                        roomName:
                        room.name,

                        type:
                            "humidity",

                        title:
                            "High Humidity Detected",

                        value:
                            `${humidity.toFixed(0)}%`,

                        description:
                            "Humidity is above the normal monitoring threshold.",

                        threshold:
                            "Threshold: 75%",

                        recommendation:
                            humidity >= 85
                                ? "Check dehumidification and improve ventilation immediately."
                                : "Improve room ventilation or check dehumidification.",

                        severity:
                            humidity >= 85
                                ? "critical"
                                : "warning",

                        icon:
                        Droplets

                    });

                }


                // =========================
                // LOW LIGHT
                // =========================

                if (
                    Number.isFinite(lightLevel) &&
                    lightLevel < 30
                ) {

                    result.push({

                        id:
                            `${room.id}-light`,

                        roomCode:
                        room.roomCode,

                        roomName:
                        room.name,

                        type:
                            "light",

                        title:
                            "Low Light Level",

                        value:
                            `${lightLevel}`,

                        description:
                            "Light level is below the configured monitoring threshold.",

                        threshold:
                            "Threshold: 30",

                        recommendation:
                            "Check room lighting and switch on the required lights.",

                        severity:
                            "warning",

                        icon:
                        Lightbulb

                    });

                }


                // =========================
                // MOTION DETECTED
                // =========================

                if (motionDetected) {

                    result.push({

                        id:
                            `${room.id}-motion`,

                        roomCode:
                        room.roomCode,

                        roomName:
                        room.name,

                        type:
                            "motion",

                        title:
                            "Motion Detected",

                        value:
                            "Detected",

                        description:
                            "The PIR sensor has detected motion in this room.",

                        threshold:
                            "Source: HC-SR501 PIR",

                        recommendation:
                            "Review current room occupancy and activity.",

                        severity:
                            "normal",

                        icon:
                        Activity

                    });

                }

            });


            // =========================
            // MACHINE LEARNING RESULT
            // =========================

            if (aiResult) {

                const aiStatus =
                    aiResult.ai?.status;


                const anomalyScore =
                    Number(
                        aiResult.ai?.anomalyScore
                    );


                const roomCode =
                    aiResult.roomCode ||
                    "ROOM-204";


                // =========================
                // AI ANOMALY
                // =========================

                if (
                    aiStatus === "ANOMALY"
                ) {

                    result.push({

                        id:
                            "room-204-ai-anomaly",

                        roomCode:
                        roomCode,

                        roomName:
                            "AI Anomaly Detection",

                        type:
                            "ai",

                        title:
                            "AI Anomaly Detected",

                        value:
                            "Anomaly",

                        description:
                            "The machine learning model detected an unusual combination of environmental sensor values.",

                        threshold:
                            Number.isFinite(
                                anomalyScore
                            )
                                ? `Anomaly score: ${anomalyScore.toFixed(4)}`
                                : "Machine learning anomaly detected.",

                        recommendation:
                            "Inspect the room for unusual environmental conditions and verify the sensor readings.",

                        severity:
                            "critical",

                        icon:
                        BrainCircuit

                    });

                }


                    // =========================
                    // AI NORMAL
                // =========================

                else if (
                    aiStatus === "NORMAL"
                ) {

                    result.push({

                        id:
                            "room-204-ai-normal",

                        roomCode:
                        roomCode,

                        roomName:
                            "AI Anomaly Detection",

                        type:
                            "ai",

                        title:
                            "AI Environment Status",

                        value:
                            "Normal",

                        description:
                            "The machine learning model found the latest ROOM-204 sensor pattern to be within its learned normal range.",

                        threshold:
                            Number.isFinite(
                                anomalyScore
                            )
                                ? `Anomaly score: ${anomalyScore.toFixed(4)}`
                                : "Machine learning status: Normal.",

                        recommendation:
                            "No immediate action required. Continue monitoring the room environment.",

                        severity:
                            "normal",

                        icon:
                        BrainCircuit

                    });

                }

            }


            return result;

        }, [
            rooms,
            latestReadings,
            aiResult
        ]);


    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(() => {

            const critical =
                insights.filter(
                    (item) =>
                        item.severity ===
                        "critical"
                ).length;


            const warnings =
                insights.filter(
                    (item) =>
                        item.severity ===
                        "warning"
                ).length;


            const normal =
                insights.filter(
                    (item) =>
                        item.severity ===
                        "normal"
                ).length;


            return {

                total:
                insights.length,

                critical,

                warnings,

                normal

            };

        }, [insights]);


    // =========================
    // STATUS TEXT
    // =========================

    const getStatusText =
        (severity) => {

            if (
                severity === "critical"
            ) {

                return "Critical";

            }


            if (
                severity === "warning"
            ) {

                return "Warning";

            }


            return "Normal";

        };


    // =========================
    // GENERAL INSIGHT
    // =========================

    const generalInsight =
        useMemo(() => {

            if (
                readings.length === 0
            ) {

                return {

                    title:
                        "No Sensor Data Available",

                    text:
                        "No live sensor readings are currently available for generating environmental insights."

                };

            }


            if (
                aiResult?.ai?.status ===
                "ANOMALY"
            ) {

                return {

                    title:
                        "AI Anomaly Detected",

                    text:
                        "The machine learning model detected an unusual environmental sensor pattern in ROOM-204. Review the latest room conditions and verify the sensor readings."

                };

            }


            if (
                summary.critical > 0
            ) {

                return {

                    title:
                        "Critical Environmental Condition Detected",

                    text:
                        `${summary.critical} critical sensor condition${
                            summary.critical > 1
                                ? "s"
                                : ""
                        } detected. Immediate attention is recommended.`

                };

            }


            if (
                summary.warnings > 0
            ) {

                return {

                    title:
                        "Environmental Monitoring Alert",

                    text:
                        `${summary.warnings} warning${
                            summary.warnings > 1
                                ? "s"
                                : ""
                        } detected from the latest available sensor readings. Review the recommended actions shown above.`

                };

            }


            return {

                title:
                    "Campus Environment Looks Stable",

                text:
                    "No temperature, humidity or light threshold violations were detected in the latest available sensor readings."

            };

        }, [
            readings,
            summary,
            aiResult
        ]);


    return (

        <div className="ai-insights-page">


            {/* =========================
                TOP SUMMARY
            ========================= */}

            <section className="ai-summary-grid">


                <div className="ai-summary-card">

                    <div className="ai-summary-icon insight-icon">

                        <BrainCircuit
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Total Insights
                        </span>

                        <strong>
                            {summary.total}
                        </strong>

                    </div>

                </div>


                <div className="ai-summary-card">

                    <div className="ai-summary-icon warning-icon">

                        <AlertTriangle
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Warnings
                        </span>

                        <strong>
                            {summary.warnings}
                        </strong>

                    </div>

                </div>


                <div className="ai-summary-card">

                    <div className="ai-summary-icon critical-icon">

                        <ArrowUpRight
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Critical
                        </span>

                        <strong>
                            {summary.critical}
                        </strong>

                    </div>

                </div>


                <div className="ai-summary-card">

                    <div className="ai-summary-icon normal-icon">

                        <CheckCircle2
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Normal
                        </span>

                        <strong>
                            {summary.normal}
                        </strong>

                    </div>

                </div>


            </section>


            {/* =========================
                TOOLBAR
            ========================= */}

            <section className="ai-toolbar">

                <div className="ai-live-info">

                    <span className="ai-live-dot"></span>

                    <span>
                        Generated from latest sensor readings and ML analysis
                    </span>

                </div>


                <button
                    className="ai-refresh-btn"
                    onClick={loadData}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "ai-refresh-spinning"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </section>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="ai-error">

                    {error}

                </div>

            )}


            {/* =========================
                AI MODEL STATUS
            ========================= */}

            {aiResult && (

                <section className="ai-model-status">

                    <div className="ai-model-status-icon">

                        {aiResult.ai?.status ===
                        "ANOMALY" ? (

                            <AlertTriangle
                                size={22}
                            />

                        ) : (

                            <BrainCircuit
                                size={22}
                            />

                        )}

                    </div>


                    <div className="ai-model-status-content">

                        <span>
                            MACHINE LEARNING STATUS
                        </span>

                        <strong>

                            {aiResult.ai?.status ===
                            "ANOMALY"

                                ? "Anomaly detected by Isolation Forest"

                                : "Latest sensor pattern classified as normal"}

                        </strong>

                    </div>


                    <div className="ai-model-score">

                        <span>
                            Score
                        </span>

                        <strong>

                            {Number.isFinite(
                                Number(
                                    aiResult.ai?.anomalyScore
                                )
                            )
                                ? Number(
                                    aiResult.ai.anomalyScore
                                ).toFixed(4)
                                : "--"}

                        </strong>

                    </div>

                </section>

            )}


            {/* =========================
                INSIGHT CARDS
            ========================= */}

            <section className="ai-insights-grid">

                {loading ? (

                    <div className="ai-empty-card">

                        Loading live sensor insights...

                    </div>

                ) : insights.length === 0 ? (

                    <div className="ai-empty-card">

                        <CheckCircle2
                            size={34}
                        />

                        <strong>
                            No active insights
                        </strong>

                        <span>
                            Latest available sensor readings
                            are within the configured thresholds.
                        </span>

                    </div>

                ) : (

                    insights.map(
                        (insight) => {

                            const Icon =
                                insight.icon;


                            return (

                                <article
                                    className={
                                        `ai-insight-card ${insight.severity}`
                                    }
                                    key={insight.id}
                                >

                                    <div className="ai-card-top">

                                        <div
                                            className={
                                                `ai-card-icon ${insight.type}`
                                            }
                                        >

                                            <Icon
                                                size={21}
                                            />

                                        </div>


                                        <span
                                            className={
                                                `ai-severity-badge ${insight.severity}`
                                            }
                                        >

                                            {getStatusText(
                                                insight.severity
                                            )}

                                        </span>

                                    </div>


                                    <h3>

                                        {insight.title}

                                    </h3>


                                    <div className="ai-room-code">

                                        {insight.roomCode}

                                    </div>


                                    <div className="ai-reading-value">

                                        {insight.value}

                                    </div>


                                    <p>

                                        {insight.description}

                                    </p>


                                    <div className="ai-threshold">

                                        {insight.threshold}

                                    </div>


                                    {/* =========================
                                        RECOMMENDED ACTION
                                    ========================= */}

                                    <div className="ai-recommendation">

                                        <span>
                                            Recommended Action
                                        </span>

                                        <p>
                                            {insight.recommendation}
                                        </p>

                                    </div>


                                    <div className="ai-card-footer">

                                        <span>

                                            {insight.type ===
                                            "ai"

                                                ? "Machine learning analysis"

                                                : "Live sensor data"}

                                        </span>


                                        <ArrowDownRight
                                            size={15}
                                        />

                                    </div>


                                </article>

                            );

                        }
                    )

                )}

            </section>


            {/* =========================
                GENERAL INSIGHT
            ========================= */}

            <section className="general-insight-card">

                <div className="general-insight-icon">

                    <BrainCircuit
                        size={24}
                    />

                </div>


                <div className="general-insight-content">

                    <div className="general-insight-heading">

                        <div>

                            <span>
                                GENERAL INSIGHT
                            </span>

                            <h3>
                                {generalInsight.title}
                            </h3>

                        </div>


                        <div className="general-insight-live">

                            LIVE

                        </div>

                    </div>


                    <p>
                        {generalInsight.text}
                    </p>

                </div>

            </section>


        </div>

    );

}


export default AIInsights;