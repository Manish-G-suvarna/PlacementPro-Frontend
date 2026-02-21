'use client';
import { useState, useEffect } from 'react';
import { Briefcase, Calendar, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_COLORS = {
    upcoming: { bg: '#ede9fe', color: '#6d28d9' },
    active: { bg: '#d1fae5', color: '#065f46' },
    completed: { bg: '#f3f4f6', color: '#6b7280' },
    cancelled: { bg: '#fee2e2', color: '#b91c1c' },
};

const APP_STATUS = {
    pending: { bg: '#fef9c3', color: '#713f12' },
    shortlisted: { bg: '#d1fae5', color: '#065f46' },
    rejected: { bg: '#fee2e2', color: '#b91c1c' },
    placed: { bg: '#ede9fe', color: '#6d28d9' },
};

export default function DrivesStudentPage() {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [tab, setTab] = useState('drives'); // 'drives' | 'interviews'

    const token = () => localStorage.getItem('token');

    useEffect(() => {
        fetchDrives();
        fetchInterviews();
    }, []);

    async function fetchDrives() {
        setLoading(true);
        try {
            // Try eligible endpoint first (requires student_profile)
            const res = await fetch(`${API}/api/drives/eligible`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
                const data = await res.json();
                setDrives(Array.isArray(data) ? data : []);
            } else {
                // Fall back to all drives (no eligibility filter)
                const res2 = await fetch(`${API}/api/drives`, {
                    headers: { Authorization: `Bearer ${token()}` },
                });
                if (res2.ok) {
                    const data = await res2.json();
                    setDrives(Array.isArray(data) ? data : []);
                }
            }
        } catch (err) {
            console.error('Failed to fetch drives:', err);
        } finally { setLoading(false); }
    }

    async function fetchInterviews() {
        try {
            const res = await fetch(`${API}/api/scheduler/my`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setInterviews(Array.isArray(data) ? data : []);
            }
        } catch { }
    }

    async function applyToDrive(driveId) {
        setApplying(driveId);
        try {
            const res = await fetch(`${API}/api/drives/${driveId}/apply`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                setDrives(prev => prev.map(d => d.id === driveId ? { ...d, my_status: 'pending' } : d));
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to apply');
            }
        } catch { } finally { setApplying(null); }
    }

    const styles = {
        page: { padding: '1.5rem', maxWidth: 900, margin: '0 auto' },
        tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
        tab: (active) => ({
            padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
            background: active ? '#0f172a' : '#f1f5f9', color: active ? '#fff' : '#64748b', transition: 'all 0.2s',
        }),
        card: { background: '#fff', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
        title: { fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' },
        sub: { fontSize: '0.85rem', color: '#64748b' },
        badge: (s = 'upcoming') => ({
            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
            background: STATUS_COLORS[s]?.bg || '#f3f4f6', color: STATUS_COLORS[s]?.color || '#374151',
        }),
        appBadge: (s = 'pending') => ({
            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
            background: APP_STATUS[s]?.bg || '#f3f4f6', color: APP_STATUS[s]?.color || '#374151',
        }),
        applyBtn: (applied) => ({
            padding: '0.4rem 1rem', borderRadius: 8, border: 'none', cursor: applied ? 'default' : 'pointer',
            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
            background: applied ? '#f3f4f6' : '#0f172a', color: applied ? '#6b7280' : '#fff',
        }),
    };

    return (
        <div style={styles.page}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Placement Drives</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Drives you are eligible for, based on your profile</p>

            <div style={styles.tabs}>
                <button style={styles.tab(tab === 'drives')} onClick={() => setTab('drives')}>
                    <Briefcase size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Available Drives {drives.length > 0 && `(${drives.length})`}
                </button>
                <button style={styles.tab(tab === 'interviews')} onClick={() => setTab('interviews')}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Applications & Interviews {(interviews.length + drives.filter(d => d.my_status).length) > 0 && `(${interviews.length + drives.filter(d => d.my_status).length})`}
                </button>
            </div>

            {tab === 'drives' && (
                <>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading drives...</div>
                    ) : drives.length === 0 ? (
                        <div style={{ ...styles.card, textAlign: 'center', padding: '3rem' }}>
                            <Briefcase size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                            <p style={{ color: '#9ca3af' }}>No placement drives available right now.</p>
                        </div>
                    ) : drives.map(d => (
                        <div key={d.id} style={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={styles.title}>{d.company}</span>
                                        <span style={styles.badge(d.status)}>{d.status}</span>
                                        {d.my_status && <span style={styles.appBadge(d.my_status)}>Applied: {d.my_status}</span>}
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>{d.role}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                                        <span>💰 {d.package}</span>
                                        <span>📅 {new Date(d.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>📋 Min CGPA: {d.min_cgpa}</span>
                                        <span>🚫 Max Backlogs: {d.max_backlogs}</span>
                                        <span>🎓 {d.allowed_branches}</span>
                                    </div>
                                    {d.description && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>{d.description}</p>}
                                </div>
                                <div style={{ marginLeft: '1rem', flexShrink: 0 }}>
                                    {d.my_status ? (
                                        <button style={styles.applyBtn(true)} disabled>
                                            <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
                                            Applied
                                        </button>
                                    ) : (
                                        <button style={styles.applyBtn(false)} disabled={applying === d.id || !['upcoming', 'active'].includes(d.status)}
                                            onClick={() => applyToDrive(d.id)}>
                                            {applying === d.id ? 'Applying...' : 'Apply Now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {tab === 'interviews' && (
                <>
                    {/* Applied Drives Section */}
                    {drives.filter(d => d.my_status).length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>My Applications</h3>
                            {drives.filter(d => d.my_status).map(d => (
                                <div key={`app-${d.id}`} style={{ ...styles.card, borderLeft: '4px solid #eab308' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <span style={styles.title}>{d.company}</span>
                                                <span style={styles.appBadge(d.my_status)}>Application: {d.my_status}</span>
                                            </div>
                                            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{d.role} · {d.package}</p>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>We will notify you if you are shortlisted for an interview.</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Scheduled Interviews Section */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Scheduled Interviews</h3>
                    {interviews.length === 0 ? (
                        <div style={{ ...styles.card, textAlign: 'center', padding: '3rem' }}>
                            <Calendar size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                            <p style={{ color: '#9ca3af' }}>No interviews scheduled for you yet.</p>
                        </div>
                    ) : interviews.map(s => (
                        <div key={`int-${s.id}`} style={{ ...styles.card, borderLeft: `4px solid ${s.status === 'scheduled' ? '#4f46e5' : s.status === 'completed' ? '#10b981' : '#ef4444'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <span style={styles.title}>{s.company}</span>
                                        <span style={{ ...styles.badge(s.status === 'scheduled' ? 'upcoming' : s.status === 'completed' ? 'completed' : 'cancelled') }}>
                                            {s.status}
                                        </span>
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{s.drive_role} · {s.package}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                        <span>📅 {new Date(s.interview_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span>🕐 {s.interview_time}</span>
                                        {s.location && <span>📍 {s.location}</span>}
                                    </div>
                                    {s.notes && <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: 6 }}>ℹ️ {s.notes}</p>}
                                </div>
                            </div>
                        </div>
                    ))}

                    {drives.filter(d => d.my_status).length === 0 && interviews.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>Apply to drives to see your applications here.</div>
                    )}
                </>
            )}
        </div>
    );
}
