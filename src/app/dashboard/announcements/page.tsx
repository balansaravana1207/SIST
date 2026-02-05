"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function AnnouncementsPage() {
    const { profile } = useUser();
    const [mounted, setMounted] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setAnnouncements(data);
    };

    useEffect(() => {
        setMounted(true);
        fetchAnnouncements();

        const channel = supabase
            .channel("assignments-updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "announcements" },
                () => fetchAnnouncements()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const role = profile?.role || "student";
    const todayDateString = mounted ? new Date().toLocaleDateString() : "";

    const demoGroups = [
        {
            date: "Today, " + todayDateString,
            items: [
                { id: 101, title: "Assignment: Impact of 1913 events", content: "Votes for Woman", status: "late" },
            ]
        },
        {
            date: "Upcoming Tasks",
            items: [
                { id: 102, title: "Group assignment: Calculus Project", content: "Submit by Friday", status: "pending" },
                { id: 103, title: "Lab Record: Chemistry", content: "Experiments on chemical equilibrium and kinetics.", status: "pending" }
            ]
        }
    ];

    const displayGroups = (announcements && announcements.length > 0)
        ? [{ date: "Recent Updates", items: announcements }]
        : demoGroups;

    return (
        <div className="assignments-page">
            <header className="flex-between">
                <h2 className="heading-lg">Your Assignments</h2>
                {role !== "student" && (
                    <button className="btn btn-primary btn-sm">
                        <Plus size={18} /> New Task
                    </button>
                )}
            </header>

            <div className="assignments-container mt-4">
                {displayGroups.map((group, gIdx) => (
                    <div key={gIdx} className="date-group mt-4">
                        <h4 className="date-label">{group.date}</h4>
                        <div className="assignment-stack mt-2">
                            {group.items.map((item, iIdx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (gIdx * 0.2) + (iIdx * 0.1) }}
                                    className="assignment-card"
                                >
                                    <div className="card-top flex-between">
                                        <div className="title-area">
                                            <h3>{item.title}</h3>
                                            <p>{item.content}</p>
                                        </div>
                                        <div className={`status-dot ${item.status === 'late' ? 'late' : ''}`}>
                                            {item.status === 'late' ? <AlertCircle size={20} /> : <Clock size={20} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .assignments-page { max-width: 800px; }
                .date-label { 
                    font-size: 0.85rem; 
                    font-weight: 700; 
                    color: var(--text-main); 
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .assignment-stack { display: flex; flex-direction: column; gap: 16px; }
                .assignment-card {
                    background: var(--surface);
                    padding: 24px;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }
                .assignment-card:hover { border-color: var(--primary); transform: translateX(4px); }
                .title-area h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
                .title-area p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
                
                .status-dot {
                    width: 44px; height: 44px;
                    background: var(--surface-secondary);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--primary);
                }
                .status-dot.late { color: var(--error); background: rgba(239, 68, 68, 0.05); }

                @media (max-width: 600px) {
                    .assignment-card { padding: 16px; }
                }
            `}</style>
        </div>
    );
}
