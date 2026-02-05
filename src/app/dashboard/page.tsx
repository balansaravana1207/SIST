"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    BookOpen,
    Award,
    Clock,
    ChevronRight,
    Calendar as CalendarIcon,
    MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";

const days = [
    { label: "S", full: "Sunday" },
    { label: "M", full: "Monday" },
    { label: "T", full: "Tuesday" },
    { label: "W", full: "Wednesday" },
    { label: "T", full: "Thursday" },
    { label: "F", full: "Friday" },
    { label: "S", full: "Saturday" },
];

const scheduleData: any = {
    1: [ // Monday
        { id: "S613BLH62", name: "DevOps", time: "9:00 AM - 10:00 AM", icon: BookOpen, color: "#8b6eff" },
        { id: "SCSB1662", name: "Building Private Blockchain", time: "10:00 AM - 11:00 AM", icon: Award, color: "#6d4aff" },
        { id: "S614BLH61", name: "Intrusion Detection System", time: "12:15 PM - 1:15 PM", icon: BookOpen, color: "#b5a1ff" },
        { id: "S614BLH61", name: "Intrusion Detection System", time: "1:15 PM - 2:15 PM", icon: BookOpen, color: "#8b6eff" },
        { id: "SCSBOB1661", name: "Smart Contracts", time: "2:15 PM - 3:15 PM", icon: Award, color: "#6d4aff" },
    ],
    2: [ // Tuesday
        { id: "CBCS", name: "Elective (CBCS)", time: "9:00 AM - 10:00 AM", icon: BookOpen, color: "#b5a1ff" },
        { id: "S613BLH62", name: "DevOps", time: "10:00 AM - 11:00 AM", icon: BookOpen, color: "#8b6eff" },
        { id: "SCSB3855", name: "Professional Elective-3", time: "12:15 PM - 1:15 PM", icon: Award, color: "#6d4aff" },
        { id: "S614BLH61", name: "Intrusion Detection System", time: "1:15 PM - 2:15 PM", icon: BookOpen, color: "#b5a1ff" },
        { id: "SCSBOB1661", name: "Smart Contracts", time: "2:15 PM - 3:15 PM", icon: Award, color: "#8b6eff" },
    ],
    3: [ // Wednesday
        { id: "CBCS", name: "Elective (CBCS)", time: "9:00 AM - 10:00 AM", icon: BookOpen, color: "#6d4aff" },
        { id: "SCSBOB1661", name: "Smart Contracts", time: "10:00 AM - 11:00 AM", icon: Award, color: "#b5a1ff" },
        { id: "SCSB1662", name: "Building Private Blockchain", time: "12:15 PM - 1:15 PM", icon: BookOpen, color: "#8b6eff" },
        { id: "S613BLH62", name: "DevOps", time: "1:15 PM - 2:15 PM", icon: BookOpen, color: "#6d4aff" },
        { id: "S613BLH62", name: "DevOps", time: "2:15 PM - 3:15 PM", icon: BookOpen, color: "#b5a1ff" },
    ],
    4: [ // Thursday
        { id: "CBCS", name: "Elective (CBCS)", time: "9:00 AM - 10:00 AM", icon: BookOpen, color: "#8b6eff" },
        { id: "S614BLH61", name: "Intrusion Detection System", time: "10:00 AM - 11:00 AM", icon: BookOpen, color: "#6d4aff" },
        { id: "SCSB3855", name: "Professional Elective-3", time: "12:15 PM - 1:15 PM", icon: Award, color: "#b5a1ff" },
        { id: "S613BIPROJ", name: "Interdisciplinary Project", time: "1:15 PM - 2:15 PM", icon: Award, color: "#8b6eff" },
        { id: "S613BIPROJ", name: "Interdisciplinary Project", time: "2:15 PM - 3:15 PM", icon: Award, color: "#6d4aff" },
    ],
    5: [ // Friday
        { id: "S614BLH61", name: "Intrusion Detection System", time: "9:00 AM - 10:00 AM", icon: BookOpen, color: "#b5a1ff" },
        { id: "SCSB3855", name: "Professional Elective-3", time: "10:00 AM - 11:00 AM", icon: Award, color: "#8b6eff" },
        { id: "S613BLH62", name: "DevOps", time: "12:15 PM - 1:15 PM", icon: BookOpen, color: "#6d4aff" },
        { id: "SCSBOB1661", name: "Smart Contracts", time: "1:15 PM - 2:15 PM", icon: Award, color: "#b5a1ff" },
        { id: "SCSB1662", name: "Building Private Blockchain", time: "2:15 PM - 3:15 PM", icon: BookOpen, color: "#8b6eff" },
    ],
};

