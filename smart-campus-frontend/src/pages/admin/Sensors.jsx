import { useEffect, useMemo, useState } from "react";

import {
    Activity,
    Droplets,
    Lightbulb,
    RefreshCw,
    Thermometer,
    Wifi,
    WifiOff
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/sensors.css";


function getValue(object, keys, fallback = null) {

    if (!object) {
        return fallback;
    }

    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }

    }

    return fallback;
}


function getRoomCode(room) {

    return getValue(
        room,
        [
            "roomCode",
            "roomNumber",
            "roomNo",
            "code"
        ],
        room?.name || "-"
    );

}


function getReadingRoomCode(reading) {

    const value = getValue(
        reading,
        [
            "roomCode",
            "roomNumber",
            "roomNo",
            "roomName",
            "room"
        ],
        null
    );


    if (
        typeof value === "object" &&
        value !== null
    ) {
        return getRoomCode(value);
    }


    return value;

}


function getSource(room) {

    const source =
        String(
            room?.dataSource || "MANUAL"
        )
            .trim()
            .toUpperCase();


    if (
        source === "IOT" ||
        source === "REAL" ||
        source === "ESP32"
    ) {
        return "IOT";
    }


    if (
        source === "SIMULATED" ||
        source === "SIMULATION" ||
        source === "DEMO"
    ) {
        return "SIMULATED";
    }


    return "MANUAL";

}


function getSourceLabel(source) {

    if (source === "IOT") {
        return "REAL IoT";
    }

    if (source === "SIMULATED") {
        return "SIMULATED";
    }

    return "MANUAL";

}


function getSourceClass(source) {

    if (source === "IOT") {
        return "iot";
    }

    if (source === "SIMULATED") {
        return "simulated";
    }

    return "manual";

}


