import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Droplets,
    Lightbulb,
    RefreshCw,
    Thermometer,
    Users,
} from "lucide-react";

import "../../styles/live-monitoring.css";


/* =========================================================
   VALUE HELPER
========================================================= */

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


/* =========================================================
   ROOM CODE
========================================================= */

function getRoomCode(room) {

    return getValue(
        room,
        [
            "roomCode",
            "roomNumber",
            "roomNo",
            "code",
        ],
        room?.name || "-"
    );

}


/* =========================================================
   READING ROOM CODE
========================================================= */

function getReadingRoomCode(reading) {

    const value = getValue(
        reading,
        [
            "roomCode",
            "roomNumber",
            "roomNo",
            "roomName",
            "room",
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


/* =========================================================
   STATUS CALCULATION
========================================================= */

function calculateStatus(
    temperature,
    humidity
) {

    if (
        temperature === null &&
        humidity === null
    ) {
        return "No Data";
    }


    const temp =
        temperature !== null
            ? Number(temperature)
            : null;


    const hum =
        humidity !== null
            ? Number(humidity)
            : null;


    if (
        (temp !== null && temp >= 35) ||
        (hum !== null && hum >= 85)
    ) {
        return "Critical";
    }


    if (
        (temp !== null && temp >= 30) ||
        (hum !== null && hum >= 75)
    ) {
        return "Warning";
    }


    return "Normal";
}


/* =========================================================
   STATUS ICON
========================================================= */

function StatusIcon({ status }) {

    if (status === "Critical") {

        return (
            <AlertTriangle size={14} />
        );

    }


    if (status === "Warning") {

        return (
            <AlertTriangle size={14} />
        );

    }


    if (status === "Normal") {

        return (
            <CheckCircle2 size={14} />
        );

    }


    return (
        <Clock3 size={14} />
    );
}


/* =========================================================
   LIVE MONITORING
========================================================= */

function LiveMonitoring() {

    const [rooms, setRooms] = useState([]);

    const [readings, setReadings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD REAL DATA
    ===================================================== */

    const loadData = async (
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
                readingsResponse,
            ] = await Promise.all([

                api.get("/api/rooms"),

                api.get("/api/sensor/readings"),

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
                "Live Monitoring error:",
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
                    "You do not have permission to access live monitoring."
                );

            } else {

                setError(
                    "Unable to load live monitoring data."
                );

            }

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadData(true);

    }, []);


    /* =====================================================
       GET LATEST READING
    ===================================================== */

    const getLatestReading = (
        room
    ) => {

        const roomCode =
            String(
                getRoomCode(room)
            )
                .trim()
                .toUpperCase();


        const matching =
            readings
                .filter(
                    (reading) => {

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

                    }
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


        return matching[0] || null;

    };


    /* =====================================================
       PREPARE ROOM DATA
    ===================================================== */

    const monitoringRooms =
        useMemo(() => {

            return rooms.map(
                (room) => {

                    const reading =
                        getLatestReading(
                            room
                        );


                    const temperatureValue =
                        getValue(
                            reading,
                            [
                                "temperature",
                                "temp",
                            ],
                            null
                        );


                    const humidityValue =
                        getValue(
                            reading,
                            [
                                "humidity",
                                "hum",
                            ],
                            null
                        );


                    const lightValue =
                        getValue(
                            reading,
                            [
                                "lightLevel",
                                "light",
                            ],
                            null
                        );


                    const motionValue =
                        getValue(
                            reading,
                            [
                                "motionDetected",
                                "motion",
                            ],
                            null
                        );


                    const occupancyValue =
                        getValue(
                            reading,
                            [
                                "occupancy",
                                "currentOccupancy",
                                "occupants",
                            ],
                            getValue(
                                room,
                                [
                                    "occupancy",
                                    "currentOccupancy",
                                    "occupants",
                                ],
                                null
                            )
                        );


                    const capacityValue =
                        getValue(
                            room,
                            [
                                "capacity",
                                "maxCapacity",
                                "seatingCapacity",
                            ],
                            null
                        );


                    const temperature =
                        temperatureValue !== null
                            ? Number(
                                temperatureValue
                            )
                            : null;


                    const humidity =
                        humidityValue !== null
                            ? Number(
                                humidityValue
                            )
                            : null;


                    const lightLevel =
                        lightValue !== null
                            ? Number(
                                lightValue
                            )
                            : null;


                    const occupancy =
                        occupancyValue !== null
                            ? Number(
                                occupancyValue
                            )
                            : null;


                    const capacity =
                        capacityValue !== null
                            ? Number(
                                capacityValue
                            )
                            : null;


                    const status =
                        calculateStatus(
                            temperature,
                            humidity
                        );


                    return {

                        id:
                        room.id,

                        roomCode:
                            getRoomCode(room),

                        building:
                            getValue(
                                room,
                                [
                                    "building",
                                    "buildingName",
                                    "block",
                                ],
                                "-"
                            ),

                        floor:
                            getValue(
                                room,
                                [
                                    "floor",
                                    "floorNumber",
                                ],
                                "-"
                            ),

                        type:
                            getValue(
                                room,
                                [
                                    "type",
                                    "roomType",
                                ],
                                "Room"
                            ),

                        temperature,

                        humidity,

                        lightLevel,

                        motionDetected:
                        motionValue,

                        occupancy,

                        capacity,

                        status,

                        reading,

                        recordedAt:
                            reading?.recordedAt ||
                            null,

                    };

                }
            );

        }, [
            rooms,
            readings,
        ]);


    /* =====================================================
       COUNTS
    ===================================================== */

    const normalCount =
        monitoringRooms.filter(
            (room) =>
                room.status === "Normal"
        ).length;


    const warningCount =
        monitoringRooms.filter(
            (room) =>
                room.status === "Warning"
        ).length;


    const criticalCount =
        monitoringRooms.filter(
            (room) =>
                room.status === "Critical"
        ).length;


    /* =====================================================
       TIME
    ===================================================== */

    const formatTime = (
        value
    ) => {

        if (!value) {
            return "No data";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "No data";
        }


        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }
        );

    };


    /* =====================================================
       VALUE CLASS
    ===================================================== */

    const getTemperatureClass = (
        temperature
    ) => {

        if (temperature === null) {
            return "";
        }


        if (temperature >= 35) {
            return "critical-value";
        }


        if (temperature >= 30) {
            return "warning-value";
        }


        return "normal-value";

    };


    const getHumidityClass = (
        humidity
    ) => {

        if (humidity === null) {
            return "";
        }


        if (humidity >= 85) {
            return "critical-value";
        }


        if (humidity >= 75) {
            return "warning-value";
        }


        return "normal-value";

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="live-monitoring-page">


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="monitoring-toolbar">


                <div className="monitoring-summary">

                    <span className="summary-normal">

                        <i></i>

                        {normalCount} Normal

                    </span>


                    <span className="summary-warning">

                        <i></i>

                        {warningCount} Warning

                    </span>


                    <span className="summary-critical">

                        <i></i>

                        {criticalCount} Critical

                    </span>

                </div>


                <button
                    type="button"
                    className="monitoring-refresh"
                    onClick={() =>
                        loadData(false)
                    }
                    disabled={refreshing}
                    title="Refresh live data"
                >

                    <RefreshCw
                        size={15}
                        className={
                            refreshing
                                ? "refresh-spinning"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="monitoring-error">

                    <AlertTriangle
                        size={15}
                    />

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            loadData(true)
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="monitoring-empty">

                    <RefreshCw
                        size={22}
                        className="refresh-spinning"
                    />

                    <span>
                        Loading live data...
                    </span>

                </div>

            ) : monitoringRooms.length === 0 ? (

                <div className="monitoring-empty">

                    <Activity
                        size={28}
                    />

                    <strong>
                        No rooms available
                    </strong>

                    <span>
                        Add a room from the Rooms page.
                    </span>

                </div>

            ) : (

                /* =================================================
                   ROOM CARDS
                ================================================= */

                <div className="monitoring-grid">

                    {monitoringRooms.map(
                        (room) => (

                            <div
                                key={room.id}
                                className={
                                    `monitoring-card status-${room.status
                                        .toLowerCase()
                                        .replace(
                                            " ",
                                            "-"
                                        )}`
                                }
                            >


                                {/* TOP LINE */}

                                <div className="monitoring-card-top"></div>


                                {/* HEADER */}

                                <div className="monitoring-card-header">

                                    <div>

                                        <h3
                                            title={
                                                room.roomCode
                                            }
                                        >
                                            {room.roomCode}
                                        </h3>

                                        <span>
                                            {room.type}
                                        </span>

                                    </div>


                                    {room.reading && (

                                        <span className="live-indicator">

                                            <i></i>

                                            LIVE

                                        </span>

                                    )}

                                </div>


                                {/* LOCATION */}

                                <div className="room-location">

                                    {room.building}

                                    {" · "}

                                    Floor {room.floor}

                                </div>


                                {/* TEMP + HUMIDITY */}

                                <div className="environment-row">


                                    <div className="environment-value">

                                        <div className="environment-icon temperature-icon">

                                            <Thermometer
                                                size={16}
                                            />

                                        </div>


                                        <div>

                                            <strong
                                                className={
                                                    getTemperatureClass(
                                                        room.temperature
                                                    )
                                                }
                                            >

                                                {room.temperature !== null
                                                    ? `${room.temperature.toFixed(
                                                        1
                                                    )}°C`
                                                    : "--"
                                                }

                                            </strong>


                                            <span>
                                                Temperature
                                            </span>

                                        </div>

                                    </div>


                                    <div className="environment-value">

                                        <div className="environment-icon humidity-icon">

                                            <Droplets
                                                size={16}
                                            />

                                        </div>


                                        <div>

                                            <strong
                                                className={
                                                    getHumidityClass(
                                                        room.humidity
                                                    )
                                                }
                                            >

                                                {room.humidity !== null
                                                    ? `${room.humidity.toFixed(
                                                        0
                                                    )}%`
                                                    : "--"
                                                }

                                            </strong>


                                            <span>
                                                Humidity
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* OCCUPANCY / LIGHT / MOTION */}

                                <div className="monitoring-data-row">


                                    <div className="monitoring-data-item">

                                        <div className="data-icon occupancy-icon">

                                            <Users
                                                size={14}
                                            />

                                        </div>


                                        <div>

                                            <strong>

                                                {room.occupancy !== null
                                                    ? room.occupancy
                                                    : "--"
                                                }

                                                {room.capacity !== null &&
                                                room.occupancy !== null
                                                    ? `/${room.capacity}`
                                                    : ""
                                                }

                                            </strong>


                                            <span>
                                                Occupancy
                                            </span>

                                        </div>

                                    </div>


                                    <div className="monitoring-data-item">

                                        <div className="data-icon light-icon">

                                            <Lightbulb
                                                size={14}
                                            />

                                        </div>


                                        <div>

                                            <strong>

                                                {room.lightLevel !== null
                                                    ? Math.round(
                                                        room.lightLevel
                                                    )
                                                    : "--"
                                                }

                                            </strong>


                                            <span>
                                                Light Level
                                            </span>

                                        </div>

                                    </div>


                                    <div className="monitoring-data-item">

                                        <div className="data-icon motion-icon">

                                            <Activity
                                                size={14}
                                            />

                                        </div>


                                        <div>

                                            <strong>

                                                {room.motionDetected === true
                                                    ? "Yes"
                                                    : room.motionDetected === false
                                                        ? "No"
                                                        : "--"
                                                }

                                            </strong>


                                            <span>
                                                Motion
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="monitoring-status">

                                    <div className="status-left">

                                        <StatusIcon
                                            status={
                                                room.status
                                            }
                                        />

                                        <span>
                                            {room.status}
                                        </span>

                                    </div>


                                    <span className="last-updated">

                                        {formatTime(
                                            room.recordedAt
                                        )}

                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default LiveMonitoring;