'use client';
import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import styles from './RecommendationsSidebar.module.css';

export default function RecommendationsSidebar() {
    const [connectedIds, setConnectedIds] = useState(new Set());

    const suggestions = [
        { id: 1, name: 'Sarah Jenkins', title: 'HR Manager @ TechCorp', initials: 'SJ' },
        { id: 2, name: 'Michael Chen', title: 'Senior Recruiter', initials: 'MC' },
        { id: 3, name: 'Priya Sharma', title: 'Talent Acquisition', initials: 'PS' },
        { id: 4, name: 'David Wilson', title: 'Director of HR', initials: 'DW' },
    ];

    const handleConnect = (id) => {
        setConnectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <aside className={styles.rightSidebar}>
            <h3 className={styles.header}>Suggested to Connect</h3>
            <div className={styles.recommendationsList}>
                {suggestions.map((person) => {
                    const isConnected = connectedIds.has(person.id);
                    return (
                        <div key={person.id} className={styles.recommendationItem}>
                            <div className={styles.avatar}>{person.initials}</div>
                            <div className={styles.info}>
                                <div className={styles.name}>{person.name}</div>
                                <div className={styles.title}>{person.title}</div>
                            </div>
                            <button
                                className={isConnected ? styles.connectBtnActive : styles.connectBtn}
                                onClick={() => handleConnect(person.id)}
                            >
                                {isConnected ? (
                                    <>
                                        <Check size={14} strokeWidth={2.5} />
                                        <span>Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14} strokeWidth={2.5} />
                                        <span>Connect</span>
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
