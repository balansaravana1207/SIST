"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MarksPage() {
    const { profile, user } = useUser();
    const [marksData, setMarksData] = useState<any[]>([]);
    const role = profile?.role || "student";

    const fetchMarks = async () => {
        if (role === "student" && user) {
            const { data, error } = await supabase
                .from("marks")
                .select("*")
                .eq("student_id", user.id);

            if (data) {
                setMarksData(data);
            } else if (error) {
                console.error("Error fetching marks:", error.message);
            }
        }
    };

    useEffect(() => {
        if (role === "student" && user) {
            fetchMarks();

            const channel = supabase
                .channel(`marks-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "marks",
                        filter: `student_id=eq.${user.id}`,
                    },
                    () => {
                        fetchMarks();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [role, user]);

    if (role === "student") {
        return (
            <div className="card">
                <h3>Academic Results (Firebase)</h3>
                <table className="realtime-table mt-2">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Internal</th>
                            <th>External</th>
                            <th>Total</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marksData.length > 0 ? (
                            marksData.map(m => (
                                <tr key={m.id}>
                                    <td>{m.subject_name}</td>
                                    <td>{m.internal_marks}</td>
                                    <td>{m.external_marks}</td>
                                    <td>{(m.internal_marks || 0) + (m.external_marks || 0)}</td>
                                    <td>{m.final_grade}</td>
                                </tr>
                            ))
                        ) : (
                            <>
                                <tr>
                                    <td>Mathematics</td>
                                    <td>28/30</td>
                                    <td>65/70</td>
                                    <td>93/100</td>
                                    <td>O</td>
                                </tr>
                                <tr>
                                    <td>Physics</td>
                                    <td>22/30</td>
                                    <td>58/70</td>
                                    <td>80/100</td>
                                    <td>A+</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Enter Marks</h3>
            <p className="text-muted">Faculty portal for marking internals/externals.</p>
            <div className="mt-2">
                <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-input">
                        <option>Mathematics (MAT101)</option>
                        <option>Physics (PHY201)</option>
                    </select>
                </div>
                <p className="mt-2">Student List & Marking Form would go here...</p>
            </div>
        </div>
    );
}
