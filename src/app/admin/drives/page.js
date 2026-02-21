'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, Users, ChevronDown } from 'lucide-react';
import styles from '../admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BRANCHES = ['All', 'Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical', 'Mechanical', 'Civil'];

const empty = { company: '', role: '', package: '', drive_date: '', min_cgpa: '', max_backlogs: '', allowed_branches: 'All', description: '' };

export default function DrivesPage() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(empty);
    const [editId, setEditId] = useState(null);
    const [eligibleModal, setEligibleModal] = useState(null); // { drive, students }
    const [applicationsModal, setApplicationsModal] = useState(null); // { drive, applications }
    const [saving, setSaving] = useState(false);

    const fetchDrives = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/drives`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setDrives(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchDrives(); }, [fetchDrives]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editId ? `${API}/api/drives/${editId}` : `${API}/api/drives`;
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ ...form, package: form.package }),
            });
            if (res.ok) { setForm(empty); setEditId(null); setShowForm(false); fetchDrives(); }
        } catch { } finally { setSaving(false); }
    }

    async function deleteDrive(id) {
        if (!confirm('Delete this drive?')) return;
        await fetch(`${API}/api/drives/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchDrives();
    }

    async function viewEligible(drive) {
        const res = await fetch(`${API}/api/drives/${drive.id}/eligible-students`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const data = await res.json();
        setEligibleModal({ drive, students: data.students || [] });
    }

    async function viewApplications(drive) {
        try {
            console.log("Fetching applications for drive", drive.id);
            const res = await fetch(`${API}/api/drives/${drive.id}/applications`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            console.log("Res:", res.status, res.statusText);
            if (res.ok) {
                const data = await res.json();
                console.log("Data:", data);
                setApplicationsModal({ drive, applications: data.applications || [] });
            } else {
                const err = await res.json();
                console.error("API Error", err);
                alert("Error fetching apps: " + JSON.stringify(err));
            }
        } catch (e) {
            console.error("Fetch failed", e);
            alert("Fetch failed: " + e.message);
        }
    }

    async function updateAppStatus(driveId, userId, status) {
        const res = await fetch(`${API}/api/drives/${driveId}/applications/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            // Update local state to reflect changes instantly
            setApplicationsModal(prev => ({
                ...prev,
                applications: prev.applications.map(app => app.user_id === userId ? { ...app, status } : app)
            }));
        }
    }

    async function updateStatus(id, status) {
        await fetch(`${API}/api/drives/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ status }),
        });
        fetchDrives();
    }

    const STATUS_COLORS = { upcoming: '#4f46e5', active: '#10b981', completed: '#6b7280', cancelled: '#ef4444' };

    return (
        <>
            <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Placement Drives ({drives.length})</h2>
                    <p>Manage company drives and criteria</p>
                </div>
                <button onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                    <Plus size={16} /> New Drive
                </button>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <div className={styles.card} style={{ marginBottom: '1rem', border: '2px solid #4f46e5' }}>
                    <div className={styles.cardTitle}>{editId ? 'Edit Drive' : 'New Placement Drive'}</div>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        {[
                            { label: 'Company', key: 'company', required: true },
                            { label: 'Role / Position', key: 'role', required: true },
                            { label: 'Package (LPA)', key: 'package', required: true },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>{f.label}</label>
                                <input required={f.required} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                    value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                            </div>
                        ))}
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Drive Date</label>
                            <input type="date" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.drive_date} onChange={e => setForm(p => ({ ...p, drive_date: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Min CGPA</label>
                            <input type="number" step="0.1" min="0" max="10" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.min_cgpa} onChange={e => setForm(p => ({ ...p, min_cgpa: e.target.value }))} placeholder="0" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Max Backlogs</label>
                            <input type="number" min="0" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.max_backlogs} onChange={e => setForm(p => ({ ...p, max_backlogs: e.target.value }))} placeholder="99" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Allowed Branches (comma-separated or "All")</label>
                            <input style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={form.allowed_branches} onChange={e => setForm(p => ({ ...p, allowed_branches: e.target.value }))} placeholder="All" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Description</label>
                            <textarea rows={2} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem', resize: 'vertical' }}
                                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                                {saving ? 'Saving...' : (editId ? 'Update Drive' : 'Create Drive')}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Drives Table */}
            <div className={styles.card}>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading drives...</div> : (
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Company</th><th>Role</th><th>Package</th><th>Drive Date</th><th>Criteria</th><th>Branches</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {drives.map(d => (
                                <tr key={d.id}>
                                    <td style={{ fontWeight: 700 }}>{d.company}</td>
                                    <td>{d.role}</td>
                                    <td style={{ color: '#10b981', fontWeight: 600 }}>{d.package}</td>
                                    <td>{new Date(d.drive_date).toLocaleDateString('en-IN')}</td>
                                    <td style={{ fontSize: '0.8rem' }}>CGPA ≥ {d.min_cgpa} · Backlogs ≤ {d.max_backlogs}</td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.allowed_branches}</td>
                                    <td>
                                        <button onClick={() => viewApplications(d)} style={{ padding: '0.25rem 0.5rem', background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                                            <Users size={12} style={{ display: 'inline', marginRight: 2 }} />
                                            {d._count?.drive_applications ?? 0}
                                        </button>
                                    </td>
                                    <td>
                                        <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)}
                                            style={{ padding: '0.25rem', border: `1px solid ${STATUS_COLORS[d.status]}`, borderRadius: 4, color: STATUS_COLORS[d.status], fontWeight: 600, fontSize: '0.8rem', background: 'white', cursor: 'pointer' }}>
                                            {['upcoming', 'active', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td style={{ display: 'flex', gap: 4 }}>
                                        <button onClick={() => { setForm({ company: d.company, role: d.role, package: d.package, drive_date: d.drive_date?.split('T')[0] || '', min_cgpa: d.min_cgpa, max_backlogs: d.max_backlogs, allowed_branches: d.allowed_branches, description: d.description || '' }); setEditId(d.id); setShowForm(true); }}
                                            style={{ padding: '0.25rem', background: '#f3f4f6', border: 'none', borderRadius: 4, cursor: 'pointer' }}><Edit3 size={14} /></button>
                                        <button onClick={() => deleteDrive(d.id)} style={{ padding: '0.25rem', background: '#fee2e2', border: 'none', borderRadius: 4, cursor: 'pointer' }}><Trash2 size={14} color="#ef4444" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Eligible Students Modal */}
            {eligibleModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setEligibleModal(null)}>
                    <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: '80%', maxWidth: 700, maxHeight: '80vh', overflow: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Eligible Students — {eligibleModal.drive.company}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {eligibleModal.students.length} students qualify · CGPA ≥ {eligibleModal.drive.min_cgpa} · Backlogs ≤ {eligibleModal.drive.max_backlogs}
                        </p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead><tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Reg ID</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Branch</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>CGPA</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Backlogs</th>
                            </tr></thead>
                            <tbody>{eligibleModal.students.map(s => (
                                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.5rem', fontWeight: 700, color: '#4f46e5' }}>{s.reg_id}</td>
                                    <td style={{ padding: '0.5rem' }}>{s.full_name}</td>
                                    <td style={{ padding: '0.5rem' }}>{s.branch}</td>
                                    <td style={{ padding: '0.5rem', fontWeight: 600, color: s.cgpa >= 8 ? '#10b981' : '#f59e0b' }}>{s.cgpa?.toFixed(2)}</td>
                                    <td style={{ padding: '0.5rem' }}>{s.backlogs}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                        <button onClick={() => setEligibleModal(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Close</button>
                    </div>
                </div>
            )}

            {/* Applications Modal */}
            {applicationsModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                    onClick={() => setApplicationsModal(null)}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '1.5rem', width: '90%', maxWidth: 450,
                        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                        onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>Applications</h3>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{applicationsModal.drive.company} · {applicationsModal.drive.role}</p>
                            </div>
                            <button onClick={() => setApplicationsModal(null)} style={{ background: '#f1f5f9', border: 'none', width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontWeight: 700, fontSize: '14px' }}>✕</button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                            {applicationsModal.applications.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0', fontSize: '0.9rem' }}>No applications yet.</div>
                            ) : applicationsModal.applications.map(app => (
                                <div key={app.user_id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', background: '#fafafa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{app.full_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{app.reg_id}</span>
                                                <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{app.branch}</span>
                                                <span style={{ background: app.cgpa >= 8 ? '#d1fae5' : '#fef9c3', color: app.cgpa >= 8 ? '#065f46' : '#713f12', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{app.cgpa?.toFixed(2)} CGPA</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => updateAppStatus(applicationsModal.drive.id, app.user_id, 'shortlisted')}
                                            style={{
                                                flex: 1, padding: '0.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', border: 'none',
                                                background: app.status === 'shortlisted' ? '#10b981' : '#f1f5f9',
                                                color: app.status === 'shortlisted' ? '#fff' : '#10b981',
                                                cursor: app.status === 'shortlisted' ? 'default' : 'pointer',
                                                opacity: app.status === 'rejected' ? 0.5 : 1
                                            }}
                                        >
                                            {app.status === 'shortlisted' ? '✓ Approved' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => updateAppStatus(applicationsModal.drive.id, app.user_id, 'rejected')}
                                            style={{
                                                flex: 1, padding: '0.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', border: 'none',
                                                background: app.status === 'rejected' ? '#ef4444' : '#f1f5f9',
                                                color: app.status === 'rejected' ? '#fff' : '#ef4444',
                                                cursor: app.status === 'rejected' ? 'default' : 'pointer',
                                                opacity: app.status === 'shortlisted' ? 0.5 : 1
                                            }}
                                        >
                                            {app.status === 'rejected' ? '✕ Rejected' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
