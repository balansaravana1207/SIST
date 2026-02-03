"use client";

export default function StatCard({ title, value, subtext, type = "default" }: {
    title: string;
    value: string | number;
    subtext?: string;
    type?: "default" | "warning" | "success" | "error"
}) {
    const colors = {
        default: "var(--accent)",
        warning: "var(--warning)",
        success: "var(--success)",
        error: "var(--error)"
    };

    return (
        <div className="card stat-card">
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value" style={{ color: colors[type] }}>{value}</div>
            {subtext && <p className="stat-subtext">{subtext}</p>}

            <style jsx>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-title {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }
        .stat-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
