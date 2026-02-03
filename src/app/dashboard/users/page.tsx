"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function UserManagementPage() {
    const { profile } = useUser();
    const [users, setUsers] = useState([
        { id: "1", name: "Alice Brown", role: "student", roll: "S105" },
        { id: "2", name: "Dr. Smith", role: "faculty", roll: "F001" },
    ]);

    if (profile?.role !== "admin") {
        return <div className="card">Access Denied. Admins Only.</div>;
    }

    return (
        <div className="card">
            <div className="header-flex">
                <h3>User Management</h3>
                <button className="btn btn-primary btn-sm">+ Add User</button>
            </div>

            <table className="realtime-table mt-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Roll/ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                            <td>{u.roll}</td>
                            <td>
                                <button className="btn btn-sm btn-outline">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        .header-flex { display: flex; justify-content: space-between; align-items: center; }
        .role-tag { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; }
        .role-tag.student { background: #e3f2fd; color: #1976d2; }
        .role-tag.faculty { background: #f1f8e9; color: #388e3c; }
        .role-tag.admin { background: #fff3e0; color: #f57c00; }
      `}</style>
        </div>
    );
}
