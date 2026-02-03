"use client";

import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <UserProvider>
      <NotificationProvider>
        <div className="dashboard-layout">
          <Sidebar />
          <main className="main-content">
            <header className="main-header">
              <h2 id="page-title">Dashboard</h2>
              <div className="header-actions">
                <NotificationBell />
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: "1rem" }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </header>
            <div className="content-inner">
              {children}
            </div>
          </main>

          <style jsx>{`
            .dashboard-layout {
              display: flex;
              min-height: 100vh;
            }
            .main-content {
              flex: 1;
              margin-left: 260px; /* Width of sidebar */
              padding: 32px;
              background: var(--background);
            }
            .main-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;
            }
            .content-inner {
              max-width: 1100px;
            }
            @media (max-width: 768px) {
              .main-content { margin-left: 0; }
              .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
            }
          `}</style>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
}
