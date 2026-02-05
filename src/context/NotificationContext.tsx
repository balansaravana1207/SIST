"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    user_id: string;
}

const NotificationContext = createContext<{
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
}>({
    notifications: [],
    unreadCount: 0,
    markAsRead: () => { },
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasLoggedError, setHasLoggedError] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;

        // Skip fetching if Supabase URL is not configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            if (!hasLoggedError) {
                console.warn("⚠️ Notifications disabled: NEXT_PUBLIC_SUPABASE_URL is not configured.");
                setHasLoggedError(true);
            }
            return;
        }

        try {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                // Only log once to avoid console spam
                if (!hasLoggedError) {
                    console.warn("⚠️ Could not fetch notifications:", error.message);
                    setHasLoggedError(true);
                }
            } else if (data) {
                setNotifications(data as Notification[]);
                setHasLoggedError(false); // Reset on successful fetch
            }
        } catch (err: any) {
            // Gracefully handle network errors (e.g., Supabase unreachable)
            if (!hasLoggedError) {
                console.warn("⚠️ Notifications unavailable: Unable to connect to the server.");
                setHasLoggedError(true);
            }
            // Keep existing notifications or set empty array
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel(`notifications-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
