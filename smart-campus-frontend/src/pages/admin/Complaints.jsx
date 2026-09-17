import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
    RefreshCw,
    Search,
    Eye,
    AlertTriangle,
    ClipboardList,
    UserCheck,
    Clock3,
    CheckCircle2
} from "lucide-react";

import "../../styles/complaints.css";


function Complaints() {

    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedComplaint, setSelectedComplaint] =
        useState(null);

    const [updatingStatus, setUpdatingStatus] =
        useState(false);


    // =========================
    // LOAD COMPLAINTS
    // =========================

    const loadComplaints = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/api/complaints");


            setComplaints(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (err) {

            console.error(
                "Failed to load complaints:",
                err
            );


            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "You do not have permission to access complaints."
                );

            } else {

                setError(
                    "Unable to load complaints. Please check the backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadComplaints();

    }, []);


    // =========================
    // VIEW COMPLAINT
    // =========================

    const handleViewComplaint = (complaint) => {

        setSelectedComplaint(
            complaint
        );

    };


    const closeComplaintModal = () => {

        setSelectedComplaint(null);

    };


    // =========================
    // UPDATE STATUS
    // =========================

    const handleStatusChange = async (
        status
    ) => {

        if (!selectedComplaint) {
            return;
        }


        try {

            setUpdatingStatus(true);
            setError("");


            const response =
                await api.put(

                    `/api/complaints/${selectedComplaint.id}/status`,

                    null,

                    {
                        params: {
                            status
                        }
                    }

                );


            const updatedComplaint =
                response.data;


            setComplaints(
                (previousComplaints) =>

                    previousComplaints.map(
                        (complaint) =>

                            complaint.id ===
                            updatedComplaint.id

                                ? updatedComplaint

                                : complaint
                    )

            );


            setSelectedComplaint(
                updatedComplaint
            );


        } catch (err) {

            console.error(
                "Failed to update complaint status:",
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
                    "You do not have permission to update complaint status."
                );

            } else {

                setError(
                    "Unable to update complaint status."
                );

            }

        } finally {

            setUpdatingStatus(false);

        }

    };


    // =========================
    // SEARCH
    // =========================

    const filteredComplaints =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            if (!keyword) {
                return complaints;
            }


            return complaints.filter(
                (complaint) => {

                    return (

                        String(
                            complaint.id ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.title ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.roomCode ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.studentName ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.technicianName ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.technicianUsername ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.category ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.priority ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)


                        ||


                        String(
                            complaint.status ?? ""
                        )
                            .toLowerCase()
                            .includes(keyword)

                    );

                }
            );

        }, [
            complaints,
            search
        ]);


    // =========================
    // STATISTICS
    // =========================

    const stats =
        useMemo(() => {

            return {

                open:
                complaints.filter(
                    (item) =>
                        item.status ===
                        "PENDING"
                ).length,


                assigned:
                complaints.filter(
                    (item) =>
                        item.status ===
                        "ASSIGNED"
                ).length,


                inProgress:
                complaints.filter(
                    (item) =>
                        item.status ===
                        "IN_PROGRESS"
                ).length,


                resolved:
                complaints.filter(
                    (item) =>
                        item.status ===
                        "RESOLVED"
                ).length,


                highPriority:
                complaints.filter(
                    (item) =>

                        item.priority ===
                        "HIGH"

                        ||

                        item.priority ===
                        "CRITICAL"
                ).length

            };

        }, [
            complaints
        ]);


    // =========================
    // FORMAT CATEGORY
    // =========================

    const formatCategory =
        (category) => {

            if (!category) {
                return "—";
            }


            return category
                .replaceAll(
                    "_",
                    " "
                )
                .replace(
                    "AC COOLING",
                    "AC / Cooling"
                )
                .replace(
                    "NETWORK IT",
                    "Network / IT"
                )
                .toLowerCase()
                .replace(
                    /\b\w/g,
                    (char) =>
                        char.toUpperCase()
                );

        };


    // =========================
    // FORMAT DATE
    // =========================

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
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass =
        (status) => {

            switch (status) {

                case "PENDING":
                    return "pending";

                case "ASSIGNED":
                    return "assigned";

                case "IN_PROGRESS":
                    return "progress";

                case "RESOLVED":
                    return "resolved";

                default:
                    return "unknown";

            }

        };


    // =========================
    // PRIORITY CLASS
    // =========================

    const getPriorityClass =
        (priority) => {

            switch (priority) {

                case "LOW":
                    return "low";

                case "MEDIUM":
                    return "medium";

                case "HIGH":
                    return "high";

                case "CRITICAL":
                    return "critical";

                default:
                    return "unknown";

            }

        };


    return (

        <div className="complaints-page">


            {/* =========================
                STATISTICS
            ========================= */}

            <section className="complaint-stats">


                <div className="complaint-stat-card">

                    <div className="complaint-stat-icon open-icon">

                        <ClipboardList size={20} />

                    </div>


                    <div>

                        <span>
                            Open
                        </span>

                        <strong>
                            {stats.open}
                        </strong>

                    </div>

                </div>


                <div className="complaint-stat-card">

                    <div className="complaint-stat-icon assigned-icon">

                        <UserCheck size={20} />

                    </div>


                    <div>

                        <span>
                            Assigned
                        </span>

                        <strong>
                            {stats.assigned}
                        </strong>

                    </div>

                </div>


                <div className="complaint-stat-card">

                    <div className="complaint-stat-icon progress-icon">

                        <Clock3 size={20} />

                    </div>


                    <div>

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {stats.inProgress}
                        </strong>

                    </div>

                </div>


                <div className="complaint-stat-card">

                    <div className="complaint-stat-icon resolved-icon">

                        <CheckCircle2 size={20} />

                    </div>


                    <div>

                        <span>
                            Resolved
                        </span>

                        <strong>
                            {stats.resolved}
                        </strong>

                    </div>

                </div>


                <div className="complaint-stat-card">

                    <div className="complaint-stat-icon priority-icon">

                        <AlertTriangle size={20} />

                    </div>


                    <div>

                        <span>
                            High Priority
                        </span>

                        <strong>
                            {stats.highPriority}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =========================
                TOOLBAR
            ========================= */}

            <section className="complaints-toolbar">

                <div className="complaint-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search complaints..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                <button
                    className="complaint-refresh-btn"
                    onClick={
                        loadComplaints
                    }
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "refresh-spinning"
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

                <div className="complaint-error">

                    {error}

                </div>

            )}


            {/* =========================
                TABLE
            ========================= */}

            <section className="complaints-table-card">

                <div className="complaints-table-wrapper">

                    <table className="complaints-table">

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>
                                Complaint
                            </th>

                            <th>
                                Student
                            </th>

                            <th>
                                Room
                            </th>

                            <th>
                                Technician
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

                            <th>
                                Created
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="table-message"
                                >

                                    Loading complaints...

                                </td>

                            </tr>

                        ) : filteredComplaints.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="table-message"
                                >

                                    {search
                                        ? "No complaints found."
                                        : "No complaints available."
                                    }

                                </td>

                            </tr>

                        ) : (

                            filteredComplaints.map(
                                (complaint) => (

                                    <tr
                                        key={
                                            complaint.id
                                        }
                                    >


                                        <td>

                                                <span className="complaint-id">

                                                    #
                                                    {complaint.id}

                                                </span>

                                        </td>


                                        <td>

                                            <div className="complaint-title-cell">

                                                <strong>

                                                    {
                                                        complaint.title ||
                                                        "—"
                                                    }

                                                </strong>


                                                <small>

                                                    {
                                                        complaint.description

                                                            ? complaint.description.length > 55

                                                                ? `${complaint.description.slice(
                                                                    0,
                                                                    55
                                                                )}...`

                                                                : complaint.description

                                                            : "No description"
                                                    }

                                                </small>

                                            </div>

                                        </td>


                                        <td>

                                            {
                                                complaint.studentName ||
                                                "—"
                                            }

                                        </td>


                                        <td>

                                                <span className="room-code">

                                                    {
                                                        complaint.roomCode ||
                                                        "—"
                                                    }

                                                </span>

                                        </td>


                                        <td>

                                            {complaint.technicianName ? (

                                                <div className="technician-cell">

                                                    <strong>
                                                        {
                                                            complaint.technicianName
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            complaint.technicianUsername ||
                                                            "Technician"
                                                        }
                                                    </small>

                                                </div>

                                            ) : (

                                                <span className="unassigned-text">
                                                        Unassigned
                                                    </span>

                                            )}

                                        </td>


                                        <td>

                                            {
                                                formatCategory(
                                                    complaint.category
                                                )
                                            }

                                        </td>


                                        <td>

                                                <span
                                                    className={
                                                        `priority-badge ${getPriorityClass(
                                                            complaint.priority
                                                        )}`
                                                    }
                                                >

                                                    {
                                                        complaint.priority ||
                                                        "—"
                                                    }

                                                </span>

                                        </td>


                                        <td>

                                                <span
                                                    className={
                                                        `status-badge ${getStatusClass(
                                                            complaint.status
                                                        )}`
                                                    }
                                                >

                                                    {
                                                        (
                                                            complaint.status ||
                                                            "—"
                                                        )
                                                            .replaceAll(
                                                                "_",
                                                                " "
                                                            )
                                                    }

                                                </span>

                                        </td>


                                        <td>

                                                <span className="created-date">

                                                    {
                                                        formatDate(
                                                            complaint.createdAt
                                                        )
                                                    }

                                                </span>

                                        </td>


                                        <td>

                                            <button
                                                className="view-complaint-btn"
                                                title="View complaint"
                                                onClick={() =>
                                                    handleViewComplaint(
                                                        complaint
                                                    )
                                                }
                                            >

                                                <Eye size={17} />

                                            </button>

                                        </td>


                                    </tr>

                                )
                            )

                        )}

                        </tbody>

                    </table>

                </div>


                <div className="complaints-table-footer">

                    Showing{" "}

                    <strong>
                        {
                            filteredComplaints.length
                        }
                    </strong>{" "}

                    complaint
                    {
                        filteredComplaints.length !== 1
                            ? "s"
                            : ""
                    }

                </div>

            </section>


            {/* =========================
                COMPLAINT DETAILS MODAL
            ========================= */}

            {selectedComplaint && (

                <div
                    className="complaint-modal-overlay"
                    onClick={
                        closeComplaintModal
                    }
                >

                    <div
                        className="complaint-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="complaint-modal-header">

                            <div>

                                <span className="modal-complaint-id">

                                    Complaint #
                                    {
                                        selectedComplaint.id
                                    }

                                </span>


                                <h2>

                                    {
                                        selectedComplaint.title ||
                                        "Complaint Details"
                                    }

                                </h2>

                            </div>


                            <button
                                className="modal-close-btn"
                                onClick={
                                    closeComplaintModal
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="complaint-modal-body">


                            <div className="complaint-detail-grid">


                                <div className="complaint-detail-item">

                                    <span>
                                        Student
                                    </span>

                                    <strong>
                                        {
                                            selectedComplaint.studentName ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Room
                                    </span>

                                    <strong>
                                        {
                                            selectedComplaint.roomCode ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {
                                            formatCategory(
                                                selectedComplaint.category
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Priority
                                    </span>

                                    <span
                                        className={
                                            `priority-badge ${getPriorityClass(
                                                selectedComplaint.priority
                                            )}`
                                        }
                                    >

                                        {
                                            selectedComplaint.priority ||
                                            "—"
                                        }

                                    </span>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Technician
                                    </span>


                                    {selectedComplaint.technicianName ? (

                                        <strong>

                                            {
                                                selectedComplaint.technicianName
                                            }

                                            <small
                                                style={{
                                                    display: "block",
                                                    marginTop: "4px",
                                                    fontWeight: 400
                                                }}
                                            >

                                                {
                                                    selectedComplaint.technicianUsername ||
                                                    ""
                                                }

                                            </small>

                                        </strong>

                                    ) : (

                                        <strong>
                                            Unassigned
                                        </strong>

                                    )}

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Current Status
                                    </span>

                                    <span
                                        className={
                                            `status-badge ${getStatusClass(
                                                selectedComplaint.status
                                            )}`
                                        }
                                    >

                                        {
                                            (
                                                selectedComplaint.status ||
                                                "—"
                                            )
                                                .replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }

                                    </span>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                selectedComplaint.createdAt
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="complaint-detail-item">

                                    <span>
                                        Updated
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                selectedComplaint.updatedAt
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="complaint-description-section">

                                <span>
                                    Description
                                </span>

                                <p>

                                    {
                                        selectedComplaint.description ||
                                        "No description available."
                                    }

                                </p>

                            </div>


                            {/* STATUS */}

                            <div className="complaint-status-section">

                                <span>
                                    Update Status
                                </span>


                                <div className="status-actions">


                                    <button
                                        className={
                                            selectedComplaint.status ===
                                            "PENDING"

                                                ? "status-action active"

                                                : "status-action"
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "PENDING"
                                            )
                                        }
                                    >

                                        Pending

                                    </button>


                                    <button
                                        className={
                                            selectedComplaint.status ===
                                            "ASSIGNED"

                                                ? "status-action active"

                                                : "status-action"
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "ASSIGNED"
                                            )
                                        }
                                    >

                                        Assigned

                                    </button>


                                    <button
                                        className={
                                            selectedComplaint.status ===
                                            "IN_PROGRESS"

                                                ? "status-action active"

                                                : "status-action"
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "IN_PROGRESS"
                                            )
                                        }
                                    >

                                        In Progress

                                    </button>


                                    <button
                                        className={
                                            selectedComplaint.status ===
                                            "RESOLVED"

                                                ? "status-action active resolved-action"

                                                : "status-action"
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                "RESOLVED"
                                            )
                                        }
                                    >

                                        Resolved

                                    </button>


                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Complaints;