'use client';
import React, { useState, useEffect } from 'react';
import styles from './applicationTracker.module.css';
import { CheckCircle, Circle, Loader, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STAGES = ['Sent', 'Wait', 'Approved'];
const BADGE_MAP = ['badgeApplied', 'badgeAptitude', 'badgeSelected'];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function ApplicationTracker() {
    const { user, loading: authLoading } = useAuth();
    const [expandedId, setExpandedId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

    useEffect(() => {
        if (authLoading || !user) return;
        fetchData();
    }, [user, authLoading]);

    async function fetchData() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [drivesRes, interviewsRes] = await Promise.all([
                fetch(`${API}/api/drives/eligible`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/api/scheduler/my`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const drivesData = drivesRes.ok && drivesRes.headers.get('content-type')?.includes('application/json')
                ? await drivesRes.json() : [];
            const interviewsData = interviewsRes.ok ? await interviewsRes.json() : [];

            const appliedDrives = (Array.isArray(drivesData) ? drivesData : []).filter(d => d.my_status);
            const interviewsByDrive = {};
            (Array.isArray(interviewsData) ? interviewsData : []).forEach(iv => {
                if (iv.drive_id) {
                    interviewsByDrive[iv.drive_id] = true;
                }
            });

            const formattedApps = appliedDrives.map(d => {
                let stage = 0; // Sent
                // Determine stage based on 3-step pipeline
                if (d.my_status === 'pending') stage = 1; // Wait
                if (d.my_status === 'shortlisted' || d.my_status === 'placed') stage = 2; // Approved

                return {
                    id: d.id,
                    company: d.company,
                    role: d.role,
                    statusDesc: d.my_status === 'pending' ? 'wait' : d.my_status === 'shortlisted' ? 'approved' : d.my_status,
                    stage
                };
            });

            setApplications(formattedApps);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Application Tracker</h2>

            <div className={styles.appList}>
                {loading ? (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center' }}>Loading application data...</div>
                ) : applications.length === 0 ? (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>
                        You haven't applied to any drives yet.<br />Go to the Drives section to apply!
                    </div>
                ) : applications.map((app) => (
                    <div key={app.id} className={styles.appBlock}>
                        {/* Clickable row */}
                        <button
                            className={`${styles.appRow} ${expandedId === app.id ? styles.appRowActive : ''}`}
                            onClick={() => toggle(app.id)}
                        >
                            <div className={styles.appInfo}>
                                <h4>{app.role}</h4>
                                <p>{app.company}</p>
                            </div>
                            <div className={styles.appRight}>
                                <span className={`${styles.badge} ${styles[BADGE_MAP[app.stage]]}`}>
                                    {STAGES[app.stage]}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`${styles.chevron} ${expandedId === app.id ? styles.chevronOpen : ''}`}
                                />
                            </div>
                        </button>

                        {/* Pipeline – only visible when this row is clicked */}
                        {expandedId === app.id && (
                            <div className={styles.pipelineWrapper}>
                                <div className={styles.pipeline}>
                                    {STAGES.map((s, i) => {
                                        const isRejected = app.statusDesc === 'rejected';

                                        // Logic for ticks: 
                                        // If rejected, nothing gets a tick, except past stages if we wanted (let's keep simple: rejected = all gray)
                                        // If current stage is Approved (2), everything gets a tick because it's the final stage.
                                        // Otherwise, stages BEFORE current get a tick.
                                        const isPassed = !isRejected && (i < app.stage || (app.stage === 2 && i === 2));
                                        const isActive = !isRejected && i === app.stage && app.stage !== 2;

                                        return (
                                            <React.Fragment key={s}>
                                                <div className={styles.stage}>
                                                    <div className={
                                                        isRejected ? styles.dotPending :
                                                            isPassed ? styles.dotCompleted :
                                                                isActive ? styles.dotActive :
                                                                    styles.dotPending
                                                    }>
                                                        {isRejected ? <Circle size={14} /> :
                                                            isPassed ? <CheckCircle size={18} /> :
                                                                isActive ? <Loader size={16} /> :
                                                                    <Circle size={14} />}
                                                    </div>
                                                    <span className={isActive ? styles.labelActive : styles.label}>
                                                        {isRejected && s === 'Sent' && app.stage === 0 ? 'Rejected' : s}
                                                    </span>
                                                </div>
                                                {i < STAGES.length - 1 && (
                                                    <div className={isRejected ? styles.connectorPending : (i < app.stage) ? styles.connectorDone : styles.connectorPending} />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                {app.statusDesc === 'rejected' && (
                                    <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#ef4444', textAlign: 'center' }}>
                                        Unfortunately, your application was not moved forward for this drive.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
