'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
    Home, Search, PlusSquare, User, LogOut, Compass, Menu, Heart, Briefcase, Bell
} from 'lucide-react';
import styles from './Navigation.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${API}/api/notifications/my/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUnreadCount(data.count || 0);
                }
            } catch (e) { }
        };
        fetchUnread();
        const int = setInterval(fetchUnread, 30000);
        return () => clearInterval(int);
    }, [user, pathname]);

    const navItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/explore', icon: Compass, label: 'Explore' },
        { href: '/drives', icon: Briefcase, label: 'Drives' },
        { href: '/notifications', icon: Bell, label: 'Alerts' },
        { href: user ? '/profile' : '/login', icon: User, label: 'Profile' },
    ];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            {/* Left Sidebar (desktop) */}
            <aside className={styles.sidebar}>
                <Link href="/welcome" className={styles.logo}>
                    <span className={styles.logoIcon}>P</span>
                    <span className={styles.logoText}>PlacementPro</span>
                </Link>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                            >
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} strokeWidth={active ? 2.5 : 1.8} />
                                    {item.label === 'Alerts' && unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: -4, right: -4,
                                            background: '#ef4444', color: '#fff', fontSize: '0.65rem',
                                            fontWeight: 700, height: 16, minWidth: 16, borderRadius: 8,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                                            border: '2px solid #fff'
                                        }}>
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                                <span className={styles.navLabel}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>


            </aside>

            {/* Bottom bar (mobile) */}
            <nav className={styles.bottomBar}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.bottomItem} ${active ? styles.bottomItemActive : ''}`}
                        >
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={26} strokeWidth={active ? 2.5 : 1.8} />
                                {item.label === 'Alerts' && unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4,
                                        background: '#ef4444', color: '#fff', fontSize: '0.65rem',
                                        fontWeight: 700, height: 16, minWidth: 16, borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                                        border: '2px solid #fff'
                                    }}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
