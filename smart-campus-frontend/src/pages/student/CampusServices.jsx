import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Building2,
    BookOpen,
    Utensils,
    Wifi,
    HeartPulse,
    Bus,
    Dumbbell,
    ShieldCheck,
    Coffee,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/studentCampusServices.css";

const services = [
    {
        title: "Library",
        description: "Access books, study spaces and library resources.",
        icon: BookOpen,
        className: "purple",
    },
    {
        title: "Cafeteria",
        description: "View cafeteria information and available facilities.",
        icon: Utensils,
        className: "orange",
    },
    {
        title: "Wi-Fi & Internet",
        description: "Get help with campus internet and connectivity.",
        icon: Wifi,
        className: "blue",
    },
    {
        title: "Health Center",
        description: "Campus medical and health support services.",
        icon: HeartPulse,
        className: "red",
    },
    {
        title: "Transport",
        description: "Campus transport and shuttle information.",
        icon: Bus,
        className: "green",
    },
    {
        title: "Sports & Fitness",
        description: "Explore sports facilities and fitness areas.",
        icon: Dumbbell,
        className: "yellow",
    },
    {
        title: "Security",
        description: "Campus security and emergency assistance.",
        icon: ShieldCheck,
        className: "indigo",
    },
    {
        title: "Student Lounge",
        description: "Relax, connect and spend time between classes.",
        icon: Coffee,
        className: "pink",
    },
];

function CampusServices() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="student-services-page">

                <div className="student-services-loading">

                    <div className="student-services-loader">
                        <RefreshCw size={22} />
                    </div>

                    <span>
                        Loading campus services...
                    </span>

                </div>

            </div>
        );
    }

    return (
        <div className="student-services-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="student-services-header">

                <div className="student-services-title-row">

                    <button
                        type="button"
                        className="student-services-back"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                        aria-label="Back"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div>

                        <h1>
                            Campus Services
                        </h1>

                        <div className="student-services-breadcrumb">

                            <span>
                                Dashboard
                            </span>

                            <span>
                                ›
                            </span>

                            <strong>
                                Campus Services
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                INTRO
            ========================= */}

            <div className="student-services-intro">

                <div className="student-services-intro-icon">
                    <Building2 size={24} />
                </div>

                <div>

                    <h2>
                        Campus Services
                    </h2>

                    <p>
                        Explore the facilities and support
                        services available across your campus.
                    </p>

                </div>

            </div>


            {/* =========================
                SERVICE GRID
            ========================= */}

            <div className="student-services-grid">

                {services.map((service) => {

                    const Icon = service.icon;

                    return (
                        <button
                            type="button"
                            className="student-service-card"
                            key={service.title}
                        >

                            <div
                                className={`student-service-icon ${service.className}`}
                            >
                                <Icon size={21} />
                            </div>

                            <div className="student-service-content">

                                <h3>
                                    {service.title}
                                </h3>

                                <p>
                                    {service.description}
                                </p>

                            </div>

                            <span className="student-service-arrow">
                                <ChevronRight size={17} />
                            </span>

                        </button>
                    );
                })}

            </div>

        </div>
    );
}

export default CampusServices;