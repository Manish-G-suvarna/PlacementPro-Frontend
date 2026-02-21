'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from '../alumni.module.css';

const INITIAL_REFERRALS = [
    { id: 1, company: 'Google', role: 'SDE Intern', location: 'Bangalore', desc: 'Strong DSA skills required. 2+ internships preferred.', applicants: 4 },
    { id: 2, company: 'Microsoft', role: 'Data Analyst', location: 'Hyderabad', desc: 'SQL + Python proficiency. Freshers welcome.', applicants: 2 },
    { id: 3, company: 'Flipkart', role: 'Product Manager', location: 'Bangalore', desc: 'MBA or strong product sense. Case study round.', applicants: 6 },
    { id: 4, company: 'Deloitte', role: 'Risk Analyst', location: 'Mumbai', desc: 'Finance background preferred. Aptitude+GD round.', applicants: 1 },
];

export default function ReferralsPage() {
    const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
    const [showForm, setShowForm] = useState(false);
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');

    const handlePost = () => {
        if (!company || !role) return;
        setReferrals(prev => [{ id: Date.now(), company, role, location, desc, applicants: 0 }, ...prev]);
        setCompany(''); setRole(''); setLocation(''); setDesc('');
        setShowForm(false);
    };

    return (
        <>
            <div className={styles.pageHeader} style={{ marginBottom: 24 }}>
                <h2>Job Referral Board</h2>
                <p>Post referral openings at your company for juniors</p>
            </div>

            <div style={{ marginBottom: 24 }}>
                <button className={styles.btnPrimary} onClick={() => setShowForm(true)}>
                    <Plus size={14} /> Post New Referral
                </button>
            </div>

            {showForm && (
                <div className={styles.card} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span className={styles.cardTitle} style={{ margin: 0 }}>New Referral</span>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)}
                            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fafafa', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)}
                            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fafafa', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                    <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fafafa', fontSize: 14, outline: 'none', marginBottom: 12, fontFamily: 'inherit' }} />
                    <textarea placeholder="Description / Requirements" value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fafafa', fontSize: 14, outline: 'none', resize: 'none', marginBottom: 12, fontFamily: 'inherit' }} />
                    <button className={styles.btnPrimary} onClick={handlePost}>Post Referral</button>
                </div>
            )}

            <div className={styles.referralGrid}>
                {referrals.map(r => (
                    <div key={r.id} className={styles.referralCard}>
                        <span className={styles.referralCompany}>{r.company}</span>
                        <span className={styles.referralRole}>{r.role}</span>
                        {r.location && <span className={styles.referralMeta}>📍 {r.location}</span>}
                        {r.desc && <span className={styles.referralMeta}>{r.desc}</span>}
                        <span className={styles.referralMeta}>{r.applicants} applicants</span>
                    </div>
                ))}
            </div>
        </>
    );
}
