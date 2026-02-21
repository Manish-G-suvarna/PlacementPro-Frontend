'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './alumni.module.css';

const NAV = [
    { id: 'dashboard', path: '/alumni', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'referrals', path: '/alumni/referrals', icon: Briefcase, label: 'Job Referrals' },
    { id: 'mentorship', path: '/alumni/mentorship', icon: GraduationCap, label: 'Mentorship' },
    { id: 'network', path: '/alumni/network', icon: Users, label: 'Network' },
];

export default function AlumniLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <div className={styles.root}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <h1>PlacementPro</h1>
                    <span>Alumni Portal</span>
                </div>
                <nav className={styles.sidebarNav}>
                    {NAV.map(item => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => router.push(item.path)}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={() => { logout(); router.push('/welcome'); }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
            <main className={styles.mainArea}>
                {children}
            </main>
        </div>
    );
}
