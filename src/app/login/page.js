'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, GraduationCap, Shield, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './auth.module.css';

const ROLES = [
    { id: 'user', label: 'Student', icon: GraduationCap },
    { id: 'admin', label: 'TPO', icon: Shield },
    { id: 'organizer', label: 'Alumni', icon: Users },
];

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) { setError('Please fill all fields'); return; }
        setLoading(true);
        setError('');
        try {
            const u = await login(email.trim(), password);
            // Role-based redirect — open in new tab
            if (u.role === 'admin') window.open('/admin', '_blank');
            else if (u.role === 'organizer') window.open('/alumni', '_blank');
            else window.open('/', '_blank');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally { setLoading(false); }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.brand}>
                    <div className={styles.logo}>P</div>
                    <h1 className={styles.brandTitle}>PlacementPro</h1>
                    <p className={styles.brandSub}>Sign in to continue</p>
                </div>

                {/* Role indicator */}
                <div className={styles.roleTabs}>
                    {ROLES.map(r => (
                        <div key={r.id} className={styles.roleTab}>
                            <r.icon size={16} />
                            <span>{r.label}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}

                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                    />

                    <label className={styles.label}>Password</label>
                    <div className={styles.pwWrap}>
                        <input
                            className={styles.input}
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Logging in...' : <><LogIn size={16} /> Login</>}
                    </button>
                </form>

                <p className={styles.switch}>
                    Don&apos;t have an account? <Link href="/register" className={styles.link}>Register</Link>
                </p>
            </div>
        </div>
    );
}
