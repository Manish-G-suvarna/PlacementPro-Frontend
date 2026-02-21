'use client';
import React from 'react';
import { Briefcase, GraduationCap, Users } from 'lucide-react';
import styles from './alumni.module.css';

const ACTIVITY = [
    { text: 'Aarav Sharma requested a referral for Google SDE Intern', time: '2 hours ago', color: '#22d3ee' },
    { text: 'Your mentorship slot with Priya Patel was confirmed', time: '5 hours ago', color: '#a855f7' },
    { text: 'Vikram Joshi thanked you for the mock interview session', time: '1 day ago', color: '#22c55e' },
    { text: 'New referral request from Sneha Reddy for Amazon SDE-1', time: '2 days ago', color: '#22d3ee' },
];

const RECENT_REFERRALS = [
    { company: 'Google', role: 'SDE Intern', applicants: 4, status: 'Open' },
    { company: 'Microsoft', role: 'Data Analyst', applicants: 2, status: 'Open' },
    { company: 'Flipkart', role: 'Product Manager', applicants: 6, status: 'Closed' },
];

export default function AlumniDashboard() {
    return (
        <>
            <div className={styles.pageHeader}>
                <h2>Welcome back, Alumni 👋</h2>
                <p>Your impact on campus placements at a glance</p>
            </div>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <Briefcase size={20} style={{ color: '#22d3ee' }} />
                    <span className={styles.label}>Active Referrals</span>
                    <span className={styles.value}>5</span>
                    <span className={styles.sub}>2 new requests this week</span>
                </div>
                <div className={styles.summaryCard}>
                    <GraduationCap size={20} style={{ color: '#a855f7' }} />
                    <span className={styles.label}>Mentees</span>
                    <span className={styles.value}>8</span>
                    <span className={styles.sub}>3 sessions this month</span>
                </div>
                <div className={styles.summaryCard}>
                    <Users size={20} style={{ color: '#22c55e' }} />
                    <span className={styles.label}>Students Helped</span>
                    <span className={styles.value}>24</span>
                    <span className={styles.sub}>Since joining the network</span>
                </div>
            </div>

            {/* Recent referrals */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Your Recent Referrals</div>
                <div className={styles.referralGrid}>
                    {RECENT_REFERRALS.map(r => (
                        <div key={r.company + r.role} className={styles.referralCard}>
                            <span className={styles.referralCompany}>{r.company}</span>
                            <span className={styles.referralRole}>{r.role}</span>
                            <span className={styles.referralMeta}>{r.applicants} applicants</span>
                            <span className={`${styles.badge} ${r.status === 'Open' ? styles.badgeOpen : styles.badgeFull}`}>
                                {r.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity feed */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Recent Activity</div>
                <div className={styles.activityList}>
                    {ACTIVITY.map((a, i) => (
                        <div key={i} className={styles.activityRow}>
                            <div className={styles.activityDot} style={{ background: a.color }} />
                            <p>{a.text}</p>
                            <span>{a.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
