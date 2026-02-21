'use client';
import React from 'react';
import ApplicationTracker from '../../components/Status/ApplicationTracker';
import AlumniConnect from '../../components/Status/AlumniConnect';
import MarketAnalytics from '../../components/Status/MarketAnalytics';
import styles from './status.module.css';

export default function StatusPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <section className={styles.section}>
                <ApplicationTracker />
            </section>
            <section className={styles.section}>
                <AlumniConnect />
            </section>
            <section className={styles.section}>
                <MarketAnalytics />
            </section>
        </div>
    );
}
