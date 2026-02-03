"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type Role = "student" | "faculty" | "admin";

interface UserProfile {
    id: string;
    full_name: string;
    role: Role;
    roll_number?: string;
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    profile: null,
    loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", uid)
                .single();

            if (data) {
                console.log("✅ User Profile Fetched:", data);
                setProfile(data as UserProfile);
            } else if (error) {
                console.warn("⚠️ Error fetching profile:", error.message);
            }
        } catch (error) {
            console.error("❌ Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, profile, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
