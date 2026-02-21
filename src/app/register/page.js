'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, GraduationCap, Shield, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../login/auth.module.css';

const ROLES = [
    { id: 'user', label: 'Student', icon: GraduationCap, desc: 'Track applications & opportunities', color: '#3b82f6' },
    { id: 'admin', label: 'TPO', icon: Shield, desc: 'Manage drives & placements', color: '#a855f7' },
    { id: 'organizer', label: 'Alumni', icon: Users, desc: 'Mentor & refer juniors', color: '#22d3ee' },
];

const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'Other'];

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState(null);
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Common
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    // Student-specific
    const [registerId, setRegisterId] = useState('');
    const [gender, setGender] = useState('');
    const [branch, setBranch] = useState('');
    const [phone, setPhone] = useState('');

    // TPO-specific
    const [staffId, setStaffId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password) { setError('All fields are required'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (selectedRole === 'user' && (!registerId.trim() || !gender || !branch || !phone.trim())) {
            setError('Please fill all student fields'); return;
        }
        if (selectedRole === 'admin' && !staffId.trim()) { setError('Staff ID is required'); return; }
        if (selectedRole === 'organizer' && !phone.trim()) { setError('Phone number is required'); return; }

        setLoading(true); setError('');
        try {
            const extras = {};
            if (selectedRole === 'user') {
                extras.register_id = registerId.trim();
                extras.gender = gender;
                extras.branch = branch;
                extras.phone = phone.trim();
            } else if (selectedRole === 'admin') {
                extras.staff_id = staffId.trim();
            } else if (selectedRole === 'organizer') {
                extras.phone = phone.trim();
            }
            const u = await register(name.trim(), email.trim(), password, selectedRole, extras);
            // Open role-specific platform in a new tab
            if (u.role === 'admin') window.open('/admin', '_blank');
            else if (u.role === 'organizer') window.open('/alumni', '_blank');
            else window.open('/', '_blank');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally { setLoading(false); }
    };

    // Step 1: Role selection
    if (!selectedRole) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.card} style={{ maxWidth: 520 }}>
                    <div className={styles.brand}>
                        <h1 className={styles.brandTitle}>Join PlacementPro</h1>
                        <p className={styles.brandSub}>Select your role to get started</p>
                    </div>

                    <div className={styles.roleSelector}>
                        {ROLES.map(r => (
                            <button
                                key={r.id}
                                type="button"
                                className={styles.roleCard}
                                onClick={() => setSelectedRole(r.id)}
                                style={{ '--role-color': r.color }}
                            >
                                <div className={styles.roleIconWrap}>
                                    <r.icon size={28} />
                                </div>
                                <strong>{r.label}</strong>
                                <span>{r.desc}</span>
                            </button>
                        ))}
                    </div>

                    <p className={styles.switch}>
                        Already have an account? <Link href="/login" className={styles.link}>Login</Link>
                    </p>
                </div>
            </div>
        );
    }

    const roleInfo = ROLES.find(r => r.id === selectedRole);

    // Step 2: Role-specific form
    return (
        <div className={styles.wrapper}>
            <div className={styles.card} style={{ maxWidth: 440 }}>
                <button className={styles.backBtn} onClick={() => setSelectedRole(null)} type="button">
                    <ArrowLeft size={16} /> Change Role
                </button>
                <div className={styles.brand}>
                    <div className={styles.roleIndicator} style={{ background: `${roleInfo.color}15`, borderColor: `${roleInfo.color}40`, color: roleInfo.color }}>
                        <roleInfo.icon size={16} /> {roleInfo.label}
                    </div>
                    <h1 className={styles.brandTitle}>Create Account</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}

                    {/* ── Student fields ── */}
                    {selectedRole === 'user' && (
                        <>
                            <div className={styles.formRow}>
                                <div className={styles.formHalf}>
                                    <label className={styles.label}>Register ID</label>
                                    <input className={styles.input} value={registerId} onChange={e => setRegisterId(e.target.value)} placeholder="RA2211003010XXX" />
                                </div>
                                <div className={styles.formHalf}>
                                    <label className={styles.label}>Full Name</label>
                                    <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formHalf}>
                                    <label className={styles.label}>Gender</label>
                                    <select className={styles.input} value={gender} onChange={e => setGender(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className={styles.formHalf}>
                                    <label className={styles.label}>Branch</label>
                                    <select className={styles.input} value={branch} onChange={e => setBranch(e.target.value)}>
                                        <option value="">Select</option>
                                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <label className={styles.label}>Phone Number</label>
                            <input className={styles.input} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />

                            <label className={styles.label}>Email</label>
                            <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                        </>
                    )}

                    {/* ── TPO fields ── */}
                    {selectedRole === 'admin' && (
                        <>
                            <label className={styles.label}>Full Name</label>
                            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Smith" />

                            <label className={styles.label}>Staff ID</label>
                            <input className={styles.input} value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="STAFF-2025-001" />

                            <label className={styles.label}>Email</label>
                            <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tpo@college.edu" />
                        </>
                    )}

                    {/* ── Alumni fields ── */}
                    {selectedRole === 'organizer' && (
                        <>
                            <label className={styles.label}>Full Name</label>
                            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />

                            <label className={styles.label}>Phone Number</label>
                            <input className={styles.input} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />

                            <label className={styles.label}>Email</label>
                            <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alumni@example.com" />
                        </>
                    )}

                    <label className={styles.label}>Password</label>
                    <div className={styles.pwWrap}>
                        <input className={styles.input} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
                        <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <label className={styles.label}>Re-enter Password</label>
                    <input className={styles.input} type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" />

                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Creating...' : <><UserPlus size={16} /> Create Account</>}
                    </button>
                </form>

                <p className={styles.switch}>
                    Already have an account? <Link href="/login" className={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
}
