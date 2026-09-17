import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    RefreshCw,
    X,
    Save,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/rooms.css";


function valueOf(
    object,
    keys,
    fallback = null
) {
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


function getRoomNumber(room) {
    return valueOf(
        room,
        [
            "roomCode",
            "roomNumber",
            "roomNo",
            "code",
            "name",
        ],
        "-"
    );
}


function getShortRoomNumber(
    roomNumber
) {
    if (!roomNumber) {
        return "-";
    }

    const value = String(roomNumber)
        .trim()
        .toUpperCase();

    if (value.startsWith("ROOM-")) {
        return value.replace(
            "ROOM-",
            "R-"
        );
    }

    if (value.startsWith("LIBRARY-")) {
        return value.replace(
            "LIBRARY-",
            "L-"
        );
    }

    if (value.startsWith("SEMINAR-")) {
        return value.replace(
            "SEMINAR-",
            "S-"
        );
    }

    if (value.startsWith("LAB-")) {
        return value.replace(
            "LAB-",
            "L-"
        );
    }

    return value;
}


function findReadingForRoom(
    readings,
    room
) {
    if (
        !Array.isArray(readings) ||
        readings.length === 0
    ) {
        return null;
    }

    const roomCode =
        String(
            getRoomNumber(room)
        )
            .trim()
            .toUpperCase();


    const matching =
        readings.filter(
            (reading) => {

                const readingRoom =
                    valueOf(
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
                    typeof readingRoom ===
                    "object" &&
                    readingRoom !== null
                ) {

                    const nestedRoomCode =
                        valueOf(
                            readingRoom,
                            [
                                "roomCode",
                                "roomNumber",
                                "roomNo",
                                "code",
                                "name",
                            ],
                            null
                        );


                    return (
                        String(
                            nestedRoomCode
                        )
                            .trim()
                            .toUpperCase() ===
                        roomCode
                    );
                }


                return (
                    String(
                        readingRoom
                    )
                        .trim()
                        .toUpperCase() ===
                    roomCode
                );

            }
        );


    if (matching.length > 0) {

        return matching
            .sort(
                (a, b) =>
                    new Date(
                        a.recordedAt || 0
                    ) -
                    new Date(
                        b.recordedAt || 0
                    )
            )
            .at(-1);

    }


    return null;
}


function calculateStatus(
    temperature,
    humidity
) {

    const temp =
        Number(temperature);

    const hum =
        Number(humidity);


    if (
        Number.isFinite(temp) &&
        temp >= 35
    ) {
        return "Critical";
    }


    if (
        Number.isFinite(hum) &&
        hum >= 85
    ) {
        return "Critical";
    }


    if (
        Number.isFinite(temp) &&
        temp >= 30
    ) {
        return "Warning";
    }


    if (
        Number.isFinite(hum) &&
        hum >= 75
    ) {
        return "Warning";
    }


    return "Normal";
}


function normalizeRoom(
    room,
    reading = null
) {

    const roomNumber =
        getRoomNumber(room);


    const temperatureValue =
        valueOf(
            reading,
            [
                "temperature",
                "temp",
            ],
            null
        );


    const humidityValue =
        valueOf(
            reading,
            [
                "humidity",
                "hum",
            ],
            null
        );


    const lightValue =
        valueOf(
            reading,
            [
                "lightLevel",
                "light",
            ],
            null
        );


    const motionValue =
        valueOf(
            reading,
            [
                "motionDetected",
                "motion",
            ],
            null
        );


    const temperature =
        temperatureValue !== null &&
        Number.isFinite(
            Number(
                temperatureValue
            )
        )
            ? Number(
                temperatureValue
            )
            : null;


    const humidity =
        humidityValue !== null &&
        Number.isFinite(
            Number(
                humidityValue
            )
        )
            ? Number(
                humidityValue
            )
            : null;


    const lightLevel =
        lightValue !== null &&
        Number.isFinite(
            Number(lightValue)
        )
            ? Number(lightValue)
            : null;


    const building =
        valueOf(
            room,
            [
                "building",
                "buildingName",
                "block",
            ],
            "-"
        );


    const floor =
        valueOf(
            room,
            [
                "floor",
                "floorNumber",
            ],
            "-"
        );


    const type =
        valueOf(
            room,
            [
                "name",
                "type",
                "roomType",
            ],
            "Room"
        );


    const dataSource =
        String(
            room?.dataSource ||
            "MANUAL"
        )
            .trim()
            .toUpperCase();


    let status = "No Data";


    if (
        temperature !== null ||
        humidity !== null
    ) {

        status =
            calculateStatus(
                temperature,
                humidity
            );

    }


    return {
        ...room,

        roomNumber,

        building,

        floor,

        type,

        temperature,

        humidity,

        lightLevel,

        motionDetected:
        motionValue,

        status,

        dataSource,

        recordedAt:
            reading?.recordedAt ||
            null,
    };
}


function Rooms() {

    const [rooms, setRooms] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingRoom, setEditingRoom] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


    const [form, setForm] =
        useState({
            roomCode: "",
            name: "",
            building: "",
            floor: "",
            dataSource: "MANUAL",
        });


    const loadRooms = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                roomsResponse,
                readingsResponse,
            ] = await Promise.all([

                api.get(
                    "/api/rooms"
                ),

                api.get(
                    "/api/sensor/readings"
                ),

            ]);


            const backendRooms =
                Array.isArray(
                    roomsResponse.data
                )
                    ? roomsResponse.data
                    : [];


            const readings =
                Array.isArray(
                    readingsResponse.data
                )
                    ? readingsResponse.data
                    : [];


            const normalizedRooms =
                backendRooms.map(
                    (room) => {

                        const latestReading =
                            findReadingForRoom(
                                readings,
                                room
                            );


                        return normalizeRoom(
                            room,
                            latestReading
                        );

                    }
                );


            setRooms(
                normalizedRooms
            );


        } catch (err) {

            console.error(
                "Room loading error:",
                err
            );


            if (
                err.response?.status ===
                401
            ) {

                setError(
                    "Session expired. Please login again."
                );

            } else if (
                err.response?.status ===
                403
            ) {

                setError(
                    "You do not have permission to access rooms."
                );

            } else {

                setError(
                    "Unable to load rooms from server."
                );

            }


            setRooms([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRooms();


        const interval =
            setInterval(
                loadRooms,
                10000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, []);


    const filteredRooms =
        rooms.filter(
            (room) => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                if (!searchText) {
                    return true;
                }


                return [
                    room.roomNumber,
                    room.building,
                    room.floor,
                    room.type,
                    room.dataSource,
                ]
                    .filter(Boolean)
                    .some(
                        (value) =>
                            String(value)
                                .toLowerCase()
                                .includes(
                                    searchText
                                )
                    );

            }
        );


    const openAddModal = () => {

        setEditingRoom(null);


        setForm({
            roomCode: "",
            name: "",
            building: "",
            floor: "",
            dataSource: "MANUAL",
        });


        setError("");

        setShowModal(true);

    };


    const openEditModal = (
        room
    ) => {

        setEditingRoom(room);


        setForm({

            roomCode:
                room.roomCode ||
                room.roomNumber ||
                "",

            name:
                room.name ||
                "",

            building:
                room.building ||
                "",

            floor:
                room.floor !== null &&
                room.floor !== undefined
                    ? room.floor
                    : "",

            dataSource:
                room.dataSource ||
                "MANUAL",

        });


        setError("");

        setShowModal(true);

    };


    const closeModal = () => {

        if (saving) {
            return;
        }


        setShowModal(false);

        setEditingRoom(null);

    };


    const handleFormChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    const saveRoom = async (
        event
    ) => {

        event.preventDefault();


        if (
            !form.roomCode.trim()
        ) {

            setError(
                "Room number is required."
            );

            return;

        }


        if (
            !form.name.trim()
        ) {

            setError(
                "Room name is required."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");


            const payload = {

                roomCode:
                    form.roomCode.trim(),

                name:
                    form.name.trim(),

                building:
                    form.building.trim(),

                floor:
                    form.floor === ""
                        ? null
                        : Number(
                            form.floor
                        ),

                dataSource:
                form.dataSource,

            };


            if (editingRoom) {

                await api.put(
                    `/api/rooms/${editingRoom.id}`,
                    payload
                );

            } else {

                await api.post(
                    "/api/rooms",
                    payload
                );

            }


            closeModal();

            await loadRooms();


        } catch (err) {

            console.error(
                "Room save error:",
                err
            );


            if (
                err.response?.status ===
                403
            ) {

                setError(
                    "You do not have permission to modify rooms."
                );

            } else if (
                err.response?.status ===
                400
            ) {

                setError(
                    "Invalid room information."
                );

            } else {

                setError(
                    "Unable to save room. Please check the backend."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    const getStatusClass = (
        status
    ) => {

        const value =
            String(status)
                .toLowerCase();


        if (
            value === "critical"
        ) {
            return "critical";
        }


        if (
            value === "warning"
        ) {
            return "warning";
        }


        if (
            value === "no data"
        ) {
            return "muted";
        }


        return "normal";

    };


    const getTemperatureClass = (
        temperature
    ) => {

        if (
            temperature === null
        ) {
            return "muted";
        }


        if (
            temperature >= 35
        ) {
            return "critical-text";
        }


        if (
            temperature >= 30
        ) {
            return "warning-text";
        }


        return "normal-text";

    };


    const getHumidityClass = (
        humidity
    ) => {

        if (
            humidity === null
        ) {
            return "muted";
        }


        if (
            humidity >= 85
        ) {
            return "critical-text";
        }


        if (
            humidity >= 75
        ) {
            return "warning-text";
        }


        return "normal-text";

    };


    const getSourceLabel = (
        source
    ) => {

        if (
            source === "IOT" ||
            source === "REAL" ||
            source === "ESP32"
        ) {
            return "REAL IoT";
        }


        if (
            source === "SIMULATED" ||
            source === "SIMULATION" ||
            source === "DEMO"
        ) {
            return "SIMULATED";
        }


        return "MANUAL";

    };


    const getSourceClass = (
        source
    ) => {

        if (
            source === "IOT" ||
            source === "REAL" ||
            source === "ESP32"
        ) {
            return "iot";
        }


        if (
            source === "SIMULATED" ||
            source === "SIMULATION" ||
            source === "DEMO"
        ) {
            return "simulated";
        }


        return "manual";

    };


    return (

        <div className="rooms-page">


            {/* TOOLBAR */}

            <div className="rooms-toolbar">

                <div className="rooms-search">

                    <Search size={17} />

                    <input
                        type="text"
                        value={search}
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search rooms..."
                    />

                </div>


                <div className="rooms-toolbar-actions">

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={
                            loadRooms
                        }
                        disabled={loading}
                    >

                        <RefreshCw
                            size={15}
                            className={
                                loading
                                    ? "refresh-spinning"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        className="add-room-btn"
                        onClick={
                            openAddModal
                        }
                    >

                        <Plus size={16} />

                        Add Room

                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="rooms-error">
                    {error}
                </div>

            )}


            {/* TABLE */}

            <div className="rooms-table-card">

                <div className="rooms-table-wrapper">

                    <table className="rooms-table">

                        <thead>

                        <tr>

                            <th>
                                Room No.
                            </th>

                            <th>
                                Building
                            </th>

                            <th>
                                Floor
                            </th>

                            <th>
                                Type
                            </th>

                            <th>
                                Source
                            </th>

                            <th>
                                Occupancy
                            </th>

                            <th>
                                Temp.
                            </th>

                            <th>
                                Humidity
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="rooms-loading"
                                >
                                    Loading rooms...
                                </td>

                            </tr>

                        ) : filteredRooms.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="rooms-loading"
                                >

                                    {search
                                        ? "No rooms found."
                                        : "No rooms available."
                                    }

                                </td>

                            </tr>

                        ) : (

                            filteredRooms.map(
                                (room) => {

                                    const shortRoom =
                                        getShortRoomNumber(
                                            room.roomNumber
                                        );


                                    return (

                                        <tr
                                            key={
                                                room.id
                                            }
                                            className="live-room-row"
                                        >

                                            {/* ROOM */}

                                            <td>

                                                <div className="room-name-cell">

                                                    <strong
                                                        title={
                                                            room.roomNumber
                                                        }
                                                    >
                                                        {
                                                            shortRoom
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            {/* BUILDING */}

                                            <td>
                                                {
                                                    room.building
                                                }
                                            </td>


                                            {/* FLOOR */}

                                            <td>
                                                {
                                                    room.floor
                                                }
                                            </td>


                                            {/* TYPE */}

                                            <td>
                                                {
                                                    room.type
                                                }
                                            </td>


                                            {/* SOURCE */}

                                            <td>

                                                    <span
                                                        className={
                                                            `source-badge ${getSourceClass(
                                                                room.dataSource
                                                            )}`
                                                        }
                                                    >

                                                        <span className="source-dot"></span>

                                                        {
                                                            getSourceLabel(
                                                                room.dataSource
                                                            )
                                                        }

                                                    </span>

                                            </td>


                                            {/* OCCUPANCY */}

                                            <td>

                                                    <span className="muted">
                                                        --
                                                    </span>

                                            </td>


                                            {/* TEMPERATURE */}

                                            <td>

                                                    <span
                                                        className={
                                                            getTemperatureClass(
                                                                room.temperature
                                                            )
                                                        }
                                                    >

                                                        {
                                                            room.temperature !==
                                                            null
                                                                ? `${Number(
                                                                    room.temperature
                                                                ).toFixed(
                                                                    1
                                                                )}°C`
                                                                : "--"
                                                        }

                                                    </span>

                                            </td>


                                            {/* HUMIDITY */}

                                            <td>

                                                    <span
                                                        className={
                                                            getHumidityClass(
                                                                room.humidity
                                                            )
                                                        }
                                                    >

                                                        {
                                                            room.humidity !==
                                                            null
                                                                ? `${Number(
                                                                    room.humidity
                                                                ).toFixed(
                                                                    0
                                                                )}%`
                                                                : "--"
                                                        }

                                                    </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                    <span
                                                        className={
                                                            `status-badge ${getStatusClass(
                                                                room.status
                                                            )}`
                                                        }
                                                    >

                                                        <span className="status-dot"></span>

                                                        {
                                                            room.status
                                                        }

                                                    </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="room-actions">

                                                    <button
                                                        type="button"
                                                        title="View room"
                                                    >
                                                        <Eye size={16} />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        title="Edit room"
                                                        onClick={() =>
                                                            openEditModal(
                                                                room
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div
                    className="room-modal-overlay"
                    onMouseDown={(
                        event
                    ) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div
                        className="room-modal"
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="room-modal-header">

                            <div>

                                <h2>

                                    {editingRoom
                                        ? "Edit Room"
                                        : "Add Room"
                                    }

                                </h2>


                                <p>

                                    {editingRoom
                                        ? "Update room information"
                                        : "Add a new campus room"
                                    }

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                            >

                                <X size={17} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="room-form"
                            onSubmit={
                                saveRoom
                            }
                        >


                            <div className="room-form-row">


                                <div className="room-form-group">

                                    <label>
                                        Room Number
                                    </label>

                                    <input
                                        type="text"
                                        name="roomCode"
                                        value={
                                            form.roomCode
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="ROOM-204"
                                        required
                                    />

                                </div>


                                <div className="room-form-group">

                                    <label>
                                        Room Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Classroom"
                                        required
                                    />

                                </div>

                            </div>


                            <div className="room-form-row">


                                <div className="room-form-group">

                                    <label>
                                        Building
                                    </label>

                                    <input
                                        type="text"
                                        name="building"
                                        value={
                                            form.building
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Main Building"
                                    />

                                </div>


                                <div className="room-form-group">

                                    <label>
                                        Floor
                                    </label>

                                    <input
                                        type="number"
                                        name="floor"
                                        value={
                                            form.floor
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="2"
                                        min="0"
                                    />

                                </div>

                            </div>


                            {/* DATA SOURCE */}

                            <div className="room-form-group">

                                <label>
                                    Data Source
                                </label>

                                <select
                                    name="dataSource"
                                    value={
                                        form.dataSource
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                >

                                    <option value="IOT">
                                        Real IoT
                                    </option>

                                    <option value="SIMULATED">
                                        Simulated
                                    </option>

                                    <option value="MANUAL">
                                        Manual
                                    </option>

                                </select>

                            </div>


                            {/* FOOTER */}

                            <div className="room-modal-footer">

                                <button
                                    type="button"
                                    className="modal-cancel"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-save"
                                    disabled={
                                        saving
                                    }
                                >

                                    <Save size={15} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Room"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Rooms;