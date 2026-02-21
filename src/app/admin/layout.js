'use client';
import React from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    return (
        <div className={styles.adminRoot}>
            <AdminSidebar />
            <main className={styles.mainArea}>
                {children}
            </main>
        </div>
    );
}
