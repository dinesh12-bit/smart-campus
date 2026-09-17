import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Eye,
    ClipboardList,
    MapPin,
    X,
    CheckCircle2,
    Clock3,
    AlertCircle,
    LoaderCircle,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/mytasks.css";

function MyTasks() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [selectedTask, setSelectedTask] = useState(null);
    const [updating, setUpdating] = useState(false);

    const storage = sessionStorage.getItem("token")
        ? sessionStorage
        : localStorage;

    const technicianId = Number(storage.getItem("userId"));

    const loadTasks = async () => {
        try {
            setLoading(true);

            const response = await api.get("/api/complaints");

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            const assigned = data.filter(
                (complaint) =>
                    Number(complaint.technicianId) === technicianId
            );

            setComplaints(assigned);
        } catch (error) {
            console.error(
                "Failed to load technician tasks:",
                error
            );

            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        return complaints.filter((task) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchValue ||
                task.title
                    ?.toLowerCase()
                    .includes(searchValue) ||
                task.description
                    ?.toLowerCase()
                    .includes(searchValue) ||
                task.roomCode
                    ?.toLowerCase()
                    .includes(searchValue) ||
                task.category
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "ALL" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [
        complaints,
        search,
        statusFilter,
        priorityFilter,
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case "ASSIGNED":
                return "assigned";

            case "IN_PROGRESS":
                return "in-progress";

            case "RESOLVED":
                return "resolved";

            case "PENDING":
                return "pending";

            default:
                return "";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "CRITICAL":
                return "critical";

            case "HIGH":
                return "high";

            case "MEDIUM":
                return "medium";

            case "LOW":
                return "low";

            default:
                return "";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "--";

        return status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );
    };

    const formatCategory = (category) => {
        if (!category) return "--";

        return category
            .replaceAll("_", " / ")
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );
    };

    const formatDate = (date) => {
        if (!date) return "--";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "--";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const updateStatus = async (
        complaintId,
        newStatus
    ) => {
        try {
            setUpdating(true);

            await api.put(
                `/api/complaints/${complaintId}/status`,
                null,
                {
                    params: {
                        status: newStatus,
                    },
                }
            );

            await loadTasks();

            setSelectedTask((current) =>
                current
                    ? {
                        ...current,
                        status: newStatus,
                    }
                    : null
            );
        } catch (error) {
            console.error(
                "Failed to update task status:",
                error
            );

            alert("Unable to update task status.");
        } finally {
            setUpdating(false);
        }
    };

    const totalTasks = complaints.length;

    const assignedCount = complaints.filter(
        (task) => task.status === "ASSIGNED"
    ).length;

    const inProgressCount = complaints.filter(
        (task) => task.status === "IN_PROGRESS"
    ).length;

    const resolvedCount = complaints.filter(
        (task) => task.status === "RESOLVED"
    ).length;

    if (loading) {
        return (
            <div className="technician-tasks-page">
                <div className="technician-tasks-loading">
                    <div className="technician-tasks-spinner"></div>
                    <p>Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="technician-tasks-page">

            {/* HEADER */}

            <div className="technician-tasks-header">
                <div>
                    <h1>Assigned Tasks</h1>
                    <p>
                        Manage complaints and tasks assigned to you.
                    </p>
                </div>
            </div>


            {/* SUMMARY */}

            <div className="technician-task-summary">

                <div className="technician-summary-card">
                    <div className="summary-icon blue">
                        <ClipboardList size={19} />
                    </div>

                    <div>
                        <span>Total Tasks</span>
                        <strong>{totalTasks}</strong>
                    </div>
                </div>


                <div className="technician-summary-card">
                    <div className="summary-icon orange">
                        <Clock3 size={19} />
                    </div>

                    <div>
                        <span>Assigned</span>
                        <strong>{assignedCount}</strong>
                    </div>
                </div>


                <div className="technician-summary-card">
                    <div className="summary-icon purple">
                        <LoaderCircle size={19} />
                    </div>

                    <div>
                        <span>In Progress</span>
                        <strong>{inProgressCount}</strong>
                    </div>
                </div>


                <div className="technician-summary-card">
                    <div className="summary-icon green">
                        <CheckCircle2 size={19} />
                    </div>

                    <div>
                        <span>Resolved</span>
                        <strong>{resolvedCount}</strong>
                    </div>
                </div>

            </div>


            {/* FILTER CARD */}

            <div className="technician-tasks-card">

                <div className="technician-task-filters">

                    <div className="technician-search-box">
                        <Search size={16} />

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>


                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="technician-filter-select"
                    >
                        <option value="ALL">
                            All Status
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


                    <select
                        value={priorityFilter}
                        onChange={(event) =>
                            setPriorityFilter(event.target.value)
                        }
                        className="technician-filter-select"
                    >
                        <option value="ALL">
                            All Priority
                        </option>

                        <option value="CRITICAL">
                            Critical
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="LOW">
                            Low
                        </option>
                    </select>

                </div>


                {/* TABLE */}

                <div className="technician-table-wrapper">

                    <table className="technician-tasks-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Complaint</th>
                            <th>Room</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>


                        <tbody>

                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="technician-table-empty"
                                >
                                    <ClipboardList size={30} />

                                    <strong>
                                        No tasks found
                                    </strong>

                                    <span>
                                            Assigned complaints will appear
                                            here.
                                        </span>
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map((task) => (
                                <tr key={task.id}>

                                    <td>
                                        <strong>
                                            #{task.id}
                                        </strong>
                                    </td>


                                    <td>
                                        <div className="task-title-cell">
                                            <strong>
                                                {task.title || "--"}
                                            </strong>

                                            <span>
                                                    {task.description?.length >
                                                    45
                                                        ? `${task.description.slice(
                                                            0,
                                                            45
                                                        )}...`
                                                        : task.description ||
                                                        "--"}
                                                </span>
                                        </div>
                                    </td>


                                    <td>
                                        <div className="task-room-cell">
                                            <MapPin size={13} />

                                            {task.roomCode || "--"}
                                        </div>
                                    </td>


                                    <td>
                                        {formatCategory(
                                            task.category
                                        )}
                                    </td>


                                    <td>
                                            <span
                                                className={`priority-badge ${getPriorityClass(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority || "--"}
                                            </span>
                                    </td>


                                    <td>
                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    task.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    task.status
                                                )}
                                            </span>
                                    </td>


                                    <td>
                                        {formatDate(
                                            task.createdAt
                                        )}
                                    </td>


                                    <td>
                                        <button
                                            type="button"
                                            className="task-view-button"
                                            title="View task"
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                        >
                                            <Eye size={15} />
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* DETAILS MODAL */}

            {selectedTask && (
                <div
                    className="technician-modal-overlay"
                    onClick={() =>
                        setSelectedTask(null)
                    }
                >

                    <div
                        className="technician-task-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="technician-modal-header">

                            <div>
                                <h2>
                                    Task Details
                                </h2>

                                <span>
                                    Task #{selectedTask.id}
                                </span>
                            </div>


                            <button
                                type="button"
                                className="technician-modal-close"
                                onClick={() =>
                                    setSelectedTask(null)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="technician-modal-body">

                            <div className="task-detail-title">

                                <div className="detail-main-icon">
                                    <ClipboardList size={20} />
                                </div>

                                <div>
                                    <h3>
                                        {selectedTask.title}
                                    </h3>

                                    <span>
                                        {selectedTask.roomCode || "--"}
                                    </span>
                                </div>

                            </div>


                            <div className="task-detail-grid">

                                <div>
                                    <span>Category</span>

                                    <strong>
                                        {formatCategory(
                                            selectedTask.category
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span>Priority</span>

                                    <strong>
                                        <span
                                            className={`priority-badge ${getPriorityClass(
                                                selectedTask.priority
                                            )}`}
                                        >
                                            {selectedTask.priority}
                                        </span>
                                    </strong>
                                </div>


                                <div>
                                    <span>Current Status</span>

                                    <strong>
                                        <span
                                            className={`status-badge ${getStatusClass(
                                                selectedTask.status
                                            )}`}
                                        >
                                            {formatStatus(
                                                selectedTask.status
                                            )}
                                        </span>
                                    </strong>
                                </div>


                                <div>
                                    <span>Created</span>

                                    <strong>
                                        {formatDate(
                                            selectedTask.createdAt
                                        )}
                                    </strong>
                                </div>

                            </div>


                            <div className="task-description">

                                <span>
                                    Description
                                </span>

                                <p>
                                    {selectedTask.description ||
                                        "No description provided."}
                                </p>

                            </div>


                            <div className="task-workflow">

                                <div className="workflow-title">
                                    <AlertCircle size={15} />

                                    <strong>
                                        Update Task Status
                                    </strong>
                                </div>


                                <div className="workflow-buttons">

                                    {selectedTask.status ===
                                        "ASSIGNED" && (
                                            <button
                                                type="button"
                                                className="workflow-progress-button"
                                                disabled={updating}
                                                onClick={() =>
                                                    updateStatus(
                                                        selectedTask.id,
                                                        "IN_PROGRESS"
                                                    )
                                                }
                                            >
                                                <LoaderCircle size={15} />

                                                Start Work
                                            </button>
                                        )}


                                    {selectedTask.status ===
                                        "IN_PROGRESS" && (
                                            <button
                                                type="button"
                                                className="workflow-resolve-button"
                                                disabled={updating}
                                                onClick={() =>
                                                    updateStatus(
                                                        selectedTask.id,
                                                        "RESOLVED"
                                                    )
                                                }
                                            >
                                                <CheckCircle2 size={15} />

                                                Mark Resolved
                                            </button>
                                        )}


                                    {selectedTask.status ===
                                        "RESOLVED" && (
                                            <div className="task-resolved-message">
                                                <CheckCircle2 size={16} />

                                                Task already resolved
                                            </div>
                                        )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyTasks;