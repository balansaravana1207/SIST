"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Clock, MapPin, Search } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const mockSchedule = [
    {
        day: "Monday", slots: [
            { time: "09:00 AM - 10:00 AM", subject: "DevOps", id: "S613BLH62", room: "363", color: "#6d4aff" },
            { time: "10:00 AM - 11:00 AM", subject: "Building Private Blockchain", id: "SCSB1662", room: "363", color: "#8b6eff" },
            { time: "12:15 PM - 01:15 PM", subject: "Intrusion Detection System", id: "S614BLH61", room: "363", color: "#b5a1ff" },
            { time: "01:15 PM - 02:15 PM", subject: "Intrusion Detection System", id: "S614BLH61", room: "363", color: "#6d4aff" },
            { time: "02:15 PM - 03:15 PM", subject: "Smart Contracts", id: "SCSBOB1661", room: "363", color: "#8b6eff" }
        ]
    },
    {
        day: "Tuesday", slots: [
            { time: "09:00 AM - 10:00 AM", subject: "Elective (CBCS)", id: "CBCS", room: "363", color: "#6d4aff" },
            { time: "10:00 AM - 11:00 AM", subject: "DevOps", id: "S613BLH62", room: "363", color: "#8b6eff" },
            { time: "12:15 PM - 01:15 PM", subject: "Elective-3", id: "SCSB3855/3040", room: "363", color: "#b5a1ff" },
            { time: "01:15 PM - 02:15 PM", subject: "Intrusion Detection System", id: "S614BLH61", room: "363", color: "#6d4aff" },
            { time: "02:15 PM - 03:15 PM", subject: "Smart Contracts", id: "SCSBOB1661", room: "363", color: "#8b6eff" }
        ]
    },
    {
        day: "Wednesday", slots: [
            { time: "09:00 AM - 10:00 AM", subject: "Elective (CBCS)", id: "CBCS", room: "363", color: "#6d4aff" },
            { time: "10:00 AM - 11:00 AM", subject: "Smart Contracts", id: "SCSBOB1661", room: "363", color: "#8b6eff" },
            { time: "12:15 PM - 01:15 PM", subject: "Building Private Blockchain", id: "SCSB1662", room: "363", color: "#b5a1ff" },
            { time: "01:15 PM - 02:15 PM", subject: "DevOps", id: "S613BLH62", room: "363", color: "#6d4aff" },
            { time: "02:15 PM - 03:15 PM", subject: "DevOps", id: "S613BLH62", room: "363", color: "#8b6eff" }
        ]
    },
    {
        day: "Thursday", slots: [
            { time: "09:00 AM - 10:00 AM", subject: "Elective (CBCS)", id: "CBCS", room: "363", color: "#6d4aff" },
            { time: "10:00 AM - 11:00 AM", subject: "Intrusion Detection System", id: "S614BLH61", room: "363", color: "#8b6eff" },
            { time: "12:15 PM - 01:15 PM", subject: "Elective-3", id: "SCSB3855/3040", room: "363", color: "#b5a1ff" },
            { time: "01:15 PM - 02:15 PM", subject: "Interdisciplinary Project", id: "S613BIPROJ", room: "363", color: "#6d4aff" },
            { time: "02:15 PM - 03:15 PM", subject: "Interdisciplinary Project", id: "S613BIPROJ", room: "363", color: "#8b6eff" }
        ]
    },
    {
        day: "Friday", slots: [
            { time: "09:00 AM - 10:00 AM", subject: "Intrusion Detection System", id: "S614BLH61", room: "363", color: "#6d4aff" },
            { time: "10:00 AM - 11:00 AM", subject: "Elective-3", id: "SCSB3855/3040", room: "363", color: "#8b6eff" },
            { time: "12:15 PM - 01:15 PM", subject: "DevOps", id: "S613BLH62", room: "363", color: "#b5a1ff" },
            { time: "01:15 PM - 02:15 PM", subject: "Smart Contracts", id: "SCSBOB1661", room: "363", color: "#6d4aff" },
            { time: "02:15 PM - 03:15 PM", subject: "Building Private Blockchain", id: "SCSB1662", room: "363", color: "#8b6eff" }
        ]
    }
];

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<any[]>([]);
    const [selectedDay, setSelectedDay] = useState("Monday");

    useEffect(() => {
        const fetchTimetable = async () => {
            const { data, error } = await supabase.from("timetable").select("*");
            if (data) setTimetable(data);
        };
        fetchTimetable();

        // Use current day as default
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = dayNames[new Date().getDay()];
        if (days.includes(today)) setSelectedDay(today);
    }, []);

    return (
        <div className="timetable-page">
            <header className="flex-between">
                <div>
                    <h2 className="heading-lg">Academic Schedule</h2>
                    <p className="text-muted">B.E - CSE Blockchain Technology | Year: III | Sem: VI</p>
                </div>
                <div className="search-pill glass">
                    <Clock size={18} />
                    <span>Even Semester 2025-2026</span>
                </div>
            </header>

            <section className="day-selector-row mt-4">
                {days.map((day) => (
                    <button
                        key={day}
                        className={`day-selector-btn ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day}
                    </button>
                ))}
            </section>

            <section className="schedule-content mt-4">
                <div className="schedule-grid">
                    {(mockSchedule.find(s => s.day === selectedDay)?.slots || []).map((slot, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="time-card"
                        >
                            <div className="time-strip" style={{ backgroundColor: slot.color }}></div>
                            <div className="card-body">
                                <div className="time-info">
                                    <Clock size={16} />
                                    <span>{slot.time}</span>
                                </div>
                                <h3>{slot.subject}</h3>
                                <p className="course-code-badge">{slot.id}</p>
                                <div className="room-info">
                                    <MapPin size={16} />
                                    <span>Hall: {slot.room}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .timetable-page { max-width: 1000px; }
                .search-pill { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: var(--radius-full); font-weight: 600; font-size: 0.85rem; }
                
                .day-selector-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
                .day-selector-btn { 
                    padding: 10px 24px; border-radius: var(--radius-full); 
                    background: var(--surface); border: 1px solid var(--border);
                    font-weight: 600; color: var(--text-muted); white-space: nowrap;
                    transition: all 0.2s;
                }
                .day-selector-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px rgba(109, 74, 255, 0.3); }

                .schedule-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
                .time-card { background: var(--surface); border-radius: var(--radius-lg); display: flex; overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow-sm); position: relative; }
                .time-strip { width: 6px; }
                .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
                .time-info { display: flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 700; font-size: 0.8rem; }
                .card-body h3 { font-size: 1.05rem; font-weight: 800; color: var(--text-main); line-height: 1.3; }
                .course-code-badge { font-size: 0.75rem; font-weight: 700; color: var(--accent); background: var(--surface-secondary); padding: 4px 10px; border-radius: 6px; width: fit-content; }
                .room-info { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.8rem; font-weight: 600; margin-top: 4px; }

                @media (max-width: 600px) {
                    .search-pill { display: none; }
                }
            `}</style>
        </div>
    );
}
