import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    ClipboardList,
    RefreshCw,
    MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../styles/studentMyComplaints.css";

const PAGE_SIZE = 5;

function MyComplaints() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [showFilter, setShowFilter] = useState(false);

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const loadComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const [meResponse, complaintsResponse] =
                await Promise.all([
                    api.get("/api/auth/me"),
                    api.get("/api/complaints"),
                ]);

            const student = meResponse.data;

            const allComplaints = Array.isArray(
                complaintsResponse.data
            )
                ? complaintsResponse.data
                : [];

            const studentId =
                student?.id ??
                student?.userId;

            const myComplaints = allComplaints.filter(
                (complaint) =>
                    Number(complaint.studentId) ===
                    Number(studentId)
            );

            myComplaints.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );

            setComplaints(myComplaints);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load complaints from server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        let result = [...complaints];

        if (statusFilter !== "ALL") {
            result = result.filter(
                (complaint) =>
                    complaint.status === statusFilter
            );
        }

        if (categoryFilter !== "ALL") {
            result = result.filter(
                (complaint) =>
                    complaint.category === categoryFilter
            );
        }

        setFilteredComplaints(result);
        setCurrentPage(1);
    }, [
        complaints,
        statusFilter,
        categoryFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredComplaints.length / PAGE_SIZE
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const startIndex =
        (safeCurrentPage - 1) * PAGE_SIZE;

    const endIndex = Math.min(
        startIndex + PAGE_SIZE,
        filteredComplaints.length
    );

    const visibleComplaints =
        filteredComplaints.slice(
            startIndex,
            endIndex
        );

    const formatCategory = (category) => {
        if (!category) return "-";

        const names = {
            AC_COOLING: "AC / Cooling",
            LIGHTING: "Lighting",
            ELECTRICAL: "Electrical",
            CLEANLINESS: "Cleanliness",
            FURNITURE: "Furniture",
            NETWORK_IT: "WiFi / Network",
            OTHER: "Other",
        };

        return (
            names[category] ||
            category
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(
                    /\b\w/g,
                    (letter) =>
                        letter.toUpperCase()
                )
        );
    };

    const formatLocation = (location) => {
        if (!location) return "-";

        const names = {
            "ROOM-201": "Room 201",
            "ROOM-202": "Room 202",
            "ROOM-203": "Room 203",
            "ROOM-204": "Room 204",
            LIBRARY: "Library",
            LAB: "Computer Lab",
            CAFETERIA: "Cafeteria",
            HOSTEL: "Hostel",
        };

        return names[location] || location;
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        const names = {
            PENDING: "Open",
            ASSIGNED: "Assigned",
            IN_PROGRESS: "In Progress",
            RESOLVED: "Resolved",
        };

        return names[status] || status;
    };

    const formatDate = (date) => {
        if (!date) {
            return {
                date: "-",
                time: "",
            };
        }

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return {
                date: "-",
                time: "",
            };
        }

        return {
            date: value.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            ),
            time: value.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }
            ),
        };
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "RESOLVED":
                return "resolved";

            case "IN_PROGRESS":
                return "progress";

            case "ASSIGNED":
                return "assigned";

            case "PENDING":
                return "open";

            default:
                return "unknown";
        }
    };

    const getPriorityClass = (priority) => {
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

    const clearFilters = () => {
        setStatusFilter("ALL");
        setCategoryFilter("ALL");
        setShowFilter(false);
    };

    const activeFilterCount =
        (statusFilter !== "ALL" ? 1 : 0) +
        (categoryFilter !== "ALL" ? 1 : 0);

    if (loading) {
        return (
            <div className="student-my-complaints-page">
                <div className="student-my-complaints-loading">
                    <div className="student-complaints-spinner"></div>

                    <span>
                        Loading your complaints...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="student-my-complaints-page">

            <div className="student-my-complaints-header">

                <div className="student-my-complaints-title-row">

                    <button
                        type="button"
                        className="student-my-back-button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={23} />
                    </button>

                    <div>
                        <h1>My Complaints</h1>

                        <div className="student-my-breadcrumb">
                            <span>Dashboard</span>
                            <span>›</span>
                            <strong>My Complaints</strong>
                        </div>
                    </div>

                </div>


                <div className="student-filter-wrapper">

                    <button
                        type="button"
                        className={`student-filter-button ${
                            activeFilterCount
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setShowFilter(
                                !showFilter
                            )
                        }
                    >
                        <Filter size={14} />

                        <span>Filter</span>

                        {activeFilterCount > 0 && (
                            <b>
                                {activeFilterCount}
                            </b>
                        )}
                    </button>


                    {showFilter && (
                        <div className="student-filter-panel">

                            <div className="student-filter-group">
                                <label>Status</label>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="ALL">
                                        All Status
                                    </option>

                                    <option value="PENDING">
                                        Open
                                    </option>

                                    <option value="ASSIGNED">
                                        Assigned
                                    </option>

                                    <option value="IN_PROGRESS">
                                        In Progress
                                    </option>

                                    <option value="RESOLVED">
                                        Resolved
                                    </option>
                                </select>
                            </div>


                            <div className="student-filter-group">
                                <label>Category</label>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="ALL">
                                        All Categories
                                    </option>

                                    <option value="AC_COOLING">
                                        AC / Cooling
                                    </option>

                                    <option value="LIGHTING">
                                        Lighting
                                    </option>

                                    <option value="ELECTRICAL">
                                        Electrical
                                    </option>

                                    <option value="CLEANLINESS">
                                        Cleanliness
                                    </option>

                                    <option value="FURNITURE">
                                        Furniture
                                    </option>

                                    <option value="NETWORK_IT">
                                        Network / IT
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>


                            <button
                                type="button"
                                className="student-clear-filter"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                </div>

            </div>


            <div className="student-complaints-table-card">

                {error ? (
                    <div className="student-complaints-error">

                        <div className="student-error-icon">
                            <ClipboardList size={24} />
                        </div>

                        <h3>
                            Unable to load complaints
                        </h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadComplaints}
                        >
                            <RefreshCw size={14} />
                            Try Again
                        </button>

                    </div>

                ) : filteredComplaints.length === 0 ? (

                    <div className="student-complaints-empty">

                        <div className="student-empty-icon">
                            <ClipboardList size={27} />
                        </div>

                        <h3>
                            No complaints found
                        </h3>

                        <p>
                            You have not raised any
                            complaints yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/complaints/new"
                                )
                            }
                        >
                            Raise Complaint
                        </button>

                    </div>

                ) : (

                    <>

                        <div className="student-complaints-list-header">
                            <div>
                                <h2>
                                    Complaints List
                                </h2>

                                <p>
                                    Track your submitted complaints
                                    and their current status.
                                </p>
                            </div>

                            <span className="student-total-count">
                                {filteredComplaints.length} Complaints
                            </span>
                        </div>


                        <div className="student-table-wrapper">

                            <table className="student-complaints-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Complaint</th>
                                    <th>Location</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                                </thead>


                                <tbody>

                                {visibleComplaints.map(
                                    (complaint) => {

                                        const date =
                                            formatDate(
                                                complaint.createdAt
                                            );

                                        const complaintTitle =
                                            complaint.title ||
                                            complaint.subject ||
                                            "Campus Complaint";

                                        return (
                                            <tr
                                                key={
                                                    complaint.id
                                                }
                                            >

                                                <td>
                                                        <span className="student-complaint-id">
                                                            {complaint.complaintCode ||
                                                                `CMP-${String(
                                                                    complaint.id
                                                                ).padStart(
                                                                    4,
                                                                    "0"
                                                                )}`}
                                                        </span>
                                                </td>


                                                <td>
                                                    <div className="student-complaint-main">

                                                        <strong>
                                                            {complaintTitle}
                                                        </strong>

                                                        <span>
                                                                {complaint.description ||
                                                                    "No description provided."}
                                                            </span>

                                                    </div>
                                                </td>


                                                <td>
                                                    <div className="student-location-cell">

                                                        <MapPin
                                                            size={13}
                                                        />

                                                        <span>
                                                                {formatLocation(
                                                                    complaint.location
                                                                )}
                                                            </span>

                                                    </div>
                                                </td>


                                                <td>
                                                        <span className="student-category-text">
                                                            {formatCategory(
                                                                complaint.category
                                                            )}
                                                        </span>
                                                </td>


                                                <td>
                                                        <span
                                                            className={`student-priority-badge ${getPriorityClass(
                                                                complaint.priority
                                                            )}`}
                                                        >
                                                            {complaint.priority ||
                                                                "-"}
                                                        </span>
                                                </td>


                                                <td>
                                                        <span
                                                            className={`student-status-badge ${getStatusClass(
                                                                complaint.status
                                                            )}`}
                                                        >
                                                            {formatStatus(
                                                                complaint.status
                                                            )}
                                                        </span>
                                                </td>


                                                <td>
                                                    <div className="student-date-cell">

                                                            <span>
                                                                {
                                                                    date.date
                                                                }
                                                            </span>

                                                        <small>
                                                            {
                                                                date.time
                                                            }
                                                        </small>

                                                    </div>
                                                </td>


                                                <td>
                                                    <button
                                                        type="button"
                                                        className="student-view-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/student/complaints/${complaint.id}`
                                                            )
                                                        }
                                                    >
                                                        <Eye size={12} />
                                                        <span>
                                                                View
                                                            </span>
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                                </tbody>

                            </table>

                        </div>


                        <div className="student-table-footer">

                            <span>
                                Showing{" "}
                                {startIndex + 1} to{" "}
                                {endIndex} of{" "}
                                {
                                    filteredComplaints.length
                                }{" "}
                                complaints
                            </span>


                            <div className="student-pagination">

                                <button
                                    type="button"
                                    disabled={
                                        safeCurrentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    1,
                                                    page - 1
                                                )
                                        )
                                    }
                                >
                                    <ChevronLeft size={14} />
                                </button>


                                {Array.from(
                                    {
                                        length: totalPages,
                                    },
                                    (_, index) =>
                                        index + 1
                                ).map((page) => (
                                    <button
                                        type="button"
                                        key={page}
                                        className={
                                            page ===
                                            safeCurrentPage
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                    >
                                        {page}
                                    </button>
                                ))}


                                <button
                                    type="button"
                                    disabled={
                                        safeCurrentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                        )
                                    }
                                >
                                    <ChevronRight size={14} />
                                </button>

                            </div>

                        </div>

                    </>
                )}

            </div>

        </div>
    );
}

export default MyComplaints;