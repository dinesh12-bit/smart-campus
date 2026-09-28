import { useEffect, useState } from "react";

import {
    MessageSquare,
    Search,
    Eye,
    X,
    MapPin,
    UserRound,
    Tag,
    Flag,
    CalendarDays,
    CircleAlert,
    CheckCircle,
    ChevronDown,
    Image as ImageIcon,
} from "lucide-react";

import api from "../../api/axios";

import "../../styles/technicianComplaints.css";


function Complaints() {

    // =========================================================
    // GET CURRENT TECHNICIAN ID
    // =========================================================

    const getStoredUser = () => {

        const sessionUser =
            sessionStorage.getItem("user");

        const localUser =
            localStorage.getItem("user");

        const user =
            sessionUser ||
            localUser;

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch {
            return null;
        }
    };


    const storedUser =
        getStoredUser();


    const technicianId =
        Number(
            storedUser?.id ||
            storedUser?.userId ||
            sessionStorage.getItem("userId") ||
            localStorage.getItem("userId")
        );


    // =========================================================
    // STATES
    // =========================================================

    const [complaints, setComplaints] =
        useState([]);

    const [filteredComplaints, setFilteredComplaints] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [priorityFilter, setPriorityFilter] =
        useState("ALL");

    const [selectedComplaint, setSelectedComplaint] =
        useState(null);

    const [selectedStatus, setSelectedStatus] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [updating, setUpdating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [openDropdown, setOpenDropdown] =
        useState(null);


    // =========================================================
    // LOAD COMPLAINTS
    // =========================================================

    const loadComplaints = async () => {

        try {

            setLoading(true);
            setError("");


            /*
             * Get all complaints.
             *
             * Then frontend keeps:
             *
             * 1. complaints assigned to current technician
             * 2. unassigned complaints
             *
             * This allows a technician to see new complaints.
             */

            const response =
                await api.get(
                    "/api/complaints"
                );


            const allComplaints =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            const visibleComplaints =
                allComplaints.filter(
                    (complaint) => {

                        const assignedTechnicianId =
                            complaint.technicianId;


                        const isUnassigned =
                            assignedTechnicianId === null ||
                            assignedTechnicianId === undefined;


                        const isAssignedToMe =
                            Number(
                                assignedTechnicianId
                            ) === Number(
                                technicianId
                            );


                        return (
                            isUnassigned ||
                            isAssignedToMe
                        );
                    }
                );


            setComplaints(
                visibleComplaints
            );

        } catch (err) {

            console.error(
                "Failed to load complaints:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to load complaints."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadComplaints();

    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    useEffect(() => {

        let result =
            [...complaints];


        const searchText =
            search
                .trim()
                .toLowerCase();


        // SEARCH

        if (searchText) {

            result =
                result.filter(
                    (complaint) => {

                        const values = [

                            complaint.id,

                            complaint.title,

                            complaint.description,

                            complaint.studentName,

                            complaint.roomCode,

                            complaint.category,

                            complaint.priority,

                            complaint.status,

                        ];


                        return values
                            .filter(
                                (value) =>
                                    value !== null &&
                                    value !== undefined
                            )
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
        }


        // STATUS

        if (
            statusFilter !==
            "ALL"
        ) {

            result =
                result.filter(
                    (complaint) =>
                        complaint.status ===
                        statusFilter
                );
        }


        // PRIORITY

        if (
            priorityFilter !==
            "ALL"
        ) {

            result =
                result.filter(
                    (complaint) =>
                        complaint.priority ===
                        priorityFilter
                );
        }


        setFilteredComplaints(
            result
        );

    }, [
        complaints,
        search,
        statusFilter,
        priorityFilter,
    ]);


    // =========================================================
    // OPEN DETAILS
    // =========================================================

    const openComplaint = (
        complaint
    ) => {

        setSelectedComplaint(
            complaint
        );

        setSelectedStatus(
            complaint.status || ""
        );

        setOpenDropdown(null);
    };


    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    const closeComplaint = () => {

        setSelectedComplaint(
            null
        );

        setSelectedStatus("");
    };


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    const updateComplaintStatus =
        async () => {

            if (
                !selectedComplaint ||
                !selectedStatus
            ) {
                return;
            }


            if (
                selectedStatus ===
                selectedComplaint.status
            ) {
                return;
            }


            try {

                setUpdating(true);


                await api.put(
                    `/api/complaints/${selectedComplaint.id}/status`,
                    null,
                    {
                        params: {
                            status:
                            selectedStatus,
                        },
                    }
                );


                await loadComplaints();


                /*
                 * Get latest complaint data
                 * for modal.
                 */

                const response =
                    await api.get(
                        "/api/complaints"
                    );


                const allComplaints =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                const updated =
                    allComplaints.find(
                        (complaint) =>
                            Number(
                                complaint.id
                            ) ===
                            Number(
                                selectedComplaint.id
                            )
                    );


                if (updated) {

                    setSelectedComplaint(
                        updated
                    );

                    setSelectedStatus(
                        updated.status || ""
                    );
                }


            } catch (err) {

                console.error(
                    "Failed to update status:",
                    err
                );

                alert(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Unable to update complaint status."
                );

            } finally {

                setUpdating(false);
            }
        };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (
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


        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================================================
    // FORMAT DATE TIME
    // =========================================================

    const formatDateTime = (
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


        return date.toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // =========================================================
    // FORMAT TEXT
    // =========================================================

    const formatText = (
        value
    ) => {

        if (!value) {
            return "--";
        }


        return String(value)
            .replaceAll(
                "_",
                " "
            )
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {

        return `complaint-status-${String(
            status || ""
        )
            .toLowerCase()
            .replaceAll(
                "_",
                "-"
            )}`;
    };


    // =========================================================
    // PRIORITY CLASS
    // =========================================================

    const getPriorityClass = (
        priority
    ) => {

        return `complaint-priority-${String(
            priority || ""
        ).toLowerCase()}`;
    };


    // =========================================================
    // CHECK UNASSIGNED
    // =========================================================

    const isUnassigned = (complaint) => {
        if (!complaint) {
            return false;
        }

        return (
            (complaint.technicianId === null ||
                complaint.technicianId === undefined) &&
            complaint.status !== "RESOLVED"
        );
    };


    // =========================================================
    // IMAGE SOURCE
    // =========================================================

    const getImageSource = (
        imageData
    ) => {

        if (!imageData) {
            return null;
        }


        /*
         * If backend already sends:
         *
         * data:image/jpeg;base64,...
         *
         * use it directly.
         */

        if (
            String(
                imageData
            ).startsWith(
                "data:image"
            )
        ) {

            return imageData;
        }


        /*
         * Otherwise assume raw Base64.
         */

        return `data:image/jpeg;base64,${imageData}`;
    };


    // =========================================================
    // COUNTS
    // =========================================================

    const totalCount =
        complaints.length;


    const pendingCount =
        complaints.filter(
            (complaint) =>
                complaint.status ===
                "PENDING"
        ).length;


    const inProgressCount =
        complaints.filter(
            (complaint) =>
                complaint.status ===
                "IN_PROGRESS"
        ).length;


    const resolvedCount =
        complaints.filter(
            (complaint) =>
                complaint.status ===
                "RESOLVED"
        ).length;


    // =========================================================
    // OPTIONS
    // =========================================================

    const statusOptions = [

        ["ALL", "All Status"],

        ["PENDING", "Pending"],

        ["ASSIGNED", "Assigned"],

        ["IN_PROGRESS", "In Progress"],

        ["RESOLVED", "Resolved"],

    ];


    const priorityOptions = [

        ["ALL", "All Priority"],

        ["LOW", "Low"],

        ["MEDIUM", "Medium"],

        ["HIGH", "High"],

        ["CRITICAL", "Critical"],

    ];


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="technician-complaints-page">

                <div className="technician-complaints-loading">

                    <div className="technician-complaints-spinner"></div>

                    <p>
                        Loading complaints...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            className="technician-complaints-page"

            onClick={() =>
                setOpenDropdown(null)
            }
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="technician-complaints-header">

                <div>

                    <h1>
                        Complaints
                    </h1>

                    <p>
                        View and manage complaints assigned to you.
                    </p>

                </div>

            </div>


            {/* =================================================
                STATS
            ================================================= */}

            <div className="technician-complaints-stats">


                <div className="technician-complaint-stat-card">

                    <div className="complaint-stat-icon blue">

                        <MessageSquare size={18} />

                    </div>

                    <div>

                        <span>
                            Total Complaints
                        </span>

                        <strong>
                            {totalCount}
                        </strong>

                    </div>

                </div>


                <div className="technician-complaint-stat-card">

                    <div className="complaint-stat-icon orange">

                        <CircleAlert size={18} />

                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>

                    </div>

                </div>


                <div className="technician-complaint-stat-card">

                    <div className="complaint-stat-icon purple">

                        <MessageSquare size={18} />

                    </div>

                    <div>

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {inProgressCount}
                        </strong>

                    </div>

                </div>


                <div className="technician-complaint-stat-card">

                    <div className="complaint-stat-icon green">

                        <CheckCircle size={18} />

                    </div>

                    <div>

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {resolvedCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="technician-complaints-toolbar"

                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="technician-complaints-filters">


                    {/* SEARCH */}

                    <div className="technician-complaints-search-box">

                        <Search size={15} />

                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={search}

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* STATUS */}

                    <div className="technician-filter-dropdown">

                        <button
                            type="button"

                            className="technician-filter-dropdown-btn"

                            onClick={() =>
                                setOpenDropdown(
                                    openDropdown ===
                                    "status"
                                        ? null
                                        : "status"
                                )
                            }
                        >

                            <span>
                                {
                                    statusOptions.find(
                                        ([value]) =>
                                            value ===
                                            statusFilter
                                    )?.[1]
                                }
                            </span>

                            <ChevronDown
                                size={14}
                            />

                        </button>


                        {openDropdown ===
                            "status" && (

                                <div className="technician-filter-dropdown-menu">

                                    {statusOptions.map(
                                        ([value, label]) => (

                                            <button
                                                type="button"
                                                key={value}

                                                className={
                                                    statusFilter ===
                                                    value
                                                        ? "selected"
                                                        : ""
                                                }

                                                onClick={() => {

                                                    setStatusFilter(
                                                        value
                                                    );

                                                    setOpenDropdown(
                                                        null
                                                    );
                                                }}
                                            >

                                                {label}

                                            </button>

                                        )
                                    )}

                                </div>
                            )}

                    </div>


                    {/* PRIORITY */}

                    <div className="technician-filter-dropdown">

                        <button
                            type="button"

                            className="technician-filter-dropdown-btn"

                            onClick={() =>
                                setOpenDropdown(
                                    openDropdown ===
                                    "priority"
                                        ? null
                                        : "priority"
                                )
                            }
                        >

                            <span>
                                {
                                    priorityOptions.find(
                                        ([value]) =>
                                            value ===
                                            priorityFilter
                                    )?.[1]
                                }
                            </span>

                            <ChevronDown
                                size={14}
                            />

                        </button>


                        {openDropdown ===
                            "priority" && (

                                <div className="technician-filter-dropdown-menu">

                                    {priorityOptions.map(
                                        ([value, label]) => (

                                            <button
                                                type="button"
                                                key={value}

                                                className={
                                                    priorityFilter ===
                                                    value
                                                        ? "selected"
                                                        : ""
                                                }

                                                onClick={() => {

                                                    setPriorityFilter(
                                                        value
                                                    );

                                                    setOpenDropdown(
                                                        null
                                                    );
                                                }}
                                            >

                                                {label}

                                            </button>

                                        )
                                    )}

                                </div>
                            )}

                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="technician-complaints-error">

                    {error}

                </div>
            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="technician-complaints-table-card">

                <div className="technician-complaints-table-wrapper">

                    <table className="technician-complaints-table">

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>Complaint</th>

                            <th>Student</th>

                            <th>Room</th>

                            <th>Category</th>

                            <th>Priority</th>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredComplaints.length ===
                            0 && (

                                <tr>

                                    <td
                                        colSpan="9"
                                    >

                                        <div className="technician-complaints-empty">

                                            <MessageSquare
                                                size={30}
                                            />

                                            <strong>
                                                No complaints found
                                            </strong>

                                            <span>
                                                No complaints match your current filters.
                                            </span>

                                        </div>

                                    </td>

                                </tr>
                            )}


                        {filteredComplaints.map(
                            (complaint) => (

                                <tr
                                    key={
                                        complaint.id
                                    }
                                >

                                    {/* ID */}

                                    <td>

                                            <span className="technician-complaint-id">

                                                #
                                                {
                                                    complaint.id
                                                }

                                            </span>

                                    </td>


                                    {/* COMPLAINT */}

                                    <td>

                                        <div className="technician-complaint-title">

                                            {
                                                complaint.title ||
                                                "--"
                                            }

                                        </div>

                                        <div className="technician-complaint-description">

                                            {
                                                complaint.description ||
                                                "--"
                                            }

                                        </div>

                                    </td>


                                    {/* STUDENT */}

                                    <td>

                                        <div className="complaint-student-cell">

                                            <strong>
                                                {
                                                    complaint.studentName ||
                                                    "--"
                                                }
                                            </strong>

                                            <span>
                                                    Student
                                                </span>

                                        </div>

                                    </td>


                                    {/* ROOM */}

                                    <td>

                                        <div className="technician-complaint-room">

                                            <MapPin
                                                size={13}
                                            />

                                            {
                                                complaint.roomCode ||
                                                "--"
                                            }

                                        </div>

                                    </td>


                                    {/* CATEGORY */}

                                    <td>

                                        {
                                            formatText(
                                                complaint.category
                                            )
                                        }

                                    </td>


                                    {/* PRIORITY */}

                                    <td>

                                            <span
                                                className={`technician-complaint-badge ${getPriorityClass(
                                                    complaint.priority
                                                )}`}
                                            >

                                                {
                                                    formatText(
                                                        complaint.priority
                                                    )
                                                }

                                            </span>

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <div className="complaint-status-cell">

                                                <span
                                                    className={`technician-complaint-badge ${getStatusClass(
                                                        complaint.status
                                                    )}`}
                                                >

                                                    {
                                                        formatText(
                                                            complaint.status
                                                        )
                                                    }

                                                </span>


                                            {isUnassigned(
                                                complaint
                                            ) && (

                                                <span className="complaint-unassigned-label">

                                                        New

                                                    </span>
                                            )}

                                        </div>

                                    </td>


                                    {/* DATE */}

                                    <td>

                                        {
                                            formatDate(
                                                complaint.createdAt
                                            )
                                        }

                                    </td>


                                    {/* ACTION */}

                                    <td>

                                        <button
                                            type="button"

                                            className="technician-complaint-view"

                                            onClick={() =>
                                                openComplaint(
                                                    complaint
                                                )
                                            }

                                            title="View complaint"
                                        >

                                            <Eye
                                                size={15}
                                            />

                                        </button>

                                    </td>

                                </tr>
                            )
                        )}

                        </tbody>

                    </table>

                </div>


                <div className="technician-complaints-table-footer">

                    Showing{" "}
                    {filteredComplaints.length}
                    {" "}of{" "}
                    {complaints.length}
                    {" "}complaints

                </div>

            </div>


            {/* =================================================
                MODAL
            ================================================= */}

            {selectedComplaint && (

                <div
                    className="technician-complaint-modal-overlay"

                    onClick={
                        closeComplaint
                    }
                >

                    <div
                        className="technician-complaint-modal"

                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="technician-complaint-modal-header">

                            <div>

                                <h2>
                                    Complaint Details
                                </h2>

                                <span>
                                    Complaint #
                                    {
                                        selectedComplaint.id
                                    }
                                </span>

                            </div>


                            <button
                                type="button"

                                className="technician-complaint-modal-close"

                                onClick={
                                    closeComplaint
                                }
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {/* BODY */}

                        <div className="technician-complaint-modal-body">


                            {/* SUMMARY */}

                            <div className="complaint-modal-summary">

                                <div className="complaint-modal-icon">

                                    <MessageSquare
                                        size={22}
                                    />

                                </div>


                                <div className="complaint-modal-summary-content">

                                    <h3>
                                        {
                                            selectedComplaint.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            selectedComplaint.description
                                        }
                                    </p>

                                    <span>

                                        <MapPin
                                            size={13}
                                        />

                                        {
                                            selectedComplaint.roomCode ||
                                            "--"
                                        }

                                    </span>

                                </div>


                                <span
                                    className={`technician-complaint-badge ${getStatusClass(
                                        selectedComplaint.status
                                    )}`}
                                >

                                    {
                                        formatText(
                                            selectedComplaint.status
                                        )
                                    }

                                </span>

                            </div>


                            {/* DETAILS */}

                            <div className="complaint-detail-grid">


                                <div className="complaint-detail-card">

                                    <UserRound
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Student
                                        </span>

                                        <strong>
                                            {
                                                selectedComplaint.studentName ||
                                                "--"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="complaint-detail-card">

                                    <MapPin
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Room
                                        </span>

                                        <strong>
                                            {
                                                selectedComplaint.roomCode ||
                                                "--"
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="complaint-detail-card">

                                    <Tag
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {
                                                formatText(
                                                    selectedComplaint.category
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="complaint-detail-card">

                                    <Flag
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Priority
                                        </span>

                                        <strong
                                            className={`technician-complaint-badge ${getPriorityClass(
                                                selectedComplaint.priority
                                            )}`}
                                        >

                                            {
                                                formatText(
                                                    selectedComplaint.priority
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                <div className="complaint-detail-card">

                                    <CalendarDays
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Created
                                        </span>

                                        <strong>
                                            {
                                                formatDateTime(
                                                    selectedComplaint.createdAt
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="complaint-detail-card">

                                    <CalendarDays
                                        size={17}
                                    />

                                    <div>

                                        <span>
                                            Last Updated
                                        </span>

                                        <strong>
                                            {
                                                selectedComplaint.updatedAt
                                                    ? formatDateTime(
                                                        selectedComplaint.updatedAt
                                                    )
                                                    : "--"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="complaint-modal-description">

                                <div className="complaint-section-title">

                                    <MessageSquare
                                        size={16}
                                    />

                                    <strong>
                                        Complaint Description
                                    </strong>

                                </div>

                                <p>
                                    {
                                        selectedComplaint.description ||
                                        "--"
                                    }
                                </p>

                            </div>


                            {/* IMAGE */}

                            {selectedComplaint.imageData && (

                                <div className="complaint-modal-image-section">

                                    <div className="complaint-section-title">

                                        <ImageIcon
                                            size={16}
                                        />

                                        <strong>
                                            Attached Photo
                                        </strong>

                                    </div>


                                    <div className="complaint-modal-image-wrapper">

                                        <img
                                            src={
                                                getImageSource(
                                                    selectedComplaint.imageData
                                                )
                                            }

                                            alt="Complaint attachment"

                                            className="complaint-modal-image"

                                            onError={(
                                                event
                                            ) => {

                                                event.currentTarget.style.display =
                                                    "none";

                                            }}
                                        />

                                    </div>

                                </div>
                            )}


                            {!selectedComplaint.imageData && (

                                <div className="complaint-modal-no-image">

                                    <ImageIcon
                                        size={16}
                                    />

                                    <span>
                                        No photo attached to this complaint.
                                    </span>

                                </div>
                            )}


                            {/* STATUS */}

                            <div className="complaint-status-panel">

                                <div className="complaint-section-title">

                                    <CircleAlert
                                        size={16}
                                    />

                                    <strong>
                                        Complaint Status
                                    </strong>

                                </div>


                                <div className="complaint-current-status">

                                    <span>
                                        Current Status
                                    </span>


                                    <div>

                                        <span
                                            className={`technician-complaint-badge ${getStatusClass(
                                                selectedComplaint.status
                                            )}`}
                                        >

                                            {
                                                formatText(
                                                    selectedComplaint.status
                                                )
                                            }

                                        </span>


                                        {isUnassigned(
                                            selectedComplaint
                                        ) && (

                                            <span className="complaint-unassigned-modal-label">

                                                New Complaint

                                            </span>
                                        )}

                                    </div>

                                </div>


                                <div className="complaint-status-selector">

                                    <span className="complaint-status-label">
                                        Update Status
                                    </span>


                                    <div className="complaint-status-options">


                                        <button
                                            type="button"

                                            className={`complaint-status-option pending ${
                                                selectedStatus ===
                                                "PENDING"
                                                    ? "active"
                                                    : ""
                                            }`}

                                            onClick={() =>
                                                setSelectedStatus(
                                                    "PENDING"
                                                )
                                            }

                                            disabled={
                                                updating
                                            }
                                        >

                                            <span className="status-option-dot" />

                                            Pending

                                        </button>


                                        <button
                                            type="button"

                                            className={`complaint-status-option assigned ${
                                                selectedStatus ===
                                                "ASSIGNED"
                                                    ? "active"
                                                    : ""
                                            }`}

                                            onClick={() =>
                                                setSelectedStatus(
                                                    "ASSIGNED"
                                                )
                                            }

                                            disabled={
                                                updating
                                            }
                                        >

                                            <span className="status-option-dot" />

                                            Assigned

                                        </button>


                                        <button
                                            type="button"

                                            className={`complaint-status-option progress ${
                                                selectedStatus ===
                                                "IN_PROGRESS"
                                                    ? "active"
                                                    : ""
                                            }`}

                                            onClick={() =>
                                                setSelectedStatus(
                                                    "IN_PROGRESS"
                                                )
                                            }

                                            disabled={
                                                updating
                                            }
                                        >

                                            <span className="status-option-dot" />

                                            In Progress

                                        </button>


                                        <button
                                            type="button"

                                            className={`complaint-status-option resolved ${
                                                selectedStatus ===
                                                "RESOLVED"
                                                    ? "active"
                                                    : ""
                                            }`}

                                            onClick={() =>
                                                setSelectedStatus(
                                                    "RESOLVED"
                                                )
                                            }

                                            disabled={
                                                updating
                                            }
                                        >

                                            <span className="status-option-dot" />

                                            Resolved

                                        </button>

                                    </div>


                                    <button
                                        type="button"

                                        className="complaint-save-status"

                                        onClick={
                                            updateComplaintStatus
                                        }

                                        disabled={
                                            updating ||
                                            selectedStatus ===
                                            selectedComplaint.status
                                        }
                                    >

                                        <CheckCircle
                                            size={15}
                                        />

                                        {updating
                                            ? "Saving..."
                                            : "Save Status"}

                                    </button>

                                </div>


                                {selectedStatus ===
                                    selectedComplaint.status && (

                                        <div className="complaint-status-info">

                                            <CircleAlert
                                                size={14}
                                            />

                                            <span>

                                            Current status is already{" "}

                                                <strong>
                                                {
                                                    formatText(
                                                        selectedComplaint.status
                                                    )
                                                }
                                            </strong>

                                            .

                                        </span>

                                        </div>
                                    )}

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="technician-complaint-modal-footer">

                            <button
                                type="button"

                                className="complaint-close-button"

                                onClick={
                                    closeComplaint
                                }
                            >

                                Close

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Complaints;