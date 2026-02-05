"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Star
} from "lucide-react";

// Mock events for the college
const collegeEvents = [
    { date: "2026-02-12", title: "Internal Assessment - I", type: "exam", color: "#ef4444" },
    { date: "2026-02-18", title: "College Sports Day", type: "event", color: "#8b6eff" },
    { date: "2026-02-24", title: "Guest Lecture: Web3 & Blockchain", type: "academic", color: "#10b981" },
    { date: "2026-03-05", title: "Cultural Fest 'SIST-FEST'", type: "event", color: "#f59e0b" },
];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const calendarDirs = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDayEvents = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return collegeEvents.filter(e => e.date === dateStr);
    };

    return (
        <div className="calendar-page">
            <header className="flex-between mb-4">
                <div>
                    <h2 className="heading-lg">College Calendar</h2>
                    <p className="text-muted">Academic events and important dates</p>
                </div>
                <div className="calendar-controls glass">
                    <button onClick={prevMonth} className="icon-btn-small"><ChevronLeft size={20} /></button>
                    <span className="month-display">{monthName} {year}</span>
                    <button onClick={nextMonth} className="icon-btn-small"><ChevronRight size={20} /></button>
                </div>
            </header>

            <div className="calendar-container glass">
                <div className="calendar-grid-header">
                    {calendarDirs.map(day => (
                        <div key={day} className="day-name">{day}</div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                    ))}
                    {Array.from({ length: numDays }).map((_, i) => {
                        const day = i + 1;
                        const events = getDayEvents(day);
                        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.01 }}
                                className={`calendar-day ${isToday ? 'today' : ''}`}
                            >
                                <span className="day-number">{day}</span>
                                <div className="event-indicators">
                                    {events.map((e, idx) => (
                                        <div
                                            key={idx}
                                            className="event-dot"
                                            style={{ backgroundColor: e.color }}
                                            title={e.title}
                                        />
                                    ))}
                                </div>
                                {events.length > 0 && (
                                    <div className="day-event-preview">
                                        {events[0].title}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <section className="upcoming-events-list mt-8">
                <h3 className="heading-md mb-4">Upcoming This Month</h3>
                <div className="events-stack">
                    {collegeEvents.filter(e => {
                        const d = new Date(e.date);
                        return d.getMonth() === month && d.getFullYear() === year;
                    }).map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="event-card-horizontal glass"
                        >
                            <div className="event-date-box" style={{ backgroundColor: event.color + '20', color: event.color }}>
                                <span className="d-num">{event.date.split('-')[2]}</span>
                                <span className="d-mon">{monthName.substring(0, 3)}</span>
                            </div>
                            <div className="event-details">
                                <h4>{event.title}</h4>
                                <div className="event-meta">
                                    <span><Clock size={14} /> 9:00 AM</span>
                                    <span><MapPin size={14} /> Main Campus</span>
                                </div>
                            </div>
                            <Star className="fav-icon" size={18} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .calendar-page { max-width: 1000px; padding-bottom: 50px; }
                
                .calendar-controls { display: flex; align-items: center; gap: 16px; padding: 4px 12px; border-radius: 12px; }
                .month-display { font-weight: 700; font-size: 1.1rem; min-width: 140px; text-align: center; color: var(--primary); }
                
                .calendar-container { padding: 20px; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; }
                
                .calendar-grid-header { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 12px; }
                .day-name { text-align: center; font-weight: 800; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                
                .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
                
                .calendar-day { 
                    aspect-ratio: 1; background: var(--surface); border-radius: 12px; padding: 8px; border: 1px solid var(--border);
                    display: flex; flex-direction: column; gap: 4px; position: relative; cursor: pointer; transition: all 0.2s;
                }
                .calendar-day:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
                .calendar-day.empty { background: transparent; border: none; }
                .calendar-day.today { border-color: var(--primary); background: var(--surface-secondary); }
                .calendar-day.today .day-number { color: var(--primary); font-weight: 900; }
                
                .day-number { font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
                
                .event-indicators { display: flex; gap: 4px; }
                .event-dot { width: 6px; height: 6px; border-radius: 50%; }
                
                .day-event-preview { font-size: 0.65rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; font-weight: 600; }
                
                .events-stack { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
                .event-card-horizontal { 
                    display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 18px; 
                    border: 1px solid var(--border); transition: all 0.3s;
                }
                .event-card-horizontal:hover { border-color: var(--primary); transform: scale(1.02); }
                
                .event-date-box { 
                    width: 56px; height: 56px; border-radius: 14px; display: flex; flex-direction: column; 
                    align-items: center; justify-content: center; line-height: 1;
                }
                .d-num { font-size: 1.5rem; font-weight: 800; }
                .d-mon { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                
                .event-details h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
                .event-meta { display: flex; gap: 12px; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
                .event-meta span { display: flex; align-items: center; gap: 4px; }
                
                .fav-icon { margin-left: auto; color: var(--text-muted); cursor: pointer; }
                .fav-icon:hover { color: #f59e0b; fill: #f59e0b; }
                
                @media (max-width: 768px) {
                    .calendar-day { padding: 4px; }
                    .day-number { font-size: 0.8rem; }
                    .day-event-preview { display: none; }
                }
            `}</style>
        </div>
    );
}