function Sensors() {

    const [rooms, setRooms] =
        useState([]);

    const [readings, setReadings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    const loadSensorData = async (
        initialLoad = false
    ) => {

        try {

            if (initialLoad) {
                setLoading(true);
            }

            setRefreshing(true);
            setError("");


            const [
                roomsResponse,
                readingsResponse
            ] = await Promise.all([

                api.get(
                    "/api/rooms"
                ),

                api.get(
                    "/api/sensor/readings"
                )

            ]);


            const roomData =
                Array.isArray(
                    roomsResponse.data
                )
                    ? roomsResponse.data
                    : [];


            const readingData =
                Array.isArray(
                    readingsResponse.data
                )
                    ? readingsResponse.data
                    : [];


            setRooms(roomData);
            setReadings(readingData);


        } catch (err) {

            console.error(
                "Sensors page error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                setError(
                    "Session expired. Please login again."
                );

            } else if (
                err.response?.status === 403
            ) {

                setError(
                    "You do not have permission to access sensor data."
                );

            } else {

                setError(
                    "Unable to load sensor data from server."
                );

            }

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadSensorData(true);


        const interval =
            setInterval(() => {

                loadSensorData(false);

            }, 10000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    const getLatestReading = (
        room
    ) => {

        const roomCode =
            String(
                getRoomCode(room)
            )
                .trim()
                .toUpperCase();


        const matchingReadings =
            readings
                .filter((reading) => {

                    const readingCode =
                        getReadingRoomCode(
                            reading
                        );


                    if (!readingCode) {
                        return false;
                    }


                    return (
                        String(
                            readingCode
                        )
                            .trim()
                            .toUpperCase() ===
                        roomCode
                    );

                })
                .sort(
                    (a, b) =>
                        new Date(
                            b.recordedAt || 0
                        ) -
                        new Date(
                            a.recordedAt || 0
                        )
                );


        return (
            matchingReadings[0] ||
            null
        );

    };


    const sensorRooms =
        useMemo(() => {

            return rooms.map((room) => {

                const reading =
                    getLatestReading(
                        room
                    );


                const temperature =
                    getValue(
                        reading,
                        [
                            "temperature",
                            "temp"
                        ],
                        null
                    );


                const humidity =
                    getValue(
                        reading,
                        [
                            "humidity",
                            "hum"
                        ],
                        null
                    );


                const motion =
                    getValue(
                        reading,
                        [
                            "motionDetected",
                            "motion"
                        ],
                        null
                    );


                const light =
                    getValue(
                        reading,
                        [
                            "lightLevel",
                            "light"
                        ],
                        null
                    );


                return {

                    room,

                    reading,

                    roomCode:
                        getRoomCode(room),

                    source:
                        getSource(room),

                    temperature:
                        temperature !== null &&
                        Number.isFinite(
                            Number(
                                temperature
                            )
                        )
                            ? Number(
                                temperature
                            )
                            : null,

                    humidity:
                        humidity !== null &&
                        Number.isFinite(
                            Number(
                                humidity
                            )
                        )
                            ? Number(
                                humidity
                            )
                            : null,

                    motion,

                    light:
                        light !== null &&
                        Number.isFinite(
                            Number(light)
                        )
                            ? Number(light)
                            : null,

                    recordedAt:
                        reading?.recordedAt ||
                        null,

                    isLive:
                        reading !== null

                };

            });

        }, [
            rooms,
            readings
        ]);


    const totalSensors =
        sensorRooms.length * 4;


    const liveSensorRooms =
        sensorRooms.filter(
            (room) =>
                room.isLive
        ).length;


    const liveSensors =
        sensorRooms.reduce(
            (
                total,
                room
            ) => {

                if (!room.isLive) {
                    return total;
                }


                let count = 0;


                if (
                    room.temperature !== null
                ) {
                    count++;
                }


                if (
                    room.humidity !== null
                ) {
                    count++;
                }


                if (
                    room.motion !== null
                ) {
                    count++;
                }


                if (
                    room.light !== null
                ) {
                    count++;
                }


                return total + count;

            },
            0
        );


    const formatTime = (
        value
    ) => {

        if (!value) {
            return "--";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "--";
        }


        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    };


    const getSensorStatus = (
        value
    ) => {

        return value !== null
            ? "LIVE"
            : "NO DATA";

    };


    return (

        <div className="sensors-page">


            {/* TOOLBAR */}

            <div className="sensors-toolbar">

                <div className="sensor-summary">

                    <span className="sensor-summary-live">

                        <i></i>

                        {liveSensors} Live

                    </span>


                    <span className="sensor-summary-total">

                        {totalSensors} Sensors

                    </span>

                </div>


                <button
                    type="button"
                    className="sensors-refresh"
                    onClick={() =>
                        loadSensorData(false)
                    }
                    disabled={
                        refreshing
                    }
                >

                    <RefreshCw
                        size={15}
                        className={
                            refreshing
                                ? "sensor-refresh-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="sensors-error">

                    <WifiOff size={15} />

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            loadSensorData(true)
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="sensors-empty">

                    <RefreshCw
                        size={22}
                        className="sensor-refresh-spin"
                    />

                    <span>
                        Loading real sensor data...
                    </span>

                </div>


            ) : sensorRooms.length === 0 ? (

                <div className="sensors-empty">

                    <Activity size={28} />

                    <strong>
                        No sensors available
                    </strong>

                    <span>
                        Add a room and connect its sensor data to start monitoring.
                    </span>

                </div>


            ) : (

                <div className="sensors-grid">

                    {sensorRooms.map(
                        (room) => (

                            <div
                                className="sensor-room-card"
                                key={
                                    room.room.id
                                }
                            >


                                {/* HEADER */}

                                <div className="sensor-card-header">

                                    <div>

                                        <h2
                                            title={
                                                room.roomCode
                                            }
                                        >
                                            {
                                                room.roomCode
                                            }
                                        </h2>


                                        <span>
                                            Room Sensors
                                        </span>

                                    </div>


                                    <div
                                        className={
                                            room.isLive
                                                ? "sensor-live-badge"
                                                : "sensor-offline-badge"
                                        }
                                    >

                                        {room.isLive ? (
                                            <Wifi size={11} />
                                        ) : (
                                            <WifiOff size={11} />
                                        )}

                                        {room.isLive
                                            ? "LIVE"
                                            : "NO DATA"
                                        }

                                    </div>

                                </div>


                                {/* SOURCE */}

                                <div className="sensor-source-row">

                                    <span>
                                        Data Source
                                    </span>


                                    <span
                                        className={
                                            `sensor-source-badge ${getSourceClass(
                                                room.source
                                            )}`
                                        }
                                    >

                                        <i></i>

                                        {
                                            getSourceLabel(
                                                room.source
                                            )
                                        }

                                    </span>

                                </div>


                                {/* SENSOR LIST */}

                                <div className="sensor-list">


                                    {/* TEMPERATURE */}

                                    <div className="sensor-item">

                                        <div className="sensor-item-icon temperature-sensor-icon">
                                            <Thermometer
                                                size={18}
                                            />
                                        </div>


                                        <div className="sensor-item-info">

                                            <span>
                                                Temperature
                                            </span>

                                            <strong>

                                                {
                                                    room.temperature !==
                                                    null
                                                        ? `${room.temperature.toFixed(
                                                            1
                                                        )}°C`
                                                        : "--"
                                                }

                                            </strong>

                                            <small>
                                                DHT22
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                room.temperature !==
                                                null
                                                    ? "sensor-state live-state"
                                                    : "sensor-state no-data-state"
                                            }
                                        >
                                            {
                                                getSensorStatus(
                                                    room.temperature
                                                )
                                            }
                                        </div>

                                    </div>


                                    {/* HUMIDITY */}

                                    <div className="sensor-item">

                                        <div className="sensor-item-icon humidity-sensor-icon">
                                            <Droplets
                                                size={18}
                                            />
                                        </div>


                                        <div className="sensor-item-info">

                                            <span>
                                                Humidity
                                            </span>

                                            <strong>

                                                {
                                                    room.humidity !==
                                                    null
                                                        ? `${room.humidity.toFixed(
                                                            0
                                                        )}%`
                                                        : "--"
                                                }

                                            </strong>

                                            <small>
                                                DHT22
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                room.humidity !==
                                                null
                                                    ? "sensor-state live-state"
                                                    : "sensor-state no-data-state"
                                            }
                                        >
                                            {
                                                getSensorStatus(
                                                    room.humidity
                                                )
                                            }
                                        </div>

                                    </div>


                                    {/* MOTION */}

                                    <div className="sensor-item">

                                        <div className="sensor-item-icon motion-sensor-icon">
                                            <Activity
                                                size={18}
                                            />
                                        </div>


                                        <div className="sensor-item-info">

                                            <span>
                                                Motion
                                            </span>

                                            <strong>

                                                {room.motion ===
                                                true
                                                    ? "Detected"
                                                    : room.motion ===
                                                    false
                                                        ? "No Motion"
                                                        : "--"}

                                            </strong>

                                            <small>
                                                HC-SR501 PIR
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                room.motion !==
                                                null
                                                    ? "sensor-state live-state"
                                                    : "sensor-state no-data-state"
                                            }
                                        >
                                            {
                                                getSensorStatus(
                                                    room.motion
                                                )
                                            }
                                        </div>

                                    </div>


                                    {/* LIGHT */}

                                    <div className="sensor-item">

                                        <div className="sensor-item-icon light-sensor-icon">
                                            <Lightbulb
                                                size={18}
                                            />
                                        </div>


                                        <div className="sensor-item-info">

                                            <span>
                                                Light Level
                                            </span>

                                            <strong>

                                                {
                                                    room.light !==
                                                    null
                                                        ? Math.round(
                                                            room.light
                                                        )
                                                        : "--"
                                                }

                                            </strong>

                                            <small>
                                                LDR
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                room.light !==
                                                null
                                                    ? "sensor-state live-state"
                                                    : "sensor-state no-data-state"
                                            }
                                        >
                                            {
                                                getSensorStatus(
                                                    room.light
                                                )
                                            }
                                        </div>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="sensor-card-footer">

                                    <span>
                                        Last Reading
                                    </span>

                                    <strong>
                                        {
                                            formatTime(
                                                room.recordedAt
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Sensors;