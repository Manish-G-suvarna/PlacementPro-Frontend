'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import styles from '../admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('');
    const [minCgpa, setMinCgpa] = useState('');
    const [maxBacklogs, setMaxBacklogs] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ page, limit: 20 });
            if (search) params.set('search', search);
            if (branch) params.set('branch', branch);
            if (minCgpa) params.set('min_cgpa', minCgpa);
            if (maxBacklogs !== '') params.set('max_backlogs', maxBacklogs);

            const res = await fetch(`${API}/api/students?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStudents(data.students || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, branch, minCgpa, maxBacklogs]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

    const BRANCHES = ['', 'Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical', 'Mechanical', 'Civil'];

    return (
        <>
            <div className={styles.pageHeader}>
                <h2>Students ({total})</h2>
                <p>All registered students from SIT</p>
            </div>

            {/* Filters */}
            <div className={styles.card} style={{ marginBottom: '1rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input style={{ width: '100%', paddingLeft: 30, padding: '0.5rem 0.5rem 0.5rem 30px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                                value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, Reg ID, Email..." />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Branch</label>
                        <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                            value={branch} onChange={e => { setBranch(e.target.value); setPage(1); }}>
                            {BRANCHES.map(b => <option key={b} value={b}>{b || 'All Branches'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Min CGPA</label>
                        <input type="number" step="0.1" min="0" max="10" style={{ width: 80, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                            value={minCgpa} onChange={e => setMinCgpa(e.target.value)} placeholder="0" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Max Backlogs</label>
                        <input type="number" min="0" style={{ width: 80, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: '0.875rem' }}
                            value={maxBacklogs} onChange={e => setMaxBacklogs(e.target.value)} placeholder="Any" />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                        Apply
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Student List</div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading students...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Reg ID</th>
                                <th>Name</th>
                                <th>Branch</th>
                                <th>CGPA</th>
                                <th>Backlogs</th>
                                <th>Gender</th>
                                <th>Skills</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: 700, color: '#4f46e5' }}>{s.reg_id}</td>
                                    <td style={{ fontWeight: 600 }}>{s.full_name}</td>
                                    <td>{s.branch}</td>
                                    <td>
                                        <span style={{
                                            fontWeight: 700,
                                            color: s.cgpa >= 8 ? '#10b981' : s.cgpa >= 6 ? '#f59e0b' : '#ef4444'
                                        }}>{s.cgpa?.toFixed(2)}</span>
                                    </td>
                                    <td>
                                        <span style={{ color: s.backlogs === 0 ? '#10b981' : s.backlogs <= 2 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                            {s.backlogs}
                                        </span>
                                    </td>
                                    <td>{s.gender}</td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#6b7280' }}>
                                        {s.skills || '—'}
                                    </td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.email}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{s.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.375rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: 'white' }}>Prev</button>
                        <span style={{ lineHeight: '2rem', color: '#6b7280', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.375rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: 'white' }}>Next</button>
                    </div>
                )}
            </div>
        </>
    );
}
