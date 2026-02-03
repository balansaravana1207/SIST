"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to log in");
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h1 className="text-center">SIST Login</h1>
                <p className="text-center text-muted mt-1">Academic Companion Portal (Firebase)</p>

                <form onSubmit={handleLogin} className="mt-2">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="e.g. s12345@college.edu"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p style={{ color: "var(--error)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-2 text-center" style={{ fontSize: "0.875rem" }}>
                    <p className="text-muted">
                        Don't have an account? <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Create one</Link>
                    </p>
                    <p className="text-muted mt-1">Contact Admin if you forgot your credentials</p>
                </div>
            </div>
        </div>
    );
}
