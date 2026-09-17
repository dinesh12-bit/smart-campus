import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import {
    RefreshCw,
    Thermometer,
    Droplets,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Minus,
    BrainCircuit,
    Clock3,
    Activity,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";

import "../../styles/predictions.css";


function Predictions() {

    const [rooms, setRooms] = useState([]);
    const [readings, setReadings] = useState([]);

    const [roomPredictions, setRoomPredictions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [aiAvailable, setAiAvailable] =
        useState(false);


    // =========================
    // LOAD DATA
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
            // ROOM-WISE AI PREDICTIONS
            // =========================

            const predictions = [];


            for (const room of loadedRooms) {

                const latestReading =
                    [...loadedReadings]
                        .filter(
                            (reading) =>
                                reading.roomCode ===
                                room.roomCode
                        )
                        .sort(
                            (a, b) =>
                                new Date(
                                    b.recordedAt
                                ) -
                                new Date(
                                    a.recordedAt
                                )
                        )[0];


                // Only request AI prediction
                // when sensor data exists.
                if (!latestReading) {

                    predictions.push({

                        room,

                        latest: null,

                        ai: null

                    });

                    continue;
                }


                try {

                    const aiResponse =
                        await api.get(
                            `/api/ai/room/${encodeURIComponent(
                                room.roomCode
                            )}`
                        );


                    predictions.push({

                        room,

                        latest:
                        latestReading,

                        ai:
                        aiResponse.data

                    });


                } catch (aiError) {

                    console.error(
                        `AI prediction failed for ${room.roomCode}:`,
                        aiError
                    );


                    predictions.push({

                        room,

                        latest:
                        latestReading,

                        ai: null

                    });

                }

            }


            setRoomPredictions(
                predictions
            );


            setAiAvailable(
                predictions.some(
                    (item) =>
                        item.ai?.prediction
                )
            );


        } catch (err) {

            console.error(
                "Failed to load prediction data:",
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
                    "You do not have permission to access prediction data."
                );

            } else {

                setError(
                    "Unable to load prediction data. Please check the backend."
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
    // LATEST READING
    // =========================

    const latestReading =
        useMemo(() => {

            const readingsWithDate =
                [...readings]
                    .filter(
                        (reading) =>
                            reading.recordedAt
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                b.recordedAt
                            ) -
                            new Date(
                                a.recordedAt
                            )
                    );


            return (
                readingsWithDate[0] ||
                null
            );

        }, [readings]);


    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(() => {

            const predictions =
                roomPredictions.filter(
                    (item) =>
                        item.ai?.prediction
                );


            const average = (
                values
            ) => {

                if (
                    values.length === 0
                ) {

                    return null;
                }


                return (
                    values.reduce(
                        (
                            total,
                            value
                        ) =>
                            total +
                            Number(value),
                        0
                    ) /
                    values.length
                );

            };


            const temperatureValues =
                predictions.map(
                    (item) =>
                        item.ai.prediction
                            .temperature
                );


            const humidityValues =
                predictions.map(
                    (item) =>
                        item.ai.prediction
                            .humidity
                );


            const lightValues =
                predictions
                    .map(
                        (item) =>
                            Number(
                                item.ai.current
                                    ?.lightLevel
                            )
                    )
                    .filter(
                        (value) =>
                            Number.isFinite(
                                value
                            )
                    );


            return {

                temperature:
                    average(
                        temperatureValues
                    ),

                humidity:
                    average(
                        humidityValues
                    ),

                light:
                    average(
                        lightValues
                    ),

                roomsWithData:
                roomPredictions.filter(
                    (item) =>
                        item.latest
                ).length,

                aiRooms:
                predictions.length

            };

        }, [
            roomPredictions
        ]);


    // =========================
    // TREND ICON
    // =========================

    const TrendIcon =
        ({ direction }) => {

            if (
                direction ===
                "RISING"
            ) {

                return (
                    <TrendingUp
                        size={15}
                    />
                );

            }


            if (
                direction ===
                "FALLING"
            ) {

                return (
                    <TrendingDown
                        size={15}
                    />
                );

            }


            return (
                <Minus
                    size={15}
                />
            );

        };


    // =========================
    // TREND TEXT
    // =========================

    const getTrendText =
        (direction) => {

            if (
                direction ===
                "RISING"
            ) {

                return "Increasing";
            }


            if (
                direction ===
                "FALLING"
            ) {

                return "Decreasing";
            }


            if (
                direction ===
                "STABLE"
            ) {

                return "Stable";
            }


            return "Not available";
        };


    // =========================
    // TREND CLASS
    // =========================

    const getTrendClass =
        (direction) => {

            if (
                direction ===
                "RISING"
            ) {

                return "up";
            }


            if (
                direction ===
                "FALLING"
            ) {

                return "down";
            }


            return "stable";
        };


    // =========================
    // FORMAT TEMPERATURE
    // =========================

    const formatTemperature =
        (value) => {

            if (
                value === null ||
                value === undefined ||
                !Number.isFinite(
                    Number(value)
                )
            ) {

                return "—";
            }


            return `${Number(value).toFixed(1)}°C`;
        };


    // =========================
    // FORMAT HUMIDITY
    // =========================

    const formatHumidity =
        (value) => {

            if (
                value === null ||
                value === undefined ||
                !Number.isFinite(
                    Number(value)
                )
            ) {

                return "—";
            }


            return `${Number(value).toFixed(0)}%`;
        };


    // =========================
    // FORMAT LIGHT
    // =========================

    const formatLight =
        (value) => {

            if (
                value === null ||
                value === undefined ||
                !Number.isFinite(
                    Number(value)
                )
            ) {

                return "—";
            }


            return Number(value).toFixed(0);
        };


    // =========================
    // LAST UPDATED
    // =========================

    const lastUpdated =
        latestReading?.recordedAt ||
        null;


    const formatDate =
        (date) => {

            if (!date) {

                return "—";
            }


            const parsedDate =
                new Date(date);


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {

                return "—";
            }


            return parsedDate.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        };


    // =========================
    // AI STATUS
    // =========================

    const getAnomalyStatus =
        (item) => {

            const status =
                item.ai?.anomaly?.status;


            if (
                status ===
                "ANOMALY"
            ) {

                return "Anomaly";
            }


            if (
                status ===
                "NORMAL"
            ) {

                return "Normal";
            }


            return "Unavailable";
        };


    // =========================
    // AI SCORE
    // =========================

    const getAnomalyScore =
        (item) => {

            const score =
                item.ai?.anomaly?.score;


            if (
                score === null ||
                score === undefined ||
                !Number.isFinite(
                    Number(score)
                )
            ) {

                return "—";
            }


            return Number(score).toFixed(
                4
            );
        };


    return (

        <div className="predictions-page">


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <section className="prediction-summary-grid">


                <div className="prediction-summary-card">

                    <div className="prediction-summary-icon temperature">

                        <Thermometer
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Projected Temperature
                        </span>

                        <strong>
                            {formatTemperature(
                                summary.temperature
                            )}
                        </strong>

                    </div>

                </div>


                <div className="prediction-summary-card">

                    <div className="prediction-summary-icon humidity">

                        <Droplets
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Projected Humidity
                        </span>

                        <strong>
                            {formatHumidity(
                                summary.humidity
                            )}
                        </strong>

                    </div>

                </div>


                <div className="prediction-summary-card">

                    <div className="prediction-summary-icon light">

                        <Lightbulb
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Current Light
                        </span>

                        <strong>
                            {formatLight(
                                summary.light
                            )}
                        </strong>

                    </div>

                </div>


                <div className="prediction-summary-card">

                    <div className="prediction-summary-icon rooms">

                        <Activity
                            size={21}
                        />

                    </div>


                    <div>

                        <span>
                            Rooms With Data
                        </span>

                        <strong>
                            {summary.roomsWithData}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =========================
                TOOLBAR
            ========================= */}

            <section className="predictions-toolbar">

                <div className="prediction-method">

                    <div className="prediction-method-icon">

                        <BrainCircuit
                            size={19}
                        />

                    </div>


                    <div>

                        <strong>
                            AI Environmental Prediction
                        </strong>

                        <span>
                            Python AI service with real sensor data
                        </span>

                    </div>

                </div>


                <div className="prediction-toolbar-right">

                    {lastUpdated && (

                        <div className="prediction-updated">

                            <Clock3
                                size={15}
                            />

                            Updated{" "}
                            {formatDate(
                                lastUpdated
                            )}

                        </div>

                    )}


                    <button
                        className="prediction-refresh-btn"
                        onClick={loadData}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "prediction-refresh-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

            </section>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="prediction-error">

                    {error}

                </div>

            )}


            {/* =========================
                AI SERVICE STATUS
            ========================= */}

            {!loading && (

                <section className="prediction-ai-status">

                    <div className="prediction-ai-status-icon">

                        {aiAvailable ? (

                            <CheckCircle2
                                size={20}
                            />

                        ) : (

                            <AlertTriangle
                                size={20}
                            />

                        )}

                    </div>


                    <div>

                        <span>
                            AI PREDICTION SERVICE
                        </span>

                        <strong>

                            {aiAvailable
                                ? "Connected and analyzing live sensor data"
                                : "No AI prediction available for the current room data"}

                        </strong>

                    </div>

                </section>

            )}


            {/* =========================
                ROOM PREDICTIONS
            ========================= */}

            <section className="prediction-room-card">

                <div className="prediction-section-header">

                    <div>

                        <span>
                            ROOM-WISE PREDICTIONS
                        </span>

                        <h3>
                            Environmental Forecast
                        </h3>

                    </div>


                    <div className="projection-badge">

                        AI Powered

                    </div>

                </div>


                <div className="prediction-table-wrapper">

                    <table className="prediction-table">

                        <thead>

                        <tr>

                            <th>
                                Room
                            </th>

                            <th>
                                Current Temp
                            </th>

                            <th>
                                Temperature Forecast
                            </th>

                            <th>
                                Current Humidity
                            </th>

                            <th>
                                Humidity Forecast
                            </th>

                            <th>
                                AI Status
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="prediction-table-message"
                                >

                                    Loading AI prediction data...

                                </td>

                            </tr>

                        ) : roomPredictions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="prediction-table-message"
                                >

                                    No rooms available.

                                </td>

                            </tr>

                        ) : (

                            roomPredictions.map(
                                (item) => {

                                    const prediction =
                                        item.ai?.prediction;


                                    const anomaly =
                                        item.ai?.anomaly;


                                    const temperatureDirection =
                                        prediction
                                            ?.temperatureTrend ||
                                        "STABLE";


                                    const humidityDirection =
                                        prediction
                                            ?.humidityTrend ||
                                        "STABLE";


                                    return (

                                        <tr
                                            key={
                                                item.room.id
                                            }
                                        >


                                            {/* ROOM */}

                                            <td>

                                                <div className="prediction-room">

                                                    <strong>
                                                        {
                                                            item.room.roomCode
                                                        }
                                                    </strong>

                                                    <span>
                                                            {
                                                                item.room.name ||
                                                                "Room"
                                                            }
                                                        </span>

                                                </div>

                                            </td>


                                            {/* CURRENT TEMP */}

                                            <td>

                                                {item.latest

                                                    ? formatTemperature(
                                                        Number(
                                                            item.latest.temperature
                                                        )
                                                    )

                                                    : "—"}

                                            </td>


                                            {/* TEMP FORECAST */}

                                            <td>

                                                {prediction ? (

                                                    <div
                                                        className={`prediction-trend ${getTrendClass(
                                                            temperatureDirection
                                                        )}`}
                                                    >

                                                        <TrendIcon
                                                            direction={
                                                                temperatureDirection
                                                            }
                                                        />

                                                        <span>
                                                                {getTrendText(
                                                                    temperatureDirection
                                                                )}
                                                            </span>

                                                        <strong>
                                                            →
                                                            {" "}
                                                            {formatTemperature(
                                                                prediction.temperature
                                                            )}
                                                        </strong>

                                                    </div>

                                                ) : (

                                                    <span className="no-data">
                                                            AI unavailable
                                                        </span>

                                                )}

                                            </td>


                                            {/* CURRENT HUMIDITY */}

                                            <td>

                                                {item.latest

                                                    ? formatHumidity(
                                                        Number(
                                                            item.latest.humidity
                                                        )
                                                    )

                                                    : "—"}

                                            </td>


                                            {/* HUMIDITY FORECAST */}

                                            <td>

                                                {prediction ? (

                                                    <div
                                                        className={`prediction-trend ${getTrendClass(
                                                            humidityDirection
                                                        )}`}
                                                    >

                                                        <TrendIcon
                                                            direction={
                                                                humidityDirection
                                                            }
                                                        />

                                                        <span>
                                                                {getTrendText(
                                                                    humidityDirection
                                                                )}
                                                            </span>

                                                        <strong>
                                                            →
                                                            {" "}
                                                            {formatHumidity(
                                                                prediction.humidity
                                                            )}
                                                        </strong>

                                                    </div>

                                                ) : (

                                                    <span className="no-data">
                                                            AI unavailable
                                                        </span>

                                                )}

                                            </td>


                                            {/* AI STATUS */}

                                            <td>

                                                {anomaly ? (

                                                    <div
                                                        className={
                                                            anomaly.status ===
                                                            "ANOMALY"
                                                                ? "prediction-ai-result anomaly"
                                                                : "prediction-ai-result normal"
                                                        }
                                                    >

                                                        {anomaly.status ===
                                                        "ANOMALY" ? (

                                                            <AlertTriangle
                                                                size={15}
                                                            />

                                                        ) : (

                                                            <CheckCircle2
                                                                size={15}
                                                            />

                                                        )}

                                                        <div>

                                                            <strong>
                                                                {
                                                                    getAnomalyStatus(
                                                                        item
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                    Score:{" "}
                                                                {
                                                                    getAnomalyScore(
                                                                        item
                                                                    )
                                                                }
                                                                </span>

                                                        </div>

                                                    </div>

                                                ) : (

                                                    <span className="no-data">
                                                            —
                                                        </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =========================
                AI FORECAST DETAILS
            ========================= */}

            {roomPredictions
                .filter(
                    (item) =>
                        item.ai?.prediction
                )
                .map((item) => {

                    const prediction =
                        item.ai.prediction;


                    const anomaly =
                        item.ai.anomaly;


                    return (

                        <section
                            className="prediction-info-grid"
                            key={`details-${item.room.id}`}
                        >

                            <div className="prediction-info-card">

                                <div className="prediction-info-icon">

                                    <TrendingUp
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <h3>
                                        {item.room.roomCode} Forecast
                                    </h3>

                                    <p>

                                        The AI service estimates
                                        temperature at{" "}
                                        <strong>
                                            {formatTemperature(
                                                prediction.temperature
                                            )}
                                        </strong>
                                        {" "}and humidity at{" "}
                                        <strong>
                                            {formatHumidity(
                                                prediction.humidity
                                            )}
                                        </strong>
                                        {" "}approximately{" "}
                                        <strong>
                                            {
                                                prediction.approximateSecondsAhead
                                            }{" "}
                                            seconds
                                        </strong>
                                        {" "}ahead.

                                    </p>

                                </div>

                            </div>


                            <div className="prediction-info-card">

                                <div className="prediction-info-icon ml">

                                    <BrainCircuit
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <h3>
                                        ML Anomaly Analysis
                                    </h3>

                                    <p>

                                        Isolation Forest status:{" "}

                                        <strong>
                                            {
                                                anomaly?.status ||
                                                "Unavailable"
                                            }
                                        </strong>

                                        {" "}with anomaly score{" "}

                                        <strong>
                                            {
                                                getAnomalyScore(
                                                    item
                                                )
                                            }
                                        </strong>
                                        .

                                    </p>

                                </div>

                            </div>

                        </section>

                    );

                })}


        </div>

    );

}


export default Predictions;