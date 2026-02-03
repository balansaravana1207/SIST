"use client";

import { useUser } from "@/context/UserContext";
import StatCard from "@/components/StatCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const { profile } = useUser();
    const [attendance] = useState(85); // Mock
    const [announcements, setAnnouncements] = useState<any[]>([]);

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        if (data) {
            setAnnouncements(data);
        } else if (error) {
            console.error("Error fetching announcements:", error.message);
        }
    };

    useEffect(() => {
        // Real-time subscription for announcements using Supabase
        fetchAnnouncements();

        const channel = supabase
            .channel("dashboard-announcements")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "announcements",
                },
                () => {
                    fetchAnnouncements();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const role = profile?.role || "student";

    if (role === "student") {
        return (
            <div className="dashboard-grid">
                <section className="stats-row">
                    <StatCard title="Attendance" value={`${attendance}%`} subtext="Overall Percentage" type={attendance < 75 ? "warning" : "success"} />
                    <StatCard title="CGPA" value="8.92" subtext="Last Updated: Yesterday" />
                    <StatCard title="Today's Classes" value="4" subtext="Next: Physics at 11:00 AM" />
                </section>

                <div className="mt-4 grid-two-cols">
                    <div className="card">
                        <h3>Recent Announcements</h3>
                        <div className="announcement-list mt-2">
                            {announcements.length === 0 ? (
                                <p className="text-muted">No new announcements today.</p>
                            ) : (
                                announcements.map(a => (
                                    <div key={a.id} className="announcement-item">
                                        <strong>{a.title}</strong>
                                        <p>{a.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <h3>Upcoming Tasks</h3>
                        <ul className="mt-2 list-unstyled">
                            <li>• Submit Math Assignment (Due 2h)</li>
                            <li>• Lab Records Verification</li>
                        </ul>
                    </div>
                </div>

                <style jsx>{`
          .dashboard-grid { display: flex; flex-direction: column; gap: 24px; }
          .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
          .grid-two-cols { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
          @media (max-width: 900px) { .grid-two-cols { grid-template-columns: 1fr; } }
          .announcement-item { border-bottom: 1px solid var(--border); padding: 12px 0; }
          .announcement-item:last-child { border-bottom: none; }
          .list-unstyled { list-style: none; }
        `}</style>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Welcome, {profile?.full_name || "Faculty Member"}</h3>
            <p className="mt-1">Please use the sidebar to manage attendance and marks.</p>
        </div>
    );
}
