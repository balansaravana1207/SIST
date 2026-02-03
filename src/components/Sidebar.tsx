"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { profile } = useUser();

    const menuItems = {
        student: [
            { name: "Dashboard", path: "/dashboard", icon: "📊" },
            { name: "Timetable", path: "/dashboard/timetable", icon: "📅" },
            { name: "Attendance", path: "/dashboard/attendance", icon: "✅" },
            { name: "Marks", path: "/dashboard/marks", icon: "📝" },
            { name: "Announcements", path: "/dashboard/announcements", icon: "📢" },
        ],
        faculty: [
            { name: "Overview", path: "/dashboard", icon: "📊" },
            { name: "Update Attendance", path: "/dashboard/attendance", icon: "✅" },
            { name: "Enter Marks", path: "/dashboard/marks", icon: "📝" },
            { name: "Announcements", path: "/dashboard/announcements", icon: "📢" },
        ],
        admin: [
            { name: "Control Panel", path: "/dashboard", icon: "⚙️" },
            { name: "User Management", path: "/dashboard/users", icon: "👥" },
            { name: "Timetable Upload", path: "/dashboard/timetable", icon: "📅" },
            { name: "Broadcast", path: "/dashboard/announcements", icon: "📢" },
        ],
    };

    const role = profile?.role || "student"; // Mock default
    const items = menuItems[role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="nav-brand">SIST</span>
                <div className="user-badge mt-1">
                    <small>{profile?.full_name || "Guest"}</small>
                    <span className="role-tag">{role}</span>
                </div>
            </div>

            <nav className="sidebar-nav mt-4">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`nav-item ${pathname === item.path ? "active" : ""}`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
        }
        .role-tag {
          font-size: 0.65rem;
          text-transform: uppercase;
          background: var(--primary);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius);
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .nav-item:hover {
          background: var(--background);
          color: var(--primary);
        }
        .nav-item.active {
          background: var(--primary);
          color: white;
        }
        .icon { font-size: 1.2rem; }
      `}</style>
        </aside>
    );
}
