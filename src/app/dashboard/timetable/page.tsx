"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<any[]>([]);

    const fetchTimetable = async () => {
        const { data, error } = await supabase
            .from("timetable")
            .select("*");

        if (data) {
            setTimetable(data);
            console.log("Timetable updated from Supabase!");
        } else if (error) {
            console.error("Error fetching timetable:", error.message);
        }
    };

    useEffect(() => {
        // Real-time subscription for timetable updates using Supabase
        fetchTimetable();

        const channel = supabase
            .channel("timetable-all")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "timetable",
                },
                () => {
                    fetchTimetable();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return (
        <div className="timetable-container">
            <div className="card">
                <div className="header-flex">
                    <h3>Weekly Timetable (Firebase)</h3>
                    <span className="timestamp">Last updated: Just now</span>
                </div>

                <div className="table-responsive mt-2">
                    <table className="realtime-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                {days.map(d => <th key={d}>{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>09:00 - 10:00</td>
                                <td>Math (R101)</td>
                                <td>Physics (L1)</td>
                                <td>Math (R101)</td>
                                <td>English (R202)</td>
                                <td>Math (R101)</td>
                            </tr>
                            <tr>
                                <td>10:00 - 11:00</td>
                                <td>Physics (L1)</td>
                                <td>Math (R101)</td>
                                <td>English (R202)</td>
                                <td>Math (R101)</td>
                                <td>Physics (L1)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .header-flex { display: flex; justify-content: space-between; align-items: center; }
        .timestamp { font-size: 0.75rem; color: var(--text-muted); }
        .table-responsive { overflow-x: auto; }
        .realtime-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); }
        .realtime-table th, .realtime-table td { 
          padding: 12px; 
          border: 1px solid var(--border); 
          text-align: center; 
          font-size: 0.9rem;
        }
        .realtime-table th { background: var(--background); color: var(--primary); }
      `}</style>
        </div>
    );
}
