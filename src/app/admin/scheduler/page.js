'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import styles from '../admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const empty = { drive_id: '', user_id: '', interview_date: '', interview_time: '', location: '', notes: '' };

export default function SchedulerPage() {
    const [slots, setSlots] = useState([]);
    const [drives, setDrives] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(empty);
    const [eligibleForDrive, setEligibleForDrive] = useState([]);
    const [saving, setSaving] = useState(false);
    const [filterDrive, setFilterDrive] = useState('');

    const fetchSlots = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = filterDrive ? `?drive_id=${filterDrive}` : '';
            const res = await fetch(`${API}/api/scheduler${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setSlots(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    }, [filterDrive]);

    const fetchDrives = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/drives`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setDrives(Array.isArray(data) ? data.filter(d => ['upcoming', 'active'].includes(d.status)) : []);
        } catch { }
    }, []);

    useEffect(() => {
        fetchSlots();
        fetchDrives();
    }, [fetchSlots, fetchDrives]);

    // When drive changes in form, load eligible students
    async function onDriveChange(driveId) {
        setForm(p => ({ ...p, drive_id: driveId, user_id: '' }));
        if (!driveId) { setEligibleForDrive([]); return; }
        const res = await fetch(`${API}/api/drives/${driveId}/eligible-students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const data = await res.json();
        setEligibleForDrive(data.students || []);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            // Bulk schedule endpoint
            const payload = {
                drive_id: form.drive_id,
                start_date: form.interview_date, // mapping form fields to expected bulk API
                end_date: form.end_date || form.interview_date,
                start_time: form.interview_time,
                location: form.location,
                notes: form.notes
            };

            const res = await fetch(`${API}/api/scheduler/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const d = await res.json();
                alert(d.message || 'Scheduled successfully');
                setForm(empty);
                setShowForm(false);
                setEligibleForDrive([]);
                fetchSlots();
            }
            else { const err = await res.json(); alert(err.error || 'Failed to schedule'); }
        } catch { } finally { setSaving(false); }
    }

    async function deleteSlot(id) {
        if (!confirm('Cancel this interview slot?')) return;
        await fetch(`${API}/api/scheduler/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchSlots();
    }

    async function updateSlotStatus(id, status) {
        await fetch(`${API}/api/scheduler/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ status }),
        });
        fetchSlots();
    }

    const STATUS_COLORS = { scheduled: '#4f46e5', completed: '#10b981', cancelled: '#ef4444' };

    return (
        <>
            <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Interview Scheduler</h2>
                    <p>Bulk schedule interviews for approved students</p>
                </div>
                <button onClick={() => { setForm(empty); setEligibleForDrive([]); setShowForm(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                    <Plus size={16} /> Bulk Schedule
                </button>
            </div>

            {/* Schedule Form */}
            {showForm && (
                <div className={styles.card} style={{ marginBottom: '1rem', border: '2px solid #4f46e5' }}>
                    <div className={styles.cardTitle}>Bulk Schedule Interviews</div>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Placement Drive (Schedules all Approved Students)</label>
                            <select required style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.drive_id} onChange={e => onDriveChange(e.target.value)}>
                                <option value="">Select Drive</option>
                                {drives.map(d => <option key={d.id} value={d.id}>{d.company} — {d.role}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Start Date</label>
                            <input type="date" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.interview_date} onChange={e => setForm(p => ({ ...p, interview_date: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>End Date (Optional Range)</label>
                            <input type="date" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.end_date || ''} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Interview Time</label>
                            <input type="time" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.interview_time} onChange={e => setForm(p => ({ ...p, interview_time: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Location / Room</label>
                            <input style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Conference Room A" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Notes</label>
                            <input style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special instructions..." />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" disabled={saving || !form.drive_id} style={{ padding: '0.5rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: (saving || !form.drive_id) ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: (saving || !form.drive_id) ? 0.7 : 1 }}>
                                {saving ? 'Scheduling...' : 'Bulk Schedule Interviews'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEligibleForDrive([]); }} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter by Drive */}
            <div style={{ marginBottom: '0.75rem' }}>
                <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                    value={filterDrive} onChange={e => setFilterDrive(e.target.value)}>
                    <option value="">All Drives</option>
                    {drives.map(d => <option key={d.id} value={d.id}>{d.company} — {d.role}</option>)}
                </select>
            </div>

            {/* Slots Table */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Scheduled Interviews ({slots.length})</div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading schedule...</div>
                ) : slots.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                        <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                        <p>No interviews scheduled yet.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Student</th><th>Email</th><th>Company</th><th>Role</th><th>Date</th><th>Time</th><th>Location</th><th>Notes</th><th>Status</th><th></th></tr>
                        </thead>
                        <tbody>
                            {slots.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: 600 }}>{s.student_name}</td>
                                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.student_email}</td>
                                    <td style={{ fontWeight: 700 }}>{s.company}</td>
                                    <td>{s.drive_role}</td>
                                    <td>{new Date(s.interview_date).toLocaleDateString('en-IN')}</td>
                                    <td style={{ fontWeight: 600 }}>{s.interview_time}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.location || '—'}</td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.notes || '—'}</td>
                                    <td>
                                        <select value={s.status} onChange={e => updateSlotStatus(s.id, e.target.value)}
                                            style={{ padding: '0.25rem', border: `1px solid ${STATUS_COLORS[s.status]}`, borderRadius: 4, color: STATUS_COLORS[s.status], fontWeight: 600, fontSize: '0.8rem', background: 'white', cursor: 'pointer' }}>
                                            {['scheduled', 'completed', 'cancelled'].map(st => <option key={st} value={st}>{st}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteSlot(s.id)} style={{ padding: '0.25rem', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                                            <Trash2 size={14} color="#ef4444" />
                                        </button>
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
