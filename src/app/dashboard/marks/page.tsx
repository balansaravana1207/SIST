"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Microscope, Award, CheckCircle, ChevronRight, ArrowLeft, Files, Edit3, Beaker } from "lucide-react";

// Full list of subjects from timetable
const allSubjects = [
    { id: "S613BLH62", name: "DevOps", code: "S613BLH62", marks: { cae1: 42, cae2: 45, assignment: 10 } },
    { id: "SCSB1662", name: "Building Private Blockchain", code: "SCSB1662", marks: { cae1: 48, cae2: null, assignment: 10 } },
    { id: "S614BLH61", name: "Intrusion Detection System", code: "S614BLH61", marks: { cae1: 35, cae2: 38, assignment: 9 } },
    { id: "SCSBOB1661", name: "Smart Contracts", code: "SCSBOB1661", marks: { cae1: 50, cae2: 49, assignment: 10 } },
    { id: "SCSB3855", name: "Professional Elective-3", code: "SCSB3855", marks: { cae1: null, cae2: null, assignment: null } },
    { id: "CBCS", name: "Elective (CBCS)", code: "CBCS", marks: { cae1: 40, cae2: 42, assignment: 8 } },
    { id: "LAB_DEVOPS", name: "DevOps Lab", code: "S613BLH62_LH", marks: { practical: 45, assignment: 15 } },
    { id: "S613BIPROJ", name: "Interdisciplinary Project", code: "S613BIPROJ_LH", marks: { practical: null, assignment: 20 } },
];

export default function MarksPage() {
    const { profile, user } = useUser();
    const [activeTab, setActiveTab] = useState<"theory" | "lab">("theory");
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    const displayName = profile?.full_name || user?.email?.split('@')[0] || "Student";

    // Filtering logic: Subjects with "_LH" are Labs, others are Theory
    const filteredSubjects = allSubjects.filter(sub => {
        const isLab = sub.code.endsWith("_LH");
        return activeTab === "lab" ? isLab : !isLab;
    });

    const handleBack = () => setSelectedSubject(null);

    return (
        <div className="performance-page">
            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <header className="flex-between">
                            <div>
                                <h2 className="heading-lg">Performance Portal</h2>
                                <p className="text-muted">Academic track for {displayName}</p>
                            </div>
                        </header>

                        <div className="tabs-pill mt-4">
                            <button
                                className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
                                onClick={() => setActiveTab('theory')}
                            >
                                <Book size={18} /> Theory
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
                                onClick={() => setActiveTab('lab')}
                            >
                                <Beaker size={18} /> Lab
                            </button>
                            <motion.div
                                className="tab-indicator"
                                animate={{ x: activeTab === 'theory' ? 0 : '100%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>

                        <div className="subject-grid mt-4">
                            {filteredSubjects.map((sub: any) => (
                                <div
                                    key={sub.id}
                                    className="subject-card card flex-between"
                                    onClick={() => setSelectedSubject(sub)}
                                >
                                    <div className="sub-info">
                                        <p className="code-text">{sub.code}</p>
                                        <h4 className="name-text">{sub.name}</h4>
                                    </div>
                                    <ChevronRight className="arrow" size={20} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="subject-detail"
                    >
                        <button className="back-btn" onClick={handleBack}>
                            <ArrowLeft size={18} /> Back to Portal
                        </button>

                        <div className="detail-header mt-2">
                            <p className="code-large">{selectedSubject.code}</p>
                            <h2 className="heading-xl">{selectedSubject.name}</h2>
                        </div>

                        <div className="marks-grid mt-4">
                            {activeTab === 'theory' ? (
                                <>
                                    <MarkItem label="CAE 1 (Mid-Term)" value={selectedSubject.marks.cae1} max={50} />
                                    <MarkItem label="CAE 2 (Pre-Model)" value={selectedSubject.marks.cae2} max={50} />
                                    <MarkItem label="Course Assignment" value={selectedSubject.marks.assignment} max={10} />
                                </>
                            ) : (
                                <>
                                    <MarkItem label="Practical Assessment" value={selectedSubject.marks.practical} max={50} icon={<Beaker size={20} />} />
                                    <MarkItem label="Lab Record & Assignment" value={selectedSubject.marks.assignment} max={20} icon={<Files size={20} />} />
                                </>
                            )}
                        </div>

                        <div className="summary-card card mt-4">
                            <h4 className="heading-md">Final Assessment Note</h4>
                            <p className="mt-1 text-muted">
                                {selectedSubject.marks.cae1 === null && selectedSubject.marks.cae2 === null && selectedSubject.marks.practical === null
                                    ? "No major exams have been conducted for this subject yet."
                                    : "Grades are preliminary and subject to final moderation by the department coordinator."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .performance-page { max-width: 900px; padding-bottom: 40px; }
                
                .tabs-pill { display: flex; background: var(--surface-secondary); padding: 6px; border-radius: var(--radius-full); width: fit-content; position: relative; margin-bottom: 24px; }
                .tab-btn { padding: 10px 24px; border-radius: var(--radius-full); font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; color: var(--text-muted); background: transparent; z-index: 2; transition: all 0.3s; }
                .tab-btn.active { color: white; }
                .tab-indicator { position: absolute; top: 6px; left: 6px; bottom: 6px; width: calc(50% - 6px); background: var(--primary); border-radius: var(--radius-full); z-index: 1; box-shadow: 0 4px 12px rgba(109, 74, 255, 0.2); }

                .subject-grid { display: flex; flex-direction: column; gap: 16px; }
                .subject-card { padding: 24px; border: 1px solid var(--border); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .subject-card:hover { border-color: var(--primary); transform: translateX(8px); background: var(--surface-secondary); }
                
                .code-text { font-size: 0.75rem; font-weight: 800; color: var(--primary); letter-spacing: 0.05em; }
                .name-text { font-size: 1.15rem; font-weight: 700; margin: 4px 0; }
                
                .back-btn { display: flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 700; font-size: 0.9rem; background: transparent; margin-bottom: 16px; transition: gap 0.2s; }
                .back-btn:hover { gap: 12px; }
                
                .code-large { font-size: 1rem; font-weight: 800; color: var(--primary); }
                .marks-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
                
                .mark-card { background: var(--surface); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; }
                .mark-header { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; }
                .val-area { display: flex; align-items: baseline; gap: 4px; }
                .current-val { font-size: 2.25rem; font-weight: 800; color: var(--text-main); }
                .max-val { color: var(--text-muted); font-weight: 600; }
                .not-conducted { font-size: 1.1rem; color: var(--error); font-weight: 700; margin: 12px 0; }
                
                .progress-mini { height: 6px; background: var(--surface-secondary); border-radius: 3px; }
                .progress-fill { height: 100%; background: var(--primary); border-radius: 3px; }
            `}</style>
        </div>
    );
}

function MarkItem({ label, value, max, icon = <Edit3 size={20} /> }: any) {
    const percentage = value !== null ? (value / max) * 100 : 0;

    return (
        <div className="mark-card">
            <div className="mark-header">
                {icon}
                <span>{label}</span>
            </div>
            {value !== null ? (
                <>
                    <div className="val-area mt-2">
                        <span className="current-val">{value}</span>
                        <span className="max-val">/ {max}</span>
                    </div>
                    <div className="progress-mini">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </>
            ) : (
                <div className="not-conducted">Exam not conducted</div>
            )}
        </div>
    );
}
