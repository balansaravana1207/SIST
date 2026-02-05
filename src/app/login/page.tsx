"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Users,
    ArrowRight,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log("🔐 Starting login...");
        console.log("📧 Email:", email);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log("📝 Login response:", { data, error: authError });

            if (authError) {
                console.error("❌ Login error:", authError);
                throw authError;
            }

            console.log("✅ Login successful! User:", data.user?.id);
            console.log("🔄 Refreshing router to propagate auth state...");

            setSuccess(true);
            router.refresh(); // Force refresh to update auth state

            setTimeout(() => {
                console.log("🚀 Redirecting to dashboard...");
                router.push("/dashboard");
            }, 1000);
        } catch (err: any) {
            console.error("🚨 Login failed exception:", err);
            setError(err.message || "Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="login-wrapper">
            {/* Gradient Background */}
            <div className="bg-gradient" />

            <main className="login-container">
                <motion.div
                    className="glass-card"
                    variants={cardVariants}
                    initial="hidden"
                    animate={error ? "shake" : "visible"}
                >
                    {/* Header Section */}
                    <header className="card-header">
                        <div className="university-logo">
                            <img src="/logo.jpg" alt="SIST Logo" className="logo-img" />
                        </div>
                        <h1 className="title">Student Portal Login</h1>
                        <p className="subtitle">Access your academic dashboard</p>
                    </header>

                    {/* Form Section */}
                    <form onSubmit={handleLogin} className="login-form">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="alert-box error"
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="alert-box success"
                                >
                                    <CheckCircle2 size={18} />
                                    <span>Login successful! Redirecting...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Role Selector */}
                        <div className="input-group">
                            <label className="field-label">System Role</label>
                            <div className="custom-select-wrapper">
                                <Users size={20} className="field-icon" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="field-input select"
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <div className="floating-input-wrapper">
                                <Mail size={20} className="field-icon" />
                                <input
                                    type="email"
                                    placeholder=" "
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="field-input"
                                />
                                <label className="floating-placeholder">Email Address</label>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <div className="floating-input-wrapper">
                                <Lock size={20} className="field-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" "
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="field-input"
                                />
                                <label className="floating-placeholder">Password</label>
                                <button
                                    type="button"
                                    className="visibility-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className={`login-btn ${loading ? 'loading' : ''}`}
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <div className="spinner" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="secondary-links">
                                <Link href="#" className="link-text">Forgot Password?</Link>
                                {role === 'student' && (
                                    <Link href="/signup" className="link-text standout">Create Account</Link>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>
            </main>

            <style jsx>{`
                .login-wrapper {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', -apple-system, sans-serif;
                    overflow: hidden;
                }

                .bg-gradient {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%);
                    z-index: -1;
                }

                .bg-gradient::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%;
                    width: 200%; height: 200%;
                    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 70% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 50%);
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-20px, 20px) rotate(5deg); }
                }

                .login-container {
                    padding: 20px;
                    width: 100%;
                    max-width: 440px;
                    z-index: 1;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .card-header { text-align: center; margin-bottom: 32px; }
                
                .university-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .logo-img {
                    height: 80px;
                    width: auto;
                    border-radius: 8px;
                }

                .title { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 8px; }
                .subtitle { color: rgba(255, 255, 255, 0.6); font-size: 0.9rem; }

                .login-form { display: flex; flex-direction: column; gap: 20px; }

                .input-group { position: relative; }
                
                .field-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 8px;
                    padding-left: 4px;
                }

                .floating-input-wrapper, .custom-select-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .field-icon {
                    position: absolute;
                    left: 16px;
                    color: rgba(255, 255, 255, 0.4);
                    pointer-events: none;
                }

                .field-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    padding: 16px 20px 16px 48px;
                    color: white;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                    outline: none;
                }

                .field-input:focus {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
                }

                .floating-placeholder {
                    position: absolute;
                    left: 48px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    pointer-events: none;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }

                .field-input:focus ~ .floating-placeholder,
                .field-input:not(:placeholder-shown) ~ .floating-placeholder {
                    top: -10px;
                    left: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: white;
                    background: #b91c1c;
                    padding: 2px 8px;
                    border-radius: 6px;
                }

                .select {
                    cursor: pointer;
                    appearance: none;
                }

                .select option {
                    background: #b91c1c;
                    color: white;
                }

                .visibility-toggle {
                    position: absolute;
                    right: 16px;
                    background: none; border: none;
                    color: rgba(255, 255, 255, 0.4);
                    cursor: pointer; padding: 4px;
                    transition: color 0.2s;
                }
                
                .visibility-toggle:hover { color: white; }

                .alert-box {
                    display: flex; align-items: center; gap: 12px;
                    padding: 14px 18px; border-radius: 12px;
                    font-size: 0.85rem; font-weight: 600;
                }
                .alert-box.error { background: rgba(239, 68, 68, 0.15); color: #ff6b6b; border: 1px solid rgba(239, 68, 68, 0.2); }
                .alert-box.success { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }

                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: white;
                    color: #b91c1c;
                    border: none;
                    border-radius: 14px;
                    font-size: 1rem;
                    font-weight: 700;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.3);
                }

                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.4);
                    background: #fef2f2;
                }

                .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .spinner {
                    width: 22px; height: 22px;
                    border: 3px solid rgba(185,28,28,0.2);
                    border-top-color: #b91c1c;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .secondary-links {
                    margin-top: 20px;
                    display: flex; align-items: center; justify-content: space-between;
                    font-size: 0.85rem;
                }

                .link-text {
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .link-text:hover { color: white; }
                .link-text.standout { color: white; }
                .link-text.standout:hover { color: #fef2f2; }

                @media (max-width: 480px) {
                    .glass-card { padding: 32px 24px; border-radius: 20px; }
                    .login-container { padding: 16px; }
                }
            `}</style>
        </div>
    );
}
