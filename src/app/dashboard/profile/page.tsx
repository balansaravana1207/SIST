"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Edit2, Save, X, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const refreshProfile = async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      // Refresh the profile data
      await refreshProfile();

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || "");
    setIsEditing(false);
    setMessage(null);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage({ type: "error", text: "Failed to sign out. Please try again." });
      setIsSigningOut(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-container">
        {/* Profile Card */}
        <motion.div
          className="profile-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {(fullName || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <span className="profile-role-badge">{profile?.role || "Student"}</span>
              {user?.created_at && (
                <span className="profile-joined">
                  <Calendar size={14} />
                  Joined {formatDate(user.created_at)}
                </span>
              )}
            </div>
          </div>

          <div className="profile-form">
            {message && (
              <motion.div
                className={`message ${message.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.text}
              </motion.div>
            )}

            <div className="form-group">
              <label>
                <User size={18} />
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className={!isEditing ? "with-edit-btn" : ""}
                />
                {!isEditing && (
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="disabled-input"
              />
              <span className="help-text">Email cannot be changed</span>
            </div>

            <div className="form-group">
              <label>
                <Shield size={18} />
                Role
              </label>
              <input
                type="text"
                value={profile?.role || "Student"}
                disabled
                className="disabled-input"
              />
              <span className="help-text">Contact admin to change your role</span>
            </div>

            {isEditing && (
              <motion.div
                className="form-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaving || !fullName.trim()}
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Account Info Card */}
        <motion.div
          className="info-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Verified</span>
              <span className="info-value">
                {user?.email_confirmed_at ? "✓ Verified" : "✗ Not Verified"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Sign In</span>
              <span className="info-value">
                {user?.last_sign_in_at
                  ? formatDate(user.last_sign_in_at)
                  : "Never"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sign Out Section */}
        <motion.div
          className="signout-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3>Sign Out</h3>
          <p className="signout-description">
            Sign out of your account. You'll need to log in again to access the dashboard.
          </p>
          <button
            className="signout-btn"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut size={18} />
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .profile-header {
          margin-bottom: 32px;
        }

        .profile-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .profile-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-card {
          padding: 32px;
          border-radius: var(--radius-lg);
        }

        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          box-shadow: var(--shadow-lg);
        }

        .profile-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-role-badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--surface-secondary);
          color: var(--primary);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        .profile-joined {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message {
          padding: 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper input {
          flex: 1;
        }

        .edit-btn {
          position: absolute;
          right: 12px;
          padding: 8px;
          background: var(--surface-secondary);
          color: var(--primary);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .edit-btn:hover {
          background: var(--primary);
          color: white;
          transform: scale(1.1);
        }

        input {
          width: 100%;
          padding: 14px 16px;
          background: var(--surface-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--surface);
        }

        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input.with-edit-btn {
          padding-right: 48px;
        }

        .disabled-input {
          background: var(--background) !important;
        }

        .help-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: -4px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .btn {
          padding: 14px 24px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          flex: 1;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
          background: var(--surface-secondary);
          color: var(--text-main);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--background);
        }

        .info-card {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .info-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .signout-card {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .signout-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .signout-description {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .signout-btn {
          padding: 14px 24px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .signout-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-1px);
        }

        .signout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 24px;
          }

          .profile-avatar-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 2rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
