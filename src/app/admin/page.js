'use client';
import { useState, useEffect, useCallback } from 'react';
import { Briefcase, Users, Calendar, Bell, TrendingUp, Clock } from 'lucide-react';
import styles from './admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_COLORS = {
    upcoming: { bg: '#ede9fe', color: '#6d28d9' },
    active: { bg: '#d1fae5', color: '#065f46' },
    completed: { bg: '#f3f4f6', color: '#6b7280' },
    cancelled: { bg: '#fee2e2', color: '#b91c1c' },
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentDrives, setRecentDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentDrives(data.recentDrives || []);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const statCards = stats ? [
        {
            icon: Briefcase, label: 'ACTIVE DRIVES', value: stats.activeDrives, color: '#4f46e5',
            sub: `${stats.totalDrives} total drives`,
        },
        {
            icon: Users, label: 'TOTAL STUDENTS', value: stats.totalStudents, color: '#10b981',
            sub: 'Across all branches',
        },
        {
            icon: Calendar, label: 'INTERVIEWS SCHEDULED', value: stats.interviewsScheduled, color: '#f59e0b',
            sub: 'Upcoming sessions',
        },
        {
            icon: Bell, label: 'PENDING NOTIFICATIONS', value: stats.pendingNotifications, color: '#ef4444',
            sub: 'Drives not yet notified',
        },
    ] : [];

    return (
        <>
            <div className={styles.pageHeader}>
                <h2>Dashboard</h2>
                <p>Overview of placement activities</p>
            </div>

            {/* Stat cards */}
            <div className={styles.summaryGrid}>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.summaryCard} style={{ opacity: 0.5 }}>
                            <div className={styles.label}>Loading...</div>
                            <div className={styles.value} style={{ background: '#f3f4f6', borderRadius: 6, height: 38, width: 80, marginTop: 4, marginBottom: 4 }} />
                            <div className={styles.sub} style={{ background: '#f3f4f6', borderRadius: 4, height: 16, width: 120 }} />
                        </div>
                    ))
                ) : (
                    statCards.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className={styles.summaryCard}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div className={styles.label}>{s.label}</div>
                                    <div style={{ padding: '6px', background: `${s.color}15`, borderRadius: '8px', color: s.color, display: 'flex' }}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                                <div className={styles.value}>{s.value}</div>
                                <div className={styles.sub}>{s.sub}</div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Recent Drives */}
            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                <div className={styles.cardTitle}>Recent Placement Drives</div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading drives...</div>
                ) : recentDrives.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                        No placement drives created yet. Go to <strong>Drives</strong> to add one.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>COMPANY</th>
                                <th>ROLE</th>
                                <th>PACKAGE</th>
                                <th>DRIVE DATE</th>
                                <th>ELIGIBLE</th>
                                <th>APPLIED</th>
                                <th>STATUS</th>
                                <th>NOTIFIED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDrives.map(d => (
                                <tr key={d.id}>
                                    <td style={{ fontWeight: 700 }}>{d.company}</td>
                                    <td>{d.role}</td>
                                    <td style={{ color: '#10b981', fontWeight: 600 }}>{d.package}</td>
                                    <td>{new Date(d.drive_date).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: '#4f46e5' }}>{d.eligible_count}</span>
                                    </td>
                                    <td>{d.applications_count}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                            background: STATUS_COLORS[d.status]?.bg || '#f3f4f6',
                                            color: STATUS_COLORS[d.status]?.color || '#374151',
                                        }}>
                                            {d.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {d.notified ? (
                                            <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>✔ Sent</span>
                                        ) : (
                                            <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 13 }}>✘ Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
