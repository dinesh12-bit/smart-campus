import { useRef, useState } from "react";
import {
    ArrowLeft,
    ChevronDown,
    FileText,
    Type,
    Lightbulb,
    Zap,
    Sparkles,
    Sofa,
    Wifi,
    MoreHorizontal,
    ImagePlus,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "../../styles/studentRaiseComplaint.css";

const categoryOptions = [
    {
        value: "AC_COOLING",
        label: "AC / Cooling",
        icon: Zap,
        className: "purple",
    },
    {
        value: "LIGHTING",
        label: "Lighting",
        icon: Lightbulb,
        className: "yellow",
    },
    {
        value: "ELECTRICAL",
        label: "Electrical",
        icon: Zap,
        className: "red",
    },
    {
        value: "CLEANLINESS",
        label: "Cleanliness",
        icon: Sparkles,
        className: "green",
    },
    {
        value: "FURNITURE",
        label: "Furniture",
        icon: Sofa,
        className: "orange",
    },
    {
        value: "NETWORK_IT",
        label: "Network / IT",
        icon: Wifi,
        className: "blue",
    },
    {
        value: "OTHER",
        label: "Other",
        icon: MoreHorizontal,
        className: "gray",
    },
];

const locationOptions = [
    {
        value: "ROOM-204",
        label: "Room 204",
    },
    {
        value: "ROOM-203",
        label: "Room 203",
    },
    {
        value: "ROOM-202",
        label: "Room 202",
    },
    {
        value: "ROOM-201",
        label: "Room 201",
    },
    {
        value: "LIBRARY",
        label: "Library",
    },
    {
        value: "LAB",
        label: "Computer Lab",
    },
    {
        value: "CAFETERIA",
        label: "Cafeteria",
    },
    {
        value: "HOSTEL",
        label: "Hostel",
    },
    {
        value: "OTHER",
        label: "Other",
    },
];

function RaiseComplaint() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        category: "",
        subject: "",
        location: "",
        priority: "MEDIUM",
        description: "",
    });

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);

    const [photo, setPhoto] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedCategory = categoryOptions.find(
        (item) => item.value === form.category
    );

    const selectedLocation = locationOptions.find(
        (item) => item.value === form.location
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const selectCategory = (category) => {
        setForm((prev) => ({
            ...prev,
            category,
        }));

        setCategoryOpen(false);
        setError("");
    };

    const selectLocation = (location) => {
        setForm((prev) => ({
            ...prev,
            location,
        }));

        setLocationOpen(false);
        setError("");
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            ![
                "image/png",
                "image/jpeg",
                "image/jpg",
            ].includes(file.type)
        ) {
            setError("Please upload a PNG or JPG image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setPhoto(file);
        setError("");
    };

    const removePhoto = () => {
        setPhoto(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.category ||
            !form.subject.trim() ||
            !form.location ||
            !form.description.trim()
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const storage = sessionStorage.getItem("token")
                ? sessionStorage
                : localStorage;

            const studentId = storage.getItem("userId");

            const payload = {
                category: form.category,
                subject: form.subject.trim(),
                location: form.location,
                description: form.description.trim(),
                priority: form.priority,
                studentId: studentId
                    ? Number(studentId)
                    : null,
            };

            await api.post(
                "/api/complaints",
                payload
            );

            setSuccess(
                "Complaint submitted successfully."
            );

            setForm({
                category: "",
                subject: "",
                location: "",
                priority: "MEDIUM",
                description: "",
            });

            setPhoto(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setTimeout(() => {
                navigate("/student/complaints");
            }, 1000);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to submit complaint. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="student-raise-page"
            onClick={() => {
                setCategoryOpen(false);
                setLocationOpen(false);
            }}
        >

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="student-raise-header">

                <div className="student-raise-title-row">

                    <button
                        type="button"
                        className="student-back-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/student/dashboard");
                        }}
                    >
                        <ArrowLeft size={25} />
                    </button>

                    <div>
                        <h1>
                            Raise Complaint
                        </h1>

                        <div className="student-breadcrumb">
                            <span>
                                Dashboard
                            </span>

                            <span className="student-breadcrumb-arrow">
                                ›
                            </span>

                            <strong>
                                Raise Complaint
                            </strong>
                        </div>
                    </div>

                </div>

            </div>


            {/* =========================
                COMPLAINT FORM
            ========================= */}

            <form
                className="student-complaint-card"
                onSubmit={handleSubmit}
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <h2>
                    Complaint Details
                </h2>


                {error && (
                    <div className="student-form-alert error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="student-form-alert success">
                        {success}
                    </div>
                )}


                <div className="student-form-grid">

                    {/* =====================
                        CATEGORY
                    ===================== */}

                    <div className="student-form-field">

                        <label>
                            Complaint Category
                            <span>*</span>
                        </label>

                        <div className="student-custom-dropdown">

                            <button
                                type="button"
                                className={`student-dropdown-trigger ${
                                    categoryOpen
                                        ? "open"
                                        : ""
                                }`}
                                onClick={() => {
                                    setCategoryOpen(
                                        !categoryOpen
                                    );
                                    setLocationOpen(false);
                                }}
                            >

                                {selectedCategory ? (
                                    <>
                                        <span
                                            className={`student-selected-icon ${selectedCategory.className}`}
                                        >
                                            <selectedCategory.icon
                                                size={17}
                                            />
                                        </span>

                                        <span className="student-selected-text">
                                            {
                                                selectedCategory.label
                                            }
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="student-selected-icon empty">
                                            <FileText
                                                size={17}
                                            />
                                        </span>

                                        <span className="student-placeholder">
                                            Select a category
                                        </span>
                                    </>
                                )}

                                <ChevronDown
                                    size={18}
                                    className={
                                        categoryOpen
                                            ? "rotate"
                                            : ""
                                    }
                                />

                            </button>


                            {categoryOpen && (
                                <div className="student-dropdown-menu">

                                    {categoryOptions.map(
                                        (item) => {
                                            const Icon =
                                                item.icon;

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        item.value
                                                    }
                                                    className={`student-category-option ${
                                                        form.category ===
                                                        item.value
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        selectCategory(
                                                            item.value
                                                        )
                                                    }
                                                >

                                                    <span
                                                        className={`student-category-icon ${item.className}`}
                                                    >
                                                        <Icon
                                                            size={17}
                                                        />
                                                    </span>

                                                    <span>
                                                        {
                                                            item.label
                                                        }
                                                    </span>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>

                    </div>


                    {/* =====================
                        SUBJECT
                    ===================== */}

                    <div className="student-form-field">

                        <label>
                            Subject
                            <span>*</span>
                        </label>

                        <div className="student-input-icon-wrapper">

                            <span className="student-input-icon purple">
                                <Type size={16} />
                            </span>

                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Enter a brief subject"
                                maxLength={150}
                                required
                            />

                        </div>

                    </div>


                    {/* =====================
                        LOCATION
                    ===================== */}

                    <div className="student-form-field">

                        <label>
                            Location
                            <span>*</span>
                        </label>

                        <div className="student-custom-dropdown">

                            <button
                                type="button"
                                className={`student-dropdown-trigger ${
                                    locationOpen
                                        ? "open"
                                        : ""
                                }`}
                                onClick={() => {
                                    setLocationOpen(
                                        !locationOpen
                                    );
                                    setCategoryOpen(false);
                                }}
                            >

                                <span
                                    className={
                                        selectedLocation
                                            ? "student-selected-text"
                                            : "student-placeholder"
                                    }
                                >
                                    {selectedLocation
                                        ? selectedLocation.label
                                        : "Select location"}
                                </span>

                                <ChevronDown
                                    size={18}
                                    className={
                                        locationOpen
                                            ? "rotate"
                                            : ""
                                    }
                                />

                            </button>


                            {locationOpen && (
                                <div className="student-dropdown-menu location-menu">

                                    {locationOptions.map(
                                        (item) => (
                                            <button
                                                type="button"
                                                key={
                                                    item.value
                                                }
                                                className={`student-location-option ${
                                                    form.location ===
                                                    item.value
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectLocation(
                                                        item.value
                                                    )
                                                }
                                            >
                                                {
                                                    item.label
                                                }
                                            </button>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>


                    {/* =====================
                        PRIORITY
                    ===================== */}

                    <div className="student-form-field">

                        <label>
                            Priority Level
                            <span>*</span>
                        </label>

                        <div className="student-priority-grid">

                            <label
                                className={`student-priority-option low ${
                                    form.priority ===
                                    "LOW"
                                        ? "selected"
                                        : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="priority"
                                    value="LOW"
                                    checked={
                                        form.priority ===
                                        "LOW"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="priority-dot"></span>

                                <span>
                                    Low
                                </span>

                            </label>


                            <label
                                className={`student-priority-option medium ${
                                    form.priority ===
                                    "MEDIUM"
                                        ? "selected"
                                        : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="priority"
                                    value="MEDIUM"
                                    checked={
                                        form.priority ===
                                        "MEDIUM"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="priority-dot"></span>

                                <span>
                                    Medium
                                </span>

                            </label>


                            <label
                                className={`student-priority-option high ${
                                    form.priority ===
                                    "HIGH"
                                        ? "selected"
                                        : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="priority"
                                    value="HIGH"
                                    checked={
                                        form.priority ===
                                        "HIGH"
                                    }
                                    onChange={handleChange}
                                />

                                <span className="priority-dot"></span>

                                <span>
                                    High
                                </span>

                            </label>

                        </div>

                    </div>

                </div>


                {/* =========================
                    DESCRIPTION
                ========================= */}

                <div className="student-form-field student-description-field">

                    <label>
                        Description
                        <span>*</span>
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Please describe your issue in detail..."
                        maxLength={500}
                        required
                    />

                    <div className="student-character-count">
                        {form.description.length}/500
                    </div>

                </div>


                {/* =========================
                    UPLOAD
                ========================= */}

                <div className="student-upload-section">

                    <label className="student-upload-label">
                        Upload Photo
                        <span className="optional">
                            (Optional)
                        </span>
                    </label>

                    {!photo ? (
                        <button
                            type="button"
                            className="student-upload-box"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            <span className="student-upload-icon">
                                <ImagePlus size={22} />
                            </span>

                            <strong>
                                Click to upload
                            </strong>

                            <span>
                                PNG, JPG up to 5MB
                            </span>
                        </button>
                    ) : (
                        <div className="student-upload-preview">

                            <img
                                src={URL.createObjectURL(
                                    photo
                                )}
                                alt="Complaint"
                            />

                            <button
                                type="button"
                                onClick={removePhoto}
                            >
                                <X size={17} />
                            </button>

                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                        onChange={handlePhotoChange}
                        hidden
                    />

                </div>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="student-form-actions">

                    <button
                        type="button"
                        className="student-cancel-button"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="student-submit-button"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Complaint"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default RaiseComplaint;