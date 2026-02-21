'use client';
import React from 'react';
import styles from './alumniConnect.module.css';

const REFERRALS = [
    { company: 'Google', role: 'Software Engineer', alumnus: 'Arjun Mehta (2022)', location: 'Bangalore' },
    { company: 'Microsoft', role: 'Data Analyst', alumnus: 'Sneha Rao (2021)', location: 'Hyderabad' },
    { company: 'Flipkart', role: 'Product Manager', alumnus: 'Karan Gupta (2023)', location: 'Bangalore' },
    { company: 'Deloitte', role: 'Risk Analyst', alumnus: 'Priya Sharma (2020)', location: 'Mumbai' },
];

const MENTORS = [
    { name: 'Arjun Mehta', title: 'SDE @ Google', slots: '3 slots this week', focus: 'System Design' },
    { name: 'Sneha Rao', title: 'Data Analyst @ Microsoft', slots: '2 slots this week', focus: 'SQL & PowerBI' },
    { name: 'Karan Gupta', title: 'PM @ Flipkart', slots: '1 slot this week', focus: 'Product Sense' },
];

export default function AlumniConnect() {
    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Alumni Connect Portal</h2>
            <p className={styles.subheading}>Networking &amp; Give-back — Job Referrals and Mentorship from Alumni</p>

            {/* Job Referral Board */}
            <div>
                <h3 className={styles.sectionTitle}>Job Referral Board</h3>
                <div className={styles.grid}>
                    {REFERRALS.map((r) => (
                        <div key={r.company + r.role} className={styles.referralCard}>
                            <span className={styles.referralCompany}>{r.company}</span>
                            <p className={styles.referralRole}>{r.role}</p>
                            <span className={styles.referralMeta}>Posted by {r.alumnus} · {r.location}</span>
                            <button className={styles.referralBtn}>Request Referral</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mentorship Slots */}
            <div className={styles.mentorSection}>
                <h3 className={styles.sectionTitle}>Mentorship Slots</h3>
                {MENTORS.map((m) => (
                    <div key={m.name} className={styles.mentorCard}>
                        <div className={styles.mentorInfo}>
                            <h4>{m.name}</h4>
                            <p>{m.title} · Focus: {m.focus}</p>
                        </div>
                        <span className={styles.mentorSlots}>{m.slots}</span>
                        <button className={styles.bookBtn}>Book</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
