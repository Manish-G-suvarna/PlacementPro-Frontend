'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (stored && token) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const { token, user: u } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
        return u;
    };

    const register = async (name, email, password, role = 'user', extras = {}) => {
        const res = await api.post('/api/auth/register', { name, email, password, role, ...extras });
        const { token, user: u } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Role helpers
    const isAdmin = user?.role === 'admin';
    const isAlumni = user?.role === 'organizer';
    const isStudent = user?.role === 'user' || (!user?.role);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAlumni, isStudent }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
