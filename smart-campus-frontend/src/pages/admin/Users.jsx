import { useEffect, useMemo, useState } from "react";
import {
    Search,
    UserRound,
    ShieldCheck,
    Ban,
    Eye,
    Pencil,
    Trash2,
    X,
    Activity,
    UserPlus,
    Save,
    ChevronDown,
    RefreshCw,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import api from "../../api/axios";
import "../../styles/users.css";

function CustomSelect({
                          value,
                          options,
                          onChange,
                          open,
                          setOpen,
                          width = 120,
                      }) {
    const selectedOption =
        options.find(
            (option) => option.value === value
        ) || options[0];

    return (
        <div
            className="custom-select"
            style={{ minWidth: width }}
        >
            <button
                type="button"
                className={`custom-select-button ${
                    open ? "open" : ""
                }`}
                onClick={() => setOpen(!open)}
            >
                <span>{selectedOption.label}</span>

                <ChevronDown
                    size={14}
                    className="select-arrow"
                />
            </button>

            {open && (
                <div className="custom-select-menu">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={
                                option.value === value
                                    ? "selected"
                                    : ""
                            }
                            onClick={() => {
                                onChange(
                                    option.value
                                );
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Users() {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] =
        useState("ALL");
    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [roleOpen, setRoleOpen] =
        useState(false);
    const [statusOpen, setStatusOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState(null);
    const [editingUser, setEditingUser] =
        useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/api/users"
            );

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load users:",
                error
            );

            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const summary = useMemo(() => {
        const total = users.length;

        const active = users.filter(
            (user) =>
                user.status === "ACTIVE"
        ).length;

        const pending = users.filter(
            (user) =>
                user.status === "PENDING"
        ).length;

        const blocked = users.filter(
            (user) =>
                user.status === "BLOCKED"
        ).length;

        const administrators =
            users.filter(
                (user) =>
                    user.role === "ADMIN"
            ).length;

        return {
            total,
            active,
            pending,
            blocked,
            administrators,
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const value = search
            .toLowerCase()
            .trim();

        return users.filter((user) => {
            const matchesSearch =
                !value ||
                user.name
                    ?.toLowerCase()
                    .includes(value) ||
                user.email
                    ?.toLowerCase()
                    .includes(value) ||
                user.username
                    ?.toLowerCase()
                    .includes(value) ||
                user.role
                    ?.toLowerCase()
                    .includes(value);

            const matchesRole =
                roleFilter === "ALL" ||
                user.role === roleFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                user.status === statusFilter;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [
        users,
        search,
        roleFilter,
        statusFilter,
    ]);

    const overviewData = useMemo(() => {
        const today = new Date();

        return Array.from(
            { length: 7 },
            (_, index) => {
                const date = new Date(
                    today
                );

                date.setDate(
                    today.getDate() -
                    (6 - index)
                );

                const count = users.filter(
                    (user) => {
                        if (!user.createdAt) {
                            return false;
                        }

                        const created =
                            new Date(
                                user.createdAt
                            );

                        return (
                            created.getFullYear() ===
                            date.getFullYear() &&
                            created.getMonth() ===
                            date.getMonth() &&
                            created.getDate() ===
                            date.getDate()
                        );
                    }
                ).length;

                return {
                    day: date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                        }
                    ),
                    users: count,
                };
            }
        );
    }, [users]);

    const roleData = useMemo(() => {
        return [
            {
                name: "Admin",
                value: users.filter(
                    (user) =>
                        user.role === "ADMIN"
                ).length,
            },
            {
                name: "Technician",
                value: users.filter(
                    (user) =>
                        user.role ===
                        "TECHNICIAN"
                ).length,
            },
            {
                name: "Student",
                value: users.filter(
                    (user) =>
                        user.role === "STUDENT"
                ).length,
            },
        ];
    }, [users]);

    const recentActivities = useMemo(() => {
        return [...users]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .slice(0, 4);
    }, [users]);

    const formatDate = (date) => {
        if (!date) return "--";

        return new Date(
            date
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "--";

        return new Date(
            date
        ).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleLabel = (role) => {
        if (role === "ADMIN") {
            return "Admin";
        }

        if (role === "TECHNICIAN") {
            return "Technician";
        }

        if (role === "STUDENT") {
            return "Student";
        }

        return role || "--";
    };

    const getStatusLabel = (status) => {
        if (status === "ACTIVE") {
            return "Active";
        }

        if (status === "PENDING") {
            return "Pending";
        }

        if (status === "BLOCKED") {
            return "Blocked";
        }

        return status || "--";
    };

    const openEdit = (user) => {
        setEditingUser({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            role: user.role || "STUDENT",
            status: user.status || "ACTIVE",
        });
    };

    const handleSaveUser = async () => {
        if (!editingUser) {
            return;
        }

        try {
            setSaving(true);

            await api.put(
                `/api/users/${editingUser.id}/role`,
                null,
                {
                    params: {
                        role: editingUser.role,
                    },
                }
            );

            await api.put(
                `/api/users/${editingUser.id}/status`,
                null,
                {
                    params: {
                        status:
                        editingUser.status,
                    },
                }
            );

            await loadUsers();

            const updatedUser =
                users.find(
                    (user) =>
                        user.id ===
                        editingUser.id
                );

            setEditingUser(null);

            if (
                editingUser.role ===
                "TECHNICIAN" &&
                !updatedUser?.username
            ) {
                alert(
                    "User approved as Technician. Technician ID has been generated automatically."
                );
            } else {
                alert(
                    "User updated successfully."
                );
            }
        } catch (error) {
            console.error(
                "Failed to update user:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Unable to update user."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        const confirmed =
            window.confirm(
                `Delete user "${user.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/api/users/${user.id}`
            );

            setUsers(
                (previousUsers) =>
                    previousUsers.filter(
                        (item) =>
                            item.id !==
                            user.id
                    )
            );

            if (
                selectedUser?.id ===
                user.id
            ) {
                setSelectedUser(null);
            }

            if (
                editingUser?.id ===
                user.id
            ) {
                setEditingUser(null);
            }
        } catch (error) {
            console.error(
                "Failed to delete user:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Unable to delete user."
            );
        }
    };

    const roleOptions = [
        {
            value: "ALL",
            label: "All Roles",
        },
        {
            value: "ADMIN",
            label: "Admin",
        },
        {
            value: "TECHNICIAN",
            label: "Technician",
        },
        {
            value: "STUDENT",
            label: "Student",
        },
    ];

    const statusOptions = [
        {
            value: "ALL",
            label: "All Status",
        },
        {
            value: "ACTIVE",
            label: "Active",
        },
        {
            value: "PENDING",
            label: "Pending",
        },
        {
            value: "BLOCKED",
            label: "Blocked",
        },
    ];

    const editRoleOptions = [
        {
            value: "STUDENT",
            label: "Student",
        },
        {
            value: "TECHNICIAN",
            label: "Technician",
        },
        {
            value: "ADMIN",
            label: "Admin",
        },
    ];

    const editStatusOptions = [
        {
            value: "ACTIVE",
            label: "Active",
        },
        {
            value: "PENDING",
            label: "Pending",
        },
        {
            value: "BLOCKED",
            label: "Blocked",
        },
    ];

    const roleColors = [
        "#4f46e5",
        "#f59e0b",
        "#22c55e",
    ];

    return (
        <div className="users-page">
            <div className="users-toolbar">
                <div className="users-search">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value
                            )
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                <div className="users-actions">
                    <CustomSelect
                        value={roleFilter}
                        options={roleOptions}
                        onChange={setRoleFilter}
                        open={roleOpen}
                        setOpen={(value) => {
                            setRoleOpen(
                                value
                            );

                            if (value) {
                                setStatusOpen(
                                    false
                                );
                            }
                        }}
                    />

                    <CustomSelect
                        value={statusFilter}
                        options={statusOptions}
                        onChange={setStatusFilter}
                        open={statusOpen}
                        setOpen={(value) => {
                            setStatusOpen(
                                value
                            );

                            if (value) {
                                setRoleOpen(
                                    false
                                );
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="refresh-users-button"
                        onClick={loadUsers}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={14}
                            className={
                                loading
                                    ? "refresh-spinning"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>
            </div>

            <div className="users-summary-grid">
                <div className="user-summary-card">
                    <div className="summary-icon active">
                        <UserRound size={21} />
                    </div>

                    <div>
                        <span>
                            Active Users
                        </span>

                        <strong>
                            {summary.active}
                        </strong>

                        <small>
                            {summary.total
                                ? `${(
                                    (summary.active /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`
                                : "0%"}
                        </small>
                    </div>
                </div>

                <div className="user-summary-card">
                    <div className="summary-icon pending">
                        <UserRound size={21} />
                    </div>

                    <div>
                        <span>
                            Pending Users
                        </span>

                        <strong>
                            {summary.pending}
                        </strong>

                        <small>
                            {summary.total
                                ? `${(
                                    (summary.pending /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`
                                : "0%"}
                        </small>
                    </div>
                </div>

                <div className="user-summary-card">
                    <div className="summary-icon blocked">
                        <Ban size={21} />
                    </div>

                    <div>
                        <span>
                            Blocked Users
                        </span>

                        <strong>
                            {summary.blocked}
                        </strong>

                        <small>
                            {summary.total
                                ? `${(
                                    (summary.blocked /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`
                                : "0%"}
                        </small>
                    </div>
                </div>

                <div className="user-summary-card">
                    <div className="summary-icon admin">
                        <ShieldCheck
                            size={21}
                        />
                    </div>

                    <div>
                        <span>
                            Administrators
                        </span>

                        <strong>
                            {
                                summary.administrators
                            }
                        </strong>

                        <small>
                            {summary.total
                                ? `${(
                                    (summary.administrators /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`
                                : "0%"}
                        </small>
                    </div>
                </div>
            </div>

            <div className="users-content-grid">
                <section className="users-table-card">
                    <div className="users-card-header">
                        <div>
                            <h3>
                                All Users
                            </h3>

                            <p>
                                {
                                    filteredUsers.length
                                }{" "}
                                users found
                            </p>
                        </div>

                        <button
                            type="button"
                            className="refresh-users"
                            onClick={loadUsers}
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="users-empty"
                                    >
                                        Loading
                                        users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="users-empty"
                                    >
                                        No users
                                        found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(
                                    (user) => (
                                        <tr
                                            key={
                                                user.id
                                            }
                                        >
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {user.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase() ||
                                                            "U"}
                                                    </div>

                                                    <div className="user-info">
                                                        <strong>
                                                            {user.name ||
                                                                "--"}
                                                        </strong>

                                                        <span>
                                                                {user.email ||
                                                                    "--"}
                                                            </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`role-badge ${
                                                            user.role?.toLowerCase() ||
                                                            ""
                                                        }`}
                                                    >
                                                        {getRoleLabel(
                                                            user.role
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`status-badge ${
                                                            user.status?.toLowerCase() ||
                                                            ""
                                                        }`}
                                                    >
                                                        <i></i>

                                                        {getStatusLabel(
                                                            user.status
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="created-date">
                                                        <span>
                                                            {formatDate(
                                                                user.createdAt
                                                            )}
                                                        </span>

                                                    <small>
                                                        {formatTime(
                                                            user.createdAt
                                                        )}
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        type="button"
                                                        title="View User"
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Manage User"
                                                        onClick={() =>
                                                            openEdit(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete User"
                                                        className="delete-action"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="users-right-column">
                    <section className="overview-card">
                        <div className="chart-header">
                            <div>
                                <h3>
                                    Users
                                    Overview
                                </h3>

                                <span>
                                    Last 7 days
                                </span>
                            </div>

                            <div className="chart-period">
                                This Week
                            </div>
                        </div>

                        <div className="overview-chart">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart
                                    data={
                                        overviewData
                                    }
                                    margin={{
                                        top: 10,
                                        right: 5,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="usersAreaGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#7c3aed"
                                                stopOpacity={
                                                    0.28
                                                }
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#7c3aed"
                                                stopOpacity={
                                                    0.02
                                                }
                                            />
                                        </linearGradient>
                                    </defs>

                                    <XAxis
                                        dataKey="day"
                                        tick={{
                                            fontSize: 9,
                                            fill: "#8b93a7",
                                        }}
                                        axisLine={
                                            false
                                        }
                                        tickLine={
                                            false
                                        }
                                    />

                                    <YAxis
                                        allowDecimals={
                                            false
                                        }
                                        tick={{
                                            fontSize: 9,
                                            fill: "#8b93a7",
                                        }}
                                        axisLine={
                                            false
                                        }
                                        tickLine={
                                            false
                                        }
                                    />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#7c3aed"
                                        strokeWidth={
                                            2
                                        }
                                        fill="url(#usersAreaGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="role-card">
                        <div className="chart-header">
                            <div>
                                <h3>
                                    Users by
                                    Role
                                </h3>

                                <span>
                                    Current users
                                </span>
                            </div>
                        </div>

                        <div className="role-chart-area">
                            <div className="donut-wrapper">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <PieChart>
                                        <Pie
                                            data={
                                                roleData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={
                                                42
                                            }
                                            outerRadius={
                                                62
                                            }
                                            paddingAngle={
                                                3
                                            }
                                        >
                                            {roleData.map(
                                                (
                                                    role,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={
                                                            role.name
                                                        }
                                                        fill={
                                                            roleColors[
                                                                index
                                                                ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="donut-center">
                                    <strong>
                                        {
                                            summary.total
                                        }
                                    </strong>

                                    <span>
                                        Total
                                    </span>
                                </div>
                            </div>

                            <div className="role-legend">
                                {roleData.map(
                                    (
                                        role,
                                        index
                                    ) => (
                                        <div
                                            className="legend-row"
                                            key={
                                                role.name
                                            }
                                        >
                                            <span>
                                                <i
                                                    style={{
                                                        background:
                                                            roleColors[
                                                                index
                                                                ],
                                                    }}
                                                ></i>

                                                {
                                                    role.name
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    role.value
                                                }
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="activities-card">
                        <div className="chart-header">
                            <div>
                                <h3>
                                    Recent User
                                    Activities
                                </h3>

                                <span>
                                    Latest
                                    registrations
                                </span>
                            </div>

                            <Activity
                                size={17}
                            />
                        </div>

                        <div className="activities-list">
                            {recentActivities.length ===
                            0 ? (
                                <div className="activity-empty">
                                    No recent
                                    activity.
                                </div>
                            ) : (
                                recentActivities.map(
                                    (user) => (
                                        <div
                                            className="activity-item"
                                            key={
                                                user.id
                                            }
                                        >
                                            <div className="activity-icon">
                                                <UserPlus
                                                    size={
                                                        14
                                                    }
                                                />
                                            </div>

                                            <div className="activity-content">
                                                <strong>
                                                    New
                                                    user
                                                    registered
                                                </strong>

                                                <span>
                                                    {
                                                        user.name
                                                    }{" "}
                                                    joined
                                                    as{" "}
                                                    {getRoleLabel(
                                                        user.role
                                                    )}
                                                </span>
                                            </div>

                                            <time>
                                                {formatDate(
                                                    user.createdAt
                                                )}

                                                <br />

                                                {formatTime(
                                                    user.createdAt
                                                )}
                                            </time>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </section>
                </aside>
            </div>

            {selectedUser && (
                <div
                    className="user-modal-overlay"
                    onClick={() =>
                        setSelectedUser(
                            null
                        )
                    }
                >
                    <div
                        className="user-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h3>
                                    User Details
                                </h3>

                                <p>
                                    Account
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedUser(
                                        null
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="modal-user-profile">
                            <div className="modal-avatar">
                                {selectedUser.name
                                        ?.charAt(
                                            0
                                        )
                                        .toUpperCase() ||
                                    "U"}
                            </div>

                            <div>
                                <h4>
                                    {
                                        selectedUser.name
                                    }
                                </h4>

                                <span>
                                    {getRoleLabel(
                                        selectedUser.role
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="user-detail-grid">
                            <div>
                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        selectedUser.email
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Username /
                                    ID
                                </span>

                                <strong>
                                    {selectedUser.username ||
                                        "--"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Role
                                </span>

                                <strong>
                                    {getRoleLabel(
                                        selectedUser.role
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {getStatusLabel(
                                        selectedUser.status
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Created At
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedUser.createdAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #
                                    {
                                        selectedUser.id
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingUser && (
                <div
                    className="user-modal-overlay"
                    onClick={() => {
                        if (!saving) {
                            setEditingUser(
                                null
                            );
                        }
                    }}
                >
                    <div
                        className="user-modal edit-user-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h3>
                                    {editingUser.status ===
                                    "PENDING"
                                        ? "Approve User"
                                        : "Manage User"}
                                </h3>

                                <p>
                                    Manage user
                                    role and
                                    account
                                    status
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                    setEditingUser(
                                        null
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="modal-user-profile">
                            <div className="modal-avatar">
                                {editingUser.name
                                        ?.charAt(
                                            0
                                        )
                                        .toUpperCase() ||
                                    "U"}
                            </div>

                            <div>
                                <h4>
                                    {
                                        editingUser.name
                                    }
                                </h4>

                                <span>
                                    {
                                        editingUser.email
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="edit-form">
                            <div className="form-field">
                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editingUser.name
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={
                                        editingUser.email
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Role
                                </label>

                                <CustomSelect
                                    value={
                                        editingUser.role
                                    }
                                    options={
                                        editRoleOptions
                                    }
                                    onChange={(
                                        value
                                    ) => {
                                        setEditingUser(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                role: value,
                                            })
                                        );
                                    }}
                                    open={
                                        editingUser.roleOpen ||
                                        false
                                    }
                                    setOpen={(
                                        value
                                    ) => {
                                        setEditingUser(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                roleOpen:
                                                value,
                                                statusOpen:
                                                    false,
                                            })
                                        );
                                    }}
                                    width="100%"
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Status
                                </label>

                                <CustomSelect
                                    value={
                                        editingUser.status
                                    }
                                    options={
                                        editStatusOptions
                                    }
                                    onChange={(
                                        value
                                    ) => {
                                        setEditingUser(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                status: value,
                                            })
                                        );
                                    }}
                                    open={
                                        editingUser.statusOpen ||
                                        false
                                    }
                                    setOpen={(
                                        value
                                    ) => {
                                        setEditingUser(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                statusOpen:
                                                value,
                                                roleOpen:
                                                    false,
                                            })
                                        );
                                    }}
                                    width="100%"
                                />
                            </div>

                            {editingUser.role ===
                                "TECHNICIAN" && (
                                    <div className="edit-note">
                                        Technician ID
                                        will be
                                        generated
                                        automatically
                                        by the
                                        backend if
                                        the user does
                                        not already
                                        have one.
                                    </div>
                                )}

                            {editingUser.status ===
                                "PENDING" && (
                                    <div className="edit-note">
                                        To approve
                                        this user,
                                        select a
                                        role and
                                        change
                                        Status to
                                        Active.
                                    </div>
                                )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="cancel-button"
                                disabled={saving}
                                onClick={() =>
                                    setEditingUser(
                                        null
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="save-user-button"
                                disabled={saving}
                                onClick={
                                    handleSaveUser
                                }
                            >
                                <Save size={15} />

                                {saving
                                    ? "Saving..."
                                    : editingUser.status ===
                                    "PENDING"
                                        ? "Update User"
                                        : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;