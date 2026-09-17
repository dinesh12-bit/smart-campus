import { useState } from "react";
import {
    ArrowLeft,
    Search,
    MessageCircle,
    Mail,
    Phone,
    HelpCircle,
    ClipboardList,
    UserRound,
    Settings,
    ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/studentHelpSupport.css";

const faqs = [
    {
        question: "How do I raise a complaint?",
        answer:
            "Go to Raise Complaint from the sidebar, select the complaint category, enter the required details and submit your complaint.",
        icon: ClipboardList,
        className: "purple",
    },
    {
        question: "How can I track my complaint?",
        answer:
            "Open My Complaints from the sidebar to view your submitted complaints, current status and other available details.",
        icon: Search,
        className: "blue",
    },
    {
        question: "What do the complaint statuses mean?",
        answer:
            "Open means the complaint is waiting for action, Assigned means it has been assigned, In Progress means work has started and Resolved means the issue has been completed.",
        icon: HelpCircle,
        className: "green",
    },
    {
        question: "How can I update my profile?",
        answer:
            "Open your Profile page to view your registered student information. Account details are managed through your campus account.",
        icon: UserRound,
        className: "orange",
    },
    {
        question: "How do I change my preferences?",
        answer:
            "Open Settings from the sidebar to manage your Student Panel preferences such as theme, font size and notifications.",
        icon: Settings,
        className: "pink",
    },
    {
        question: "What should I do if the website is not working?",
        answer:
            "Refresh the page and try again. If the problem continues, contact the campus support team using the support options below.",
        icon: MessageCircle,
        className: "red",
    },
];

function HelpSupport() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

    const filteredFaqs = faqs.filter((faq) =>
        faq.question
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const toggleFaq = (index) => {
        setOpenFaq(
            openFaq === index
                ? null
                : index
        );
    };

    return (
        <div className="student-help-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="student-help-header">

                <div className="student-help-title-row">

                    <button
                        type="button"
                        className="student-help-back"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div>

                        <h1>
                            Help & Support
                        </h1>

                        <div className="student-help-breadcrumb">

                            <span>
                                Dashboard
                            </span>

                            <span>
                                ›
                            </span>

                            <strong>
                                Help & Support
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                HELP INTRO
            ========================= */}

            <div className="student-help-intro">

                <div className="student-help-intro-icon">
                    <HelpCircle size={25} />
                </div>

                <div className="student-help-intro-content">

                    <h2>
                        How can we help you?
                    </h2>

                    <p>
                        Find answers to common questions
                        or contact the campus support team.
                    </p>

                </div>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="student-help-search">

                <Search size={17} />

                <input
                    type="text"
                    placeholder="Search for help..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>


            {/* =========================
                FAQ
            ========================= */}

            <div className="student-help-section">

                <div className="student-help-section-heading">

                    <h2>
                        Frequently Asked Questions
                    </h2>

                    <span>
                        {filteredFaqs.length} topics
                    </span>

                </div>


                <div className="student-faq-list">

                    {filteredFaqs.length === 0 ? (

                        <div className="student-faq-empty">

                            <HelpCircle size={25} />

                            <h3>
                                No results found
                            </h3>

                            <p>
                                Try searching with a
                                different keyword.
                            </p>

                        </div>

                    ) : (

                        filteredFaqs.map(
                            (faq, index) => {

                                const Icon = faq.icon;

                                const isOpen =
                                    openFaq ===
                                    index;

                                return (
                                    <div
                                        className={`student-faq-item ${
                                            isOpen
                                                ? "open"
                                                : ""
                                        }`}
                                        key={
                                            faq.question
                                        }
                                    >

                                        <button
                                            type="button"
                                            className="student-faq-question"
                                            onClick={() =>
                                                toggleFaq(
                                                    index
                                                )
                                            }
                                        >

                                            <span
                                                className={`student-faq-icon ${faq.className}`}
                                            >
                                                <Icon
                                                    size={17}
                                                />
                                            </span>

                                            <span className="student-faq-question-text">
                                                {
                                                    faq.question
                                                }
                                            </span>

                                            <ChevronDown
                                                size={17}
                                                className={
                                                    isOpen
                                                        ? "rotate"
                                                        : ""
                                                }
                                            />

                                        </button>


                                        {isOpen && (
                                            <div className="student-faq-answer">

                                                <p>
                                                    {
                                                        faq.answer
                                                    }
                                                </p>

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </div>


            {/* =========================
                CONTACT SUPPORT
            ========================= */}

            <div className="student-support-section">

                <div className="student-help-section-heading">

                    <h2>
                        Contact Support
                    </h2>

                    <span>
                        Need more help?
                    </span>

                </div>


                <div className="student-support-grid">

                    <a
                        href="mailto:support@smartcampus.com"
                        className="student-support-card"
                    >

                        <div className="student-support-icon purple">
                            <Mail size={20} />
                        </div>

                        <div>
                            <h3>
                                Email Support
                            </h3>

                            <p>
                                support@smartcampus.com
                            </p>

                            <span>
                                Send us an email
                            </span>
                        </div>

                    </a>


                    <a
                        href="tel:+911800123456"
                        className="student-support-card"
                    >

                        <div className="student-support-icon green">
                            <Phone size={20} />
                        </div>

                        <div>
                            <h3>
                                Phone Support
                            </h3>

                            <p>
                                1800-123-456
                            </p>

                            <span>
                                Contact campus support
                            </span>
                        </div>

                    </a>


                    <button
                        type="button"
                        className="student-support-card"
                        onClick={() =>
                            navigate(
                                "/student/complaints/new"
                            )
                        }
                    >

                        <div className="student-support-icon orange">
                            <MessageCircle size={20} />
                        </div>

                        <div>
                            <h3>
                                Raise a Complaint
                            </h3>

                            <p>
                                Report a campus issue
                            </p>

                            <span>
                                Submit your complaint
                            </span>
                        </div>

                    </button>

                </div>

            </div>

        </div>
    );
}

export default HelpSupport;