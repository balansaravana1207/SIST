"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AnnouncementsPage() {
    const { profile, user } = useUser();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const role = profile?.role || "student";

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setAnnouncements(data);
        } else if (error) {
            console.error("Error fetching announcements:", error.message);
        }
    };

    useEffect(() => {
        fetchAnnouncements();

        const channel = supabase
            .channel("announcements-all")
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

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from("announcements").insert([
                {
                    title: newTitle,
                    content: newContent,
                    created_by: user?.id,
                    target_role: "all",
                },
            ]);

            if (error) throw error;
            setNewTitle("");
            setNewContent("");
        } catch (error) {
            console.error("Error posting announcement:", error);
        }
    };

    return (
        <div className="announcements-container">
            {(role === "admin" || role === "faculty") && (
                <div className="card mb-4">
                    <h3>Post New Announcement</h3>
                    <form onSubmit={handlePost} className="mt-2">
                        <div className="form-group">
                            <input
                                className="form-input"
                                placeholder="Title"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-input"
                                placeholder="Contents..."
                                rows={3}
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">Broadcast Now</button>
                    </form>
                </div>
            )}

            <div className="card mt-4">
                <h3>Official Announcements</h3>
                <div className="announcement-feed mt-2">
                    {announcements.map(a => (
                        <div key={a.id} className="announcement-card">
                            <div className="a-header">
                                <strong>{a.title}</strong>
                                <span className="a-date">{a.created_at?.toDate() ? a.created_at.toDate().toLocaleDateString() : "Just now"}</span>
                            </div>
                            <p className="mt-1">{a.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .announcements-container { display: flex; flex-direction: column; gap: 20px; }
        .announcement-card { padding: 16px; border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; }
        .a-header { display: flex; justify-content: space-between; }
        .a-date { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
}
