'use client';
import React from 'react';
import styles from '../alumni.module.css';

const ALUMNI = [
    { id: 1, name: 'Arjun Mehta', batch: '2022', company: 'Google', role: 'SDE', location: 'Bangalore' },
    { id: 2, name: 'Sneha Rao', batch: '2021', company: 'Microsoft', role: 'Data Analyst', location: 'Hyderabad' },
    { id: 3, name: 'Karan Gupta', batch: '2023', company: 'Flipkart', role: 'PM', location: 'Bangalore' },
    { id: 4, name: 'Priya Sharma', batch: '2020', company: 'Deloitte', role: 'Risk Analyst', location: 'Mumbai' },
    { id: 5, name: 'Rahul Verma', batch: '2019', company: 'Amazon', role: 'SDE-2', location: 'Chennai' },
    { id: 6, name: 'Neha Kulkarni', batch: '2022', company: 'Adobe', role: 'Frontend Dev', location: 'Noida' },
];

export default function NetworkPage() {
    return (
        <>
            <div className={styles.pageHeader} style={{ marginBottom: 28 }}>
                <h2>Alumni Network</h2>
                <p>Connect with fellow alumni across companies and batches</p>
            </div>

            <div className={styles.referralGrid}>
                {ALUMNI.map(a => (
                    <div key={a.id} className={styles.referralCard}>
                        <span className={styles.referralCompany}>{a.company}</span>
                        <span className={styles.referralRole}>{a.name}</span>
                        <span className={styles.referralMeta}>{a.role} · Batch {a.batch}</span>
                        <span className={styles.referralMeta}>📍 {a.location}</span>
                        <button className={styles.btnOutline} style={{ alignSelf: 'flex-start' }}>Connect</button>
                    </div>
                ))}
            </div>
        </>
    );
}
