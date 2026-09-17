import { useEffect, useState } from "react";
import {
    MessageSquare,
    RefreshCw,
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
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/technicianComplaints.css";

function Complaints() {
    const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;

    const technicianId = Number(storage.getItem("userId"));

    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const loadComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/complaints");

            const allComplaints = Array.isArray(response.data)
                ? response.data
                : [];

            const technicianComplaints = allComplaints.filter(
                (complaint) =>
                    Number(complaint.technicianId) === technicianId
            );

            setComplaints(technicianComplaints);
        } catch (err) {
            console.error("Failed to load complaints:", err);
            setError("Unable to load complaints.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        let result = [...complaints];

        const searchValue = search.trim().toLowerCase();

        if (searchValue) {
            result = result.filter((complaint) =>
                [
                    complaint.title,
                    complaint.description,
                    complaint.roomCode,
                    complaint.studentName,
                    complaint.category,
                    complaint.priority,
                    complaint.status,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue)
                    )
            );
        }

        if (statusFilter !== "ALL") {
            result = result.filter(
                (complaint) => complaint.status === statusFilter
            );
        }

        if (priorityFilter !== "ALL") {
            result = result.filter(
                (complaint) => complaint.priority === priorityFilter
            );
        }

        setFilteredComplaints(result);
    }, [complaints, search, statusFilter, priorityFilter]);

    const openComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setSelectedStatus(complaint.status);
        setOpenDropdown(null);
    };

    const closeComplaint = () => {
        setSelectedComplaint(null);
        setSelectedStatus("");
    };

    const updateComplaintStatus = async () => {
        if (!selectedComplaint || !selectedStatus) {
            return;
        }

        if (selectedStatus === selectedComplaint.status) {
            return;
        }

        try {
            setUpdating(true);

            await api.put(
                `/api/complaints/${selectedComplaint.id}/status`,
                null,
                {
                    params: {
                        status: selectedStatus,
                    },
                }
            );

            const response = await api.get("/api/complaints");

            const allComplaints = Array.isArray(response.data)
                ? response.data
                : [];

            const technicianComplaints = allComplaints.filter(
                (complaint) =>
                    Number(complaint.technicianId) === technicianId
            );

            setComplaints(technicianComplaints);

            const updatedComplaint = technicianComplaints.find(
                (complaint) =>
                    Number(complaint.id) ===
                    Number(selectedComplaint.id)
            );

            if (updatedComplaint) {
                setSelectedComplaint(updatedComplaint);
                setSelectedStatus(updatedComplaint.status);
            }

            alert("Complaint status updated successfully.");
        } catch (err) {
            console.error("Failed to update complaint status:", err);

            alert(
                err.response?.data?.message ||
                "Unable to update complaint status."
            );
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "--";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) return "--";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCategory = (category) => {
        if (!category) return "--";

        return category
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatStatus = (status) => {
        if (!status) return "--";

        return status.replaceAll("_", " ");
    };

    const statusClass = (status) => {
        return `complaint-status-${String(status || "")
            .toLowerCase()
            .replaceAll("_", "-")}`;
    };

    const priorityClass = (priority) => {
        return `complaint-priority-${String(
            priority || ""
        ).toLowerCase()}`;
    };

    const totalComplaints = complaints.length;

    const assignedCount = complaints.filter(
        (complaint) => complaint.status === "ASSIGNED"
    ).length;

    const inProgressCount = complaints.filter(
        (complaint) => complaint.status === "IN_PROGRESS"
    ).length;

    const resolvedCount = complaints.filter(
        (complaint) => complaint.status === "RESOLVED"
    ).length;

    const statusOptions = [
        ["ALL", "All Status"],
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

    if (loading) {
        return (
            <div className="technician-complaints-page">
                <div className="technician-complaints-loading">
                    <div className="technician-complaints-spinner"></div>
                    <p>Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="technician-complaints-page">
            <div className="technician-complaints-header">
                <div>
                    <h1>Complaints</h1>
                    <p>
                        View and manage complaints assigned to you.
                    </p>
                </div>
            </div>

            <div className="technician-complaints-stats">
                <div className="technician-complaint-stat-card">
                    <div className="complaint-stat-icon blue">
                        <MessageSquare size={18} />
                    </div>

                    <div>
                        <span>Total Complaints</span>
                        <strong>{totalComplaints}</strong>
                    </div>
                </div>

                <div className="technician-complaint-stat-card">
                    <div className="complaint-stat-icon orange">
                        <Flag size={18} />
                    </div>

                    <div>
                        <span>Assigned</span>
                        <strong>{assignedCount}</strong>
                    </div>
                </div>

                <div className="technician-complaint-stat-card">
                    <div className="complaint-stat-icon purple">
                        <RefreshCw size={18} />
                    </div>

                    <div>
                        <span>In Progress</span>
                        <strong>{inProgressCount}</strong>
                    </div>
                </div>

                <div className="technician-complaint-stat-card">
                    <div className="complaint-stat-icon green">
                        <CheckCircle size={18} />
                    </div>

                    <div>
                        <span>Resolved</span>
                        <strong>{resolvedCount}</strong>
                    </div>
                </div>
            </div>

            <div className="technician-complaints-toolbar">
                <div className="technician-complaints-filters">
                    <div className="technician-complaints-search-box">
                        <Search size={15} />

                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="technician-filter-dropdown">
                        <button
                            type="button"
                            className="technician-filter-dropdown-btn"
                            onClick={() =>
                                setOpenDropdown(
                                    openDropdown === "status"
                                        ? null
                                        : "status"
                                )
                            }
                        >
                            <span>
                                {
                                    statusOptions.find(
                                        ([value]) =>
                                            value === statusFilter
                                    )?.[1]
                                }
                            </span>

                            <ChevronDown size={14} />
                        </button>

                        {openDropdown === "status" && (
                            <div className="technician-filter-dropdown-menu">
                                {statusOptions.map(
                                    ([value, label]) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                statusFilter === value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() => {
                                                setStatusFilter(value);
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="technician-filter-dropdown">
                        <button
                            type="button"
                            className="technician-filter-dropdown-btn"
                            onClick={() =>
                                setOpenDropdown(
                                    openDropdown === "priority"
                                        ? null
                                        : "priority"
                                )
                            }
                        >
                            <span>
                                {
                                    priorityOptions.find(
                                        ([value]) =>
                                            value === priorityFilter
                                    )?.[1]
                                }
                            </span>

                            <ChevronDown size={14} />
                        </button>

                        {openDropdown === "priority" && (
                            <div className="technician-filter-dropdown-menu">
                                {priorityOptions.map(
                                    ([value, label]) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                priorityFilter === value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() => {
                                                setPriorityFilter(value);
                                                setOpenDropdown(null);
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

            <div className="technician-complaints-table-card">
                {error && (
                    <div className="technician-complaints-error">
                        {error}
                    </div>
                )}

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
                        {filteredComplaints.length === 0 && (
                            <tr>
                                <td colSpan="9">
                                    <div className="technician-complaints-empty">
                                        <MessageSquare size={30} />

                                        <strong>
                                            No complaints found
                                        </strong>

                                        <span>
                                                No complaints are currently
                                                assigned to you.
                                            </span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {filteredComplaints.map((complaint) => (
                            <tr key={complaint.id}>
                                <td>
                                        <span className="technician-complaint-id">
                                            #{complaint.id}
                                        </span>
                                </td>

                                <td>
                                    <div className="technician-complaint-title">
                                        {complaint.title || "--"}
                                    </div>

                                    <div className="technician-complaint-description">
                                        {complaint.description || "--"}
                                    </div>
                                </td>

                                <td>
                                    <div className="complaint-student-cell">
                                        <strong>
                                            {complaint.studentName || "--"}
                                        </strong>

                                        <span>Student</span>
                                    </div>
                                </td>

                                <td>
                                    <div className="technician-complaint-room">
                                        <MapPin size={13} />
                                        <span>
                                                {complaint.roomCode || "--"}
                                            </span>
                                    </div>
                                </td>

                                <td>
                                    {formatCategory(
                                        complaint.category
                                    )}
                                </td>

                                <td>
                                        <span
                                            className={`technician-complaint-badge ${priorityClass(
                                                complaint.priority
                                            )}`}
                                        >
                                            {complaint.priority || "--"}
                                        </span>
                                </td>

                                <td>
                                        <span
                                            className={`technician-complaint-badge ${statusClass(
                                                complaint.status
                                            )}`}
                                        >
                                            {formatStatus(
                                                complaint.status
                                            )}
                                        </span>
                                </td>

                                <td>
                                    {formatDate(
                                        complaint.createdAt
                                    )}
                                </td>

                                <td>
                                    <button
                                        type="button"
                                        className="technician-complaint-view"
                                        onClick={() =>
                                            openComplaint(complaint)
                                        }
                                        title="View complaint"
                                    >
                                        <Eye size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedComplaint && (
                <div
                    className="technician-complaint-modal-overlay"
                    onClick={closeComplaint}
                >
                    <div
                        className="technician-complaint-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="technician-complaint-modal-header">
                            <div>
                                <h2>Complaint Details</h2>

                                <span>
                                    Complaint #{selectedComplaint.id}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="technician-complaint-modal-close"
                                onClick={closeComplaint}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="technician-complaint-modal-body">
                            <div className="complaint-modal-summary">
                                <div className="complaint-modal-icon">
                                    <MessageSquare size={22} />
                                </div>

                                <div className="complaint-modal-summary-content">
                                    <h3>
                                        {selectedComplaint.title}
                                    </h3>

                                    <p>
                                        {selectedComplaint.description}
                                    </p>

                                    <span>
                                        <MapPin size={13} />
                                        {selectedComplaint.roomCode || "--"}
                                    </span>
                                </div>

                                <span
                                    className={`technician-complaint-badge ${statusClass(
                                        selectedComplaint.status
                                    )}`}
                                >
                                    {formatStatus(
                                        selectedComplaint.status
                                    )}
                                </span>
                            </div>

                            <div className="complaint-detail-grid">
                                <div className="complaint-detail-card">
                                    <UserRound size={17} />

                                    <div>
                                        <span>Student</span>
                                        <strong>
                                            {selectedComplaint.studentName ||
                                                "--"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="complaint-detail-card">
                                    <MapPin size={17} />

                                    <div>
                                        <span>Room</span>
                                        <strong>
                                            {selectedComplaint.roomCode ||
                                                "--"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="complaint-detail-card">
                                    <Tag size={17} />

                                    <div>
                                        <span>Category</span>
                                        <strong>
                                            {formatCategory(
                                                selectedComplaint.category
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="complaint-detail-card">
                                    <Flag size={17} />

                                    <div>
                                        <span>Priority</span>

                                        <strong
                                            className={`technician-complaint-badge ${priorityClass(
                                                selectedComplaint.priority
                                            )}`}
                                        >
                                            {selectedComplaint.priority}
                                        </strong>
                                    </div>
                                </div>

                                <div className="complaint-detail-card">
                                    <CalendarDays size={17} />

                                    <div>
                                        <span>Created</span>
                                        <strong>
                                            {formatDateTime(
                                                selectedComplaint.createdAt
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="complaint-detail-card">
                                    <CalendarDays size={17} />

                                    <div>
                                        <span>Last Updated</span>
                                        <strong>
                                            {selectedComplaint.updatedAt
                                                ? formatDateTime(
                                                    selectedComplaint.updatedAt
                                                )
                                                : "--"}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="complaint-modal-description">
                                <div className="complaint-section-title">
                                    <MessageSquare size={16} />
                                    <strong>
                                        Complaint Description
                                    </strong>
                                </div>

                                <p>
                                    {selectedComplaint.description || "--"}
                                </p>
                            </div>

                            <div className="complaint-status-panel">
                                <div className="complaint-section-title">
                                    <CircleAlert size={16} />
                                    <strong>Complaint Status</strong>
                                </div>

                                <div className="complaint-current-status">
                                    <span>Current Status</span>

                                    <strong
                                        className={`technician-complaint-badge ${statusClass(
                                            selectedComplaint.status
                                        )}`}
                                    >
                                        {formatStatus(
                                            selectedComplaint.status
                                        )}
                                    </strong>
                                </div>

                                <div className="complaint-status-selector">
                                    <span className="complaint-status-label">
                                        Update Status
                                    </span>

                                    <div className="complaint-status-options">
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
                                            disabled={updating}
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
                                            disabled={updating}
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
                                            disabled={updating}
                                        >
                                            <span className="status-option-dot" />
                                            Resolved
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="complaint-save-status"
                                        disabled={
                                            updating ||
                                            selectedStatus ===
                                            selectedComplaint.status
                                        }
                                        onClick={
                                            updateComplaintStatus
                                        }
                                    >
                                        <CheckCircle size={15} />

                                        {updating
                                            ? "Saving..."
                                            : "Save Status"}
                                    </button>
                                </div>

                                {selectedStatus ===
                                    selectedComplaint.status && (
                                        <div className="complaint-status-info">
                                            <CircleAlert size={14} />

                                            <span>
                                            Current status is already{" "}
                                                <strong>
                                                {formatStatus(
                                                    selectedComplaint.status
                                                )}
                                            </strong>
                                            .
                                        </span>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="technician-complaint-modal-footer">
                            <button
                                type="button"
                                className="complaint-close-button"
                                onClick={closeComplaint}
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