'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, CalendarDays, Bell } from 'lucide-react';
import styles from '../../app/admin/admin.module.css';

const NAV = [
    { id: 'dashboard', path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'drives', path: '/admin/drives', icon: Briefcase, label: 'Placement Drives' },
    { id: 'students', path: '/admin/students', icon: Users, label: 'Students' },
    { id: 'scheduler', path: '/admin/scheduler', icon: CalendarDays, label: 'Interview Scheduler' },
    { id: 'notifications', path: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo}>
                <h1>PlacementPro</h1>
                <span>TPO Admin Panel</span>
            </div>
            <nav className={styles.sidebarNav}>
                {NAV.map(item => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            className={isActive ? styles.navItemActive : styles.navItem}
                            onClick={() => router.push(item.path)}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            <div className={styles.sidebarFooter}>
                <p>© 2025 PlacementPro</p>
            </div>
        </aside>
    );
}