export default function DashboardPage() {
    const { profile, user } = useUser();
    const [mounted, setMounted] = useState(false);
    const [currentDay, setCurrentDay] = useState(1);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const today = new Date().getDay();
        // Default to Monday (1) if it's weekend (0 or 6)
        setCurrentDay(today === 0 || today === 6 ? 1 : today);

        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from("announcements")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            if (data) setAnnouncements(data);
        };
        fetchAnnouncements();
    }, []);

    const displayName = profile?.full_name || user?.email?.split('@')[0] || "User";
    const hour = mounted ? new Date().getHours() : 12;
    const greeting = hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";

    const dailyClasses = scheduleData[currentDay] || [];

    return (
        <div className="home-dashboard">
            <header className="welcome-section">
                <p className="greeting-sub">{greeting},</p>
                <h1 className="heading-xl">{displayName.toUpperCase()}</h1>
            </header>

            <section className="stats-grid">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="stat-card accent"
                >
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Overall Attendance</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="stat-card"
                >
                    <div className="stat-value">8.92</div>
                    <div className="stat-label">Current CGPA</div>
                </motion.div>
            </section>

            <div className="dashboard-content-grid">
                <div className="schedule-section">
                    <div className="section-header">
                        <h3 className="heading-md">Class Schedule</h3>
                    </div>

                    <div className="day-picker mt-2">
                        {days.map((day, idx) => (
                            <div
                                key={idx}
                                className={`day-item ${idx === currentDay ? 'selected' : ''}`}
                                onClick={() => setCurrentDay(idx)}
                                style={{ cursor: 'pointer' }}
                            >
                                {day.label}
                            </div>
                        ))}
                    </div>

                    <div className="class-list mt-2">
                        {dailyClasses.length > 0 ? (
                            dailyClasses.map((cls: any, idx: number) => (
                                <motion.div
                                    key={`${currentDay}-${idx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="class-item"
                                >
                                    <div className="class-icon-box" style={{ backgroundColor: cls.color + '20', color: cls.color }}>
                                        <cls.icon size={20} />
                                    </div>
                                    <div className="class-info">
                                        <h4>{cls.id}</h4>
                                        <p>{cls.name}</p>
                                        <small>{cls.time}</small>
                                    </div>
                                    <ChevronRight className="arrow-icon" size={20} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-state card p-4">
                                <p className="text-muted">No classes scheduled for this day.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="announcements-mini">
                    <div className="section-header flex-between">
                        <h3 className="heading-md">Recent News</h3>
                        <button className="icon-btn-small"><MoreVertical size={18} /></button>
                    </div>

                    <div className="announcement-stack mt-2">
                        {announcements.length === 0 ? (
                            <div className="empty-state p-4">
                                <p className="text-muted">No major announcements for today.</p>
                            </div>
                        ) : (
                            announcements.map((a, idx) => (
                                <div key={a.id} className="news-item">
                                    <strong>{a.title}</strong>
                                    <p>{a.content.substring(0, 60)}...</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .home-dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .greeting-sub {
                    color: var(--text-muted);
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    font-size: 0.8rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .stat-card {
                    background: var(--surface);
                    padding: 32px 24px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border);
                    display: flex; flex-direction: column; gap: 4px;
                }

                .stat-card.accent { background: var(--surface-secondary); border-color: var(--accent); }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .stat-label {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .dashboard-content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }

                .day-picker {
                    display: flex; justify-content: space-between; background: var(--surface);
                    padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border);
                }

                .day-item {
                    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
                    border-radius: 12px; font-weight: 600; color: var(--text-muted); transition: all 0.2s ease;
                }

                .day-item.selected { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(109, 74, 255, 0.3); }

                .class-list { display: flex; flex-direction: column; gap: 16px; }

                .class-item {
                    background: var(--surface); padding: 16px 20px; border-radius: var(--radius-md);
                    display: flex; align-items: center; gap: 16px; border: 1px solid var(--border);
                    cursor: pointer; transition: all 0.2s ease;
                }

                .class-item:hover { border-color: var(--primary); transform: translateX(4px); box-shadow: var(--shadow-sm); }

                .class-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }

                .class-info h4 { font-size: 1rem; font-weight: 700; }
                .class-info p { font-size: 0.85rem; color: var(--text-main); font-weight: 600; margin: 2px 0; }
                .class-info small { font-size: 0.75rem; color: var(--text-muted); display: block; }

                .arrow-icon { margin-left: auto; color: var(--text-muted); }

                .news-item { padding: 16px; border-bottom: 1px solid var(--border); }

                .news-item:last-child {
                    border-bottom: none;
                }

                .news-item strong {
                    font-size: 0.9rem;
                    display: block;
                    margin-bottom: 4px;
                }

                .news-item p {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .icon-btn-small { background: var(--surface-secondary); color: var(--primary); width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

                @media (max-width: 900px) { .dashboard-content-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
