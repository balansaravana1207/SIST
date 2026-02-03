"use client";

import { useNotifications } from "@/context/NotificationContext";
import { useState } from "react";

export default function NotificationBell() {
    const { unreadCount, notifications, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="notification-bell-container">
            <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
                🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notifications-dropdown card">
                    <h4>Notifications</h4>
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <p className="text-muted p-2">No notifications yet.</p>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`notification-item ${n.is_read ? "read" : "unread"}`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <strong>{n.title}</strong>
                                    <p>{n.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        .notification-bell-container { position: relative; }
        .bell-btn { background: none; border: none; font-size: 1.5rem; position: relative; cursor: pointer; }
        .badge { 
          position: absolute; top: -5px; right: -5px; 
          background: var(--error); color: white; 
          font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; 
        }
        .notifications-dropdown { 
          position: absolute; right: 0; top: 40px; 
          width: 300px; max-height: 400px; 
          overflow-y: auto; z-index: 1000; 
          padding: 10px;
        }
        .notification-item { padding: 10px; border-bottom: 1px solid var(--border); cursor: pointer; }
        .notification-item.unread { background: #f0f7ff; }
        .notification-item:hover { background: var(--background); }
      `}</style>
        </div>
    );
}
