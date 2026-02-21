'use client';
import React, { useState } from 'react';
import styles from '../alumni.module.css';

const MENTEES = [
    { id: 1, name: 'Aarav Sharma', branch: 'CSE', focus: 'System Design', status: 'active', nextSession: 'Tomorrow 4 PM' },
    { id: 2, name: 'Priya Patel', branch: 'CSE', focus: 'DSA', status: 'active', nextSession: 'Fri 11 AM' },
    { id: 3, name: 'Karthik Iyer', branch: 'IT', focus: 'Web Dev', status: 'active', nextSession: 'Next Mon 3 PM' },
    { id: 4, name: 'Sneha Reddy', branch: 'CSE', focus: 'ML Basics', status: 'completed', nextSession: null },
];

const SLOTS = [
    { id: 1, day: 'Monday', time: '3:00 PM - 4:00 PM', booked: true, mentee: 'Karthik Iyer' },
    { id: 2, day: 'Wednesday', time: '5:00 PM - 6:00 PM', booked: false, mentee: null },
    { id: 3, day: 'Friday', time: '11:00 AM - 12:00 PM', booked: true, mentee: 'Priya Patel' },
    { id: 4, day: 'Saturday', time: '10:00 AM - 11:00 AM', booked: false, mentee: null },
];

export default function MentorshipPage() {
    return (
        <>
            <div className={styles.pageHeader} style={{ marginBottom: 28 }}>
                <h2>Mentorship</h2>
                <p>Manage your mentees and available time slots</p>
            </div>

            {/* Mentees */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Your Mentees</div>
                {MENTEES.map(m => (
                    <div key={m.id} className={styles.mentorCard}>
                        <div className={styles.mentorInfo}>
                            <h4>{m.name}</h4>
                            <p>{m.branch} · Focus: {m.focus}</p>
                        </div>
                        {m.nextSession ? (
                            <span style={{ fontSize: 12, color: '#a1a1aa' }}>{m.nextSession}</span>
                        ) : null}
                        <span className={`${styles.badge} ${m.status === 'active' ? styles.badgeOpen : styles.badgeFull}`}>
                            {m.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Slots */}
            <div className={styles.card}>
                <div className={styles.cardTitle}>Your Weekly Slots</div>
                {SLOTS.map(s => (
                    <div key={s.id} className={styles.mentorCard}>
                        <div className={styles.mentorInfo}>
                            <h4>{s.day}</h4>
                            <p>{s.time}</p>
                        </div>
                        {s.booked ? (
                            <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600 }}>Booked — {s.mentee}</span>
                        ) : (
                            <span className={`${styles.badge} ${styles.badgeOpen}`}>Available</span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
