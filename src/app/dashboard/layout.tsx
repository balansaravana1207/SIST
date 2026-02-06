"use client";

import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Home,
  BarChart2,
  Calendar,
  CalendarDays,
  MessageSquare,
  LogOut,
  Bell,
  User as UserIcon,
  Search
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart2, label: "Performance", href: "/dashboard/marks" },
  { icon: Calendar, label: "Timetable", href: "/dashboard/timetable" },
  { icon: CalendarDays, label: "Calendar", href: "/dashboard/calendar" },
  { icon: MessageSquare, label: "Announcements", href: "/dashboard/announcements" },
  { icon: UserIcon, label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, user } = useUser();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || "User";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <img src="/logo.jpg" alt="SIST Logo" style={{ height: '48px', width: 'auto', borderRadius: '8px' }} />
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
              >
                <div className={`nav-item ${isActive ? 'active' : ''}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                  {isActive && <motion.div layoutId="activeNav" className="active-indicator" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header glass">
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search for assignments, classes..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="pulse-dot"></span>
            </button>
            <div className="user-profile-trigger">
              <div className="user-info-text">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{profile?.role || 'Student'}</span>
              </div>
              <div className="user-avatar-small">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="content-inner animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="mobile-nav glass">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
            >
              <div className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
                <item.icon size={24} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
            .dashboard-layout {
              display: flex;
              min-height: 100vh;
              background-color: var(--background);
            }

            .sidebar {
              width: var(--sidebar-width);
              background: var(--surface);
              border-right: 1px solid var(--border);
              display: flex;
              flex-direction: column;
              height: 100vh;
              position: sticky;
              top: 0;
              z-index: 50;
            }

            .sidebar-header {
              padding: 32px 24px;
            }

            .logo-box {
              width: fit-content;
              padding: 8px 16px;
              border-radius: var(--radius-md);
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .logo-text {
              color: white;
              font-weight: 800;
              font-size: 1.25rem;
              letter-spacing: 0.1em;
            }

            .sidebar-nav {
              padding: 0 16px;
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .nav-item {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 14px 16px;
              border-radius: var(--radius-md);
              color: var(--text-muted);
              font-weight: 500;
              position: relative;
              transition: all 0.2s ease;
            }

            .nav-item:hover {
              color: var(--primary);
              background: var(--surface-secondary);
            }

            .nav-item.active {
              color: var(--primary);
              font-weight: 600;
              background: var(--surface-secondary);
            }

            .active-indicator {
              position: absolute;
              left: 4px;
              width: 4px;
              height: 20px;
              background: var(--primary);
              border-radius: 4px;
            }

            .main-content {
              flex: 1;
              padding: 24px 40px;
              max-width: 1440px;
              margin: 0 auto;
              width: 100%;
            }

            .main-header {
              height: 72px;
              border-radius: var(--radius-md);
              margin-bottom: 32px;
              padding: 0 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: sticky;
              top: 24px;
              z-index: 40;
            }

            .header-search {
              display: flex;
              align-items: center;
              background: var(--surface-secondary);
              padding: 10px 16px;
              border-radius: var(--radius-md);
              width: 100%;
              max-width: 400px;
              gap: 12px;
            }

            .search-icon {
              color: var(--text-muted);
            }

            .header-search input {
              background: transparent;
              border: none;
              outline: none;
              color: var(--text-main);
              width: 100%;
              font-size: 0.9rem;
              font-weight: 500;
            }

            .header-actions {
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .icon-btn {
              width: 42px;
              height: 42px;
              border-radius: 12px;
              background: var(--surface);
              color: var(--text-main);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              box-shadow: var(--shadow-sm);
            }

            .pulse-dot {
              position: absolute;
              top: 10px;
              right: 10px;
              width: 8px;
              height: 8px;
              background: var(--error);
              border-radius: 50%;
              border: 2px solid var(--surface);
            }

            .user-avatar-small {
              width: 42px;
              height: 42px;
              border-radius: 12px;
              background: var(--surface-secondary);
              color: var(--primary);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: var(--shadow-sm);
              font-weight: 800;
              font-size: 1.1rem;
            }

            .user-profile-trigger {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 4px 4px 4px 12px;
              border-radius: 14px;
              transition: background 0.2s;
              cursor: pointer;
            }

            .user-profile-trigger:hover {
              background: var(--surface-secondary);
            }

            .user-info-text {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            }

            .user-name {
              font-size: 0.9rem;
              font-weight: 700;
              color: var(--text-main);
              line-height: 1.2;
            }

            .user-role {
              font-size: 0.7rem;
              font-weight: 600;
              color: var(--primary);
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            /* Mobile Elements */
            .mobile-nav {
              display: none;
              position: fixed;
              bottom: 24px;
              left: 24px;
              right: 24px;
              height: 72px;
              border-radius: 20px;
              z-index: 100;
              justify-content: space-around;
              align-items: center;
              padding: 0 12px;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }

            .mobile-nav-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
              color: var(--text-muted);
              transition: all 0.2s ease;
            }

            .mobile-nav-item span {
              font-size: 0.65rem;
              font-weight: 600;
            }

            .mobile-nav-item.active {
              color: var(--primary);
            }

            @media (max-width: 1024px) {
              .sidebar { display: none; }
              .mobile-nav { display: flex; }
              .main-content { padding: 24px; margin-bottom: 100px; }
              .main-header { top: 0; border-radius: 0; margin-left: -24px; margin-right: -24px; width: calc(100% + 48px); background: var(--surface); }
            }
          `}</style>
    </div>
  );
}
