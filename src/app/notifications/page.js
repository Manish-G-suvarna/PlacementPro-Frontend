'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TYPE_ICONS = {
    drive: { icon: Briefcase, color: '#4f46e5', bg: '#ede9fe' },
    interview: { icon: Calendar, color: '#10b981', bg: '#d1fae5' },
    general: { icon: Bell, color: '#f59e0b', bg: '#fef3c7' },
};

export default function NotificationsStudentPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = () => localStorage.getItem('token');

    useEffect(() => {
        if (!user) return;
        fetchNotifications();
    }, [user]);

    async function fetchNotifications() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/notifications/my`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(Array.isArray(data) ? data : []);
            }
        } catch { } finally { setLoading(false); }
    }

    async function markAllRead() {
        await fetch(`${API}/api/notifications/my/read`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token()}` },
        });
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const styles = {
        page: { padding: '1.5rem', maxWidth: 700, margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        h2: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 },
        badge: { background: '#ef4444', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 700, padding: '2px 8px', marginLeft: 8 },
        markBtn: { padding: '0.4rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' },
        card: (read) => ({
            background: read ? '#fff' : '#f8f7ff',
            borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '0.75rem',
            border: `1px solid ${read ? '#e2e8f0' : '#c7d2fe'}`,
            borderLeft: `4px solid ${read ? '#e2e8f0' : '#4f46e5'}`,
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
        }),
        iconBox: (type) => ({
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: TYPE_ICONS[type]?.bg || '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }),
        title: { fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: 2 },
        msg: { fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 },
        time: { fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 },
        dot: { width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', flexShrink: 0, marginTop: 6 },
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.h2}>
                        <Bell size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                        Notifications
                        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>Updates on drives and interviews</p>
                </div>
                {unreadCount > 0 && (
                    <button style={styles.markBtn} onClick={markAllRead}>
                        <CheckCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Mark all read
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
                    <BellOff size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No notifications yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>You'll see drive announcements and interview schedules here.</p>
                </div>
            ) : notifications.map(n => {
                const TypeInfo = TYPE_ICONS[n.type] || TYPE_ICONS.general;
                const Icon = TypeInfo.icon;
                return (
                    <div key={n.id} style={styles.card(n.is_read)}>
                        <div style={styles.iconBox(n.type)}>
                            <Icon size={18} color={TypeInfo.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={styles.title}>{n.title}</div>
                            <div style={styles.msg}>{n.message}</div>
                            <div style={styles.time}>
                                {new Date(n.created_at).toLocaleString('en-IN', {
                                    weekday: 'short', day: 'numeric', month: 'short',
                                    hour: '2-digit', minute: '2-digit',
                                })}
                            </div>
                        </div>
                        {!n.is_read && <div style={styles.dot} />}
                    </div>
                );
            })}
        </div>
    );
}
