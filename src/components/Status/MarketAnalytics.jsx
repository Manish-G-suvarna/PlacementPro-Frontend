'use client';
import React from 'react';
import styles from './marketAnalytics.module.css';

const TARGET_ROLE = 'Data Analyst';

const SKILL_GAPS = [
    {
        skill: 'Power BI',
        marketPercent: 80,
        userHas: false,
        action: 'Recommended learning path: Microsoft Power BI Data Analyst (PL-300) certification.',
    },
    {
        skill: 'SQL',
        marketPercent: 95,
        userHas: true,
        action: 'You already have this skill — keep building advanced query knowledge.',
    },
    {
        skill: 'Tableau',
        marketPercent: 60,
        userHas: false,
        action: 'Consider Coursera "Data Visualization with Tableau" specialization.',
    },
    {
        skill: 'Python (Pandas)',
        marketPercent: 72,
        userHas: true,
        action: 'Strong match — continue working on real-world data projects.',
    },
];

export default function MarketAnalytics() {
    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Market Intelligence &amp; Skill Gap Analysis</h2>
            <p className={styles.subheading}>Data-driven insights comparing your profile against market demand</p>

            <div className={styles.targetRow}>
                <span className={styles.roleBadge}>Target Role</span>
                <span className={styles.roleTitle}>{TARGET_ROLE}</span>
            </div>

            <div className={styles.gapList}>
                {SKILL_GAPS.map((gap) => (
                    <div key={gap.skill} className={styles.gapRow}>
                        <div className={styles.gapHeader}>
                            <span className={styles.gapSkill}>
                                {gap.userHas ? '✅' : '⚠️'} {gap.skill}
                            </span>
                            <span className={styles.gapPercent}>{gap.marketPercent}% of placed students</span>
                        </div>
                        <div className={styles.barOuter}>
                            <div className={styles.barInner} style={{ width: `${gap.marketPercent}%` }} />
                        </div>
                        <p className={styles.gapAction}>
                            <strong>Action:</strong> {gap.action}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
