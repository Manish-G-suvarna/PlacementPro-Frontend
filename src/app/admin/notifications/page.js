'use client';
import { useState, useEffect, useCallback } from 'react';
import { Send, CheckCircle, AlertCircle, Bell, X, Clock, Briefcase } from 'lucide-react';
import styles from '../admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TYPE_COLORS = { drive: '#4f46e5', interview: '#10b981', general: '#f59e0b' };

export default function NotificationsPage() {
    const [unnotifiedDrives, setUnnotifiedDrives] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(null);
    const [showConfirm, setShowConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [drivesRes, historyRes] = await Promise.all([
                fetch(`${API}/api/drives`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const drives = drivesRes.ok ? await drivesRes.json() : [];
            const hist = historyRes.ok ? await historyRes.json() : [];
            setUnnotifiedDrives(Array.isArray(drives) ? drives.filter(d => !d.notified && ['upcoming', 'active'].includes(d.status)) : []);
            setHistory(Array.isArray(hist) ? hist : []);
        } catch (err) {
            console.error('Notifications fetch error:', err);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    async function handleSend(drive) {
        setSending(drive.id);
        try {
            const res = await fetch(`${API}/api/notifications/send-drive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ drive_id: drive.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setToast({ type: 'success', msg: data.message });
                fetchData();
            } else {
                setToast({ type: 'error', msg: data.error || 'Failed to send' });
            }
        } catch { setToast({ type: 'error', msg: 'Network error' }); }
        finally {
            setSending(null);
            setShowConfirm(null);
            setTimeout(() => setToast(null), 4000);
        }
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <h2>Notifications</h2>
                <p>Send targeted notifications to eligible students for placement drives</p>
            </div>

            {/* Toast */}
            {toast && (
                <div style={{
                    background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                    border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
                    borderRadius: 10, padding: '12px 18px', marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: toast.type === 'success' ? '#166534' : '#b91c1c',
                    fontSize: 14, fontWeight: 600,
                }}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Pending Drives */}
            <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
                <div className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={16} color="#ef4444" /> Pending — Drives Not Yet Notified ({unnotifiedDrives.length})
                </div>
                {loading ? (
                    <div style={{ padding: '1rem', color: '#9ca3af' }}>Loading...</div>
                ) : unnotifiedDrives.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: 14, padding: 12 }}>
                        <CheckCircle size={14} style={{ display: 'inline', marginRight: 6, color: '#10b981' }} />
                        All active drives have been notified!
                    </p>
                ) : unnotifiedDrives.map(d => (
                    <div key={d.id} className={styles.notifRow}>
                        <div className={styles.notifInfo}>
                            <h4 style={{ fontWeight: 700, marginBottom: 2 }}>{d.company} — {d.role}</h4>
                            <p style={{ color: '#6b7280', fontSize: 13 }}>
                                Drive on {new Date(d.drive_date).toLocaleDateString('en-IN')} ·
                                CGPA ≥ {d.min_cgpa} · Backlogs ≤ {d.max_backlogs} · {d.allowed_branches}
                            </p>
                        </div>
                        <button
                            className={styles.btnPrimary}
                            disabled={sending === d.id}
                            onClick={() => setShowConfirm(d)}
                            style={{ opacity: sending === d.id ? 0.6 : 1 }}>
                            <Send size={14} /> {sending === d.id ? 'Sending...' : 'Send Notification'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Notification History */}
            <div className={styles.card}>
                <div className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="#6b7280" /> Notification History
                </div>
                {history.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: 14, padding: 12 }}>No notifications sent yet.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>TYPE</th>
                                <th>TITLE</th>
                                <th>MESSAGE</th>
                                <th>RECIPIENTS</th>
                                <th>SENT AT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(n => (
                                <tr key={n.id}>
                                    <td>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                            background: TYPE_COLORS[n.type] + '20', color: TYPE_COLORS[n.type],
                                        }}>{n.type}</span>
                                    </td>
                                    <td style={{ fontWeight: 600, maxWidth: 180 }}>{n.title}</td>
                                    <td style={{ fontSize: 12, color: '#6b7280', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {n.message}
                                    </td>
                                    <td style={{ fontWeight: 700, color: '#4f46e5', textAlign: 'center' }}>{n.recipient_count}</td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>
                                        {new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className={styles.modalOverlay} onClick={() => setShowConfirm(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ width: 460 }}>
                        <div className={styles.modalHeader}>
                            <h3>Confirm Notification</h3>
                            <button className={styles.modalClose} onClick={() => setShowConfirm(null)}><X size={18} /></button>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
                            <AlertCircle size={40} style={{ color: '#4f46e5', marginBottom: 12 }} />
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                                {showConfirm.company} — {showConfirm.role}
                            </p>
                            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                                Notifies all eligible students who haven't been notified yet.
                            </p>
                            <p style={{ fontSize: 12, color: '#9ca3af' }}>
                                Criteria: CGPA ≥ {showConfirm.min_cgpa} · Backlogs ≤ {showConfirm.max_backlogs} · {showConfirm.allowed_branches}
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnSecondary} onClick={() => setShowConfirm(null)}>Cancel</button>
                            <button className={styles.btnSuccess} onClick={() => handleSend(showConfirm)} disabled={!!sending}>
                                <Send size={14} /> Send Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
