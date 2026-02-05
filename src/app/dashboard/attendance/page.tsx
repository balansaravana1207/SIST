"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Check, X, User as UserIcon, Calendar, BookOpen } from "lucide-react";

export default function AttendancePage() {
    const { profile, user } = useUser();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const role = profile?.role || "student";

    useEffect(() => {
        setMounted(true);
    }, []);

    const subjects = [
        { name: "DevOps", code: "S613BLH62", percentage: 85, sessions: "32/38", color: "#6d4aff" },
        { name: "Smart Contracts", code: "SCSBOB1661", percentage: 92, sessions: "28/30", color: "#8b6eff" },
        { name: "Building Blockchain", code: "SCSB1662", percentage: 78, sessions: "22/28", color: "#10b981" },
        { name: "IDS", code: "S614BLH61", percentage: 65, sessions: "18/26", color: "#ef4444" },
    ];

    const students = [
        { id: "1", name: "SUJIT KUMAR", roll: "2023S101", avatar: "SK" },
        { id: "2", name: "JANE SMITH", roll: "2023S102", avatar: "JS" },
        { id: "3", name: "BOB JOHNSON", roll: "2023S103", avatar: "BJ" },
    ];

    if (role === "student") {
        return (
            <div className="attendance-page">
                <header>
                    <h2 className="heading-lg">My Attendance</h2>
                    <p className="text-muted">Tracking your presence across all registered subjects.</p>
                </header>

                <div className="attendance-grid mt-4">
                    {subjects.map((sub, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="subject-card card"
                        >
                            <div className="sub-header flex-between">
                                <div className="sub-title">
                                    <BookOpen size={18} color={sub.color} />
                                    <h4>{sub.name}</h4>
                                </div>
                                <span className="session-count">{sub.sessions}</span>
                            </div>

                            <div className="progress-section mt-1">
                                <div className="flex-between mb-1">
                                    <span className="percent-val" style={{ color: sub.color }}>{sub.percentage}%</span>
                                    <span className="status-label">{sub.percentage < 75 ? 'Low' : 'Good'}</span>
                                </div>
                                <div className="bar-bg">
                                    <motion.div
                                        className="bar-fill"
                                        style={{ backgroundColor: sub.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sub.percentage}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <style jsx>{`
                    .attendance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
                    .subject-card { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                    .sub-title { display: flex; align-items: center; gap: 10px; }
                    .sub-title h4 { font-size: 1.1rem; font-weight: 700; }
                    .session-count { font-size: 0.8rem; font-weight: 700; background: var(--surface-secondary); padding: 4px 10px; border-radius: 8px; color: var(--text-muted); }
                    
                    .percent-val { font-size: 1.5rem; font-weight: 800; }
                    .status-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
                    
                    .bar-bg { height: 8px; background: var(--surface-secondary); border-radius: 4px; overflow: hidden; }
                    .bar-fill { height: 100%; border-radius: 4px; }
                    .mb-1 { margin-bottom: 8px; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="faculty-attendance">
            <header className="flex-between">
                <div>
                    <h2 className="heading-lg">Mark Attendance</h2>
                    <p className="text-muted">Subject: Mathematics (R101) - Today, {mounted ? new Date().toLocaleDateString() : ""}</p>
                </div>
                <div className="date-pill glass">
                    <Calendar size={18} />
                    <span>Today</span>
                </div>
            </header>

            <div className="student-list-grid mt-4">
                {students.map((s, idx) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="student-record card flex-between"
                    >
                        <div className="student-info">
                            <div className="avatar-circle">{s.avatar}</div>
                            <div>
                                <h4>{s.name}</h4>
                                <p>{s.roll}</p>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="att-btn present"><Check size={20} /></button>
                            <button className="att-btn absent"><X size={20} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
                .faculty-attendance { max-width: 800px; }
                .date-pill { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: var(--radius-full); font-weight: 600; font-size: 0.9rem; }
                
                .student-list-grid { display: flex; flex-direction: column; gap: 16px; }
                .student-record { padding: 16px 24px; }
                .student-info { display: flex; align-items: center; gap: 16px; }
                .avatar-circle { width: 44px; height: 44px; border-radius: 50%; background: var(--surface-secondary); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; }
                .student-info h4 { font-size: 1rem; font-weight: 700; }
                .student-info p { font-size: 0.8rem; color: var(--text-muted); }

                .action-buttons { display: flex; gap: 12px; }
                .att-btn { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .att-btn.present { background: rgba(16, 185, 129, 0.1); color: var(--success); }
                .att-btn.absent { background: rgba(239, 68, 68, 0.1); color: var(--error); }
                .att-btn:hover { transform: scale(1.1); }
            `}</style>
        </div>
    );
}
