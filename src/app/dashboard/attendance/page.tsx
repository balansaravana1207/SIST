"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AttendancePage() {
    const { profile, user } = useUser();
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const role = profile?.role || "student";

    // Mock student list for faculty
    const students = [
        { id: "1", name: "John Doe", roll: "S101" },
        { id: "2", name: "Jane Smith", roll: "S102" },
        { id: "3", name: "Bob Johnson", roll: "S103" },
    ];

    const fetchAttendance = async () => {
        if (role === "student" && user) {
            const { data, error } = await supabase
                .from("attendance")
                .select("*")
                .eq("student_id", user.id);

            if (data) {
                setAttendanceData(data);
            } else if (error) {
                console.error("Error fetching attendance:", error.message);
            }
        }
    };

    useEffect(() => {
        if (role === "student" && user) {
            fetchAttendance();

            const channel = supabase
                .channel(`attendance-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "attendance",
                        filter: `student_id=eq.${user.id}`,
                    },
                    () => {
                        fetchAttendance();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [role, user]);

    const handleMarkAttendance = async (studentId: string, status: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.from("attendance").insert([
                {
                    student_id: studentId,
                    status: status,
                    marked_by: user?.id,
                },
            ]);

            if (error) throw error;
            console.log(`Successfully marked student ${studentId} as ${status}`);
        } catch (error) {
            console.error("Error marking attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    if (role === "student") {
        return (
            <div className="card">
                <h3>My Attendance (Firebase)</h3>
                <p className="text-muted mt-1">Real-time attendance tracking per subject.</p>
                <div className="mt-2">
                    <div className="subject-item">
                        <span>Mathematics</span>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: "85%" }}>85%</div>
                        </div>
                    </div>
                    <div className="subject-item mt-1">
                        <span>Physics</span>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill danger" style={{ width: "62%" }}>62%</div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
          .subject-item { margin-bottom: 20px; }
          .progress-bar-bg { background: var(--border); height: 24px; border-radius: 12px; margin-top: 8px; overflow: hidden; position: relative; }
          .progress-bar-fill { background: var(--success); height: 100%; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; }
          .progress-bar-fill.danger { background: var(--error); }
        `}</style>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Update Attendance</h3>
            <p className="text-muted">Select students to mark attendance for "Mathematics - R101".</p>

            <table className="realtime-table mt-2">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.id}>
                            <td>{s.roll}</td>
                            <td>{s.name}</td>
                            <td className="actions">
                                <button className="btn btn-sm btn-primary" onClick={() => handleMarkAttendance(s.id, 'present')}>Present</button>
                                <button className="btn btn-sm btn-outline" style={{ color: "var(--error)" }} onClick={() => handleMarkAttendance(s.id, 'absent')}>Absent</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        .actions { display: flex; gap: 8px; justify-content: center; }
        .btn-sm { padding: 4px 12px; font-size: 0.8rem; }
      `}</style>
        </div>
    );
}
