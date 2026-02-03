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

    const fetchNotifications = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (data) {
            setNotifications(data as Notification[]);
        } else if (error) {
            console.error("Error fetching notifications:", error.message);
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
