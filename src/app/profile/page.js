'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { LogOut, Grid, Calendar, User, CheckCircle, Mail, Phone, MapPin, Award, Book, Briefcase } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

function Avatar({ name, url, size = 150, hasStory = false }) {
    const imgStyle = { width: size - 8, height: size - 8, borderRadius: '50%', objectFit: 'cover', border: '3px solid #121212' };
    const containerStyle = {
        width: size, height: size, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: hasStory ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : 'transparent',
    };

    let content;
    if (url) {
        content = <img src={url} alt={name} style={imgStyle} />;
    } else {
        const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
        content = (
            <div style={{ ...imgStyle, background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.3, fontWeight: 700 }}>
                {initials}
            </div>
        );
    }

    return <div style={containerStyle}>{content}</div>;
}

export default function ProfilePage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.push('/welcome'); return; }
        loadData();
    }, [user, authLoading]);

    async function loadData() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [profileRes, postsRes, interviewRes] = await Promise.all([
                fetch(`${API}/api/students/profile/me`, { headers: { Authorization: `Bearer ${token}` } }),
                api.get(`/api/users/${user.id}`),
                fetch(`${API}/api/scheduler/my`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());
            setPosts(postsRes.data?.posts || []);

            if (interviewRes.ok) {
                const intData = await interviewRes.json();
                setInterviews(Array.isArray(intData) ? intData : []);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    if (authLoading || !user) return null;

    const fullName = profile?.full_name || user.name;
    const username = fullName.toLowerCase().replace(/\s+/g, '') + (profile?.reg_id?.slice(-3) || '');

    const styles = {
        page: { minHeight: '100vh', background: '#121212', color: '#f5f5f5', padding: '30px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
        container: { maxWidth: 935, margin: '0 auto' },

        // Header
        header: { display: 'flex', marginBottom: 44, gap: 30, alignItems: 'flex-start' },
        avatarWrap: { flex: '0 0 290px', display: 'flex', justifyContent: 'center', marginRight: 30 },
        userInfo: { flex: 1 },

        // Top Row
        topRow: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 },
        username: { fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
        verified: { color: '#f5f5f5' },

        // Stats Row
        statsRow: { display: 'flex', gap: 40, marginBottom: 20, fontSize: 16 },
        statItem: { display: 'flex', gap: 6 },
        statVal: { fontWeight: 600, color: '#f5f5f5' },
        statLabel: { color: '#a8a8a8' },

        // Actions
        actionsRow: { display: 'flex', gap: 8, marginBottom: 20 },
        btnSecondary: { background: '#262626', border: 'none', color: '#f5f5f5', padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', flex: 1, transition: 'background 0.2s', maxWidth: 150 },

        // Bio
        bioWrap: { fontSize: 14, lineHeight: '1.5', color: '#f5f5f5' },
        bioName: { fontWeight: 600 },
        bioText: { whiteSpace: 'pre-wrap' },

        // Tabs
        tabsWrap: { display: 'flex', justifyContent: 'center', borderTop: '1px solid #262626', gap: 60, marginTop: 44 },
        tab: (active) => ({ display: 'flex', alignItems: 'center', gap: 6, padding: '15px 0', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: active ? '#f5f5f5' : '#8e8e8e', borderTop: active ? '1px solid #f5f5f5' : '1px solid transparent', cursor: 'pointer', letterSpacing: 1, marginTop: -1 }),

        // Grid
        grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 },
        gridItem: { aspectRatio: '1/1', background: '#262626', position: 'relative', overflow: 'hidden', cursor: 'pointer' },
        gridImg: { width: '100%', height: '100%', objectFit: 'cover' },

        // Details Card
        detailsCard: { background: '#262626', borderRadius: 8, padding: 24, marginTop: 20 },
        infoRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #363636' },

        // Interview Card
        intCard: { background: '#262626', borderRadius: 8, padding: 20, marginBottom: 12, borderLeft: '4px solid #1d9bf0' }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header Profile Section */}
                <div style={styles.header}>
                    <div style={styles.avatarWrap}>
                        <Avatar name={fullName} url={user.avatar_url} size={150} hasStory={false} />
                    </div>

                    <div style={styles.userInfo}>
                        <div style={styles.topRow}>
                            <h2 style={styles.username}>
                                {username}
                                <CheckCircle size={18} fill="#f5f5f5" color="#121212" />
                            </h2>
                        </div>

                        <div style={styles.bioWrap}>
                            <div style={styles.bioName}>{fullName}</div>
                            {profile?.branch && <div style={{ color: '#a8a8a8' }}>{profile.branch}</div>}
                            <div style={styles.bioText}>{user.bio || 'Building the future.'}</div>
                        </div>

                        <div style={{ ...styles.statsRow, marginTop: 20 }}>
                            <div style={styles.statItem}><span style={styles.statVal}>{posts.length}</span> <span style={styles.statLabel}>posts</span></div>
                            <div style={styles.statItem}><span style={styles.statVal}>{interviews.length}</span> <span style={styles.statLabel}>interviews</span></div>
                            <div style={styles.statItem}><span style={styles.statVal}>{profile?.cgpa?.toFixed(2) || 'N/A'}</span> <span style={styles.statLabel}>cgpa</span></div>
                        </div>

                        <div style={styles.actionsRow}>
                            <button style={styles.btnSecondary} onClick={() => router.push('/settings')}>Edit profile</button>
                            <button onClick={logout} style={{ ...styles.btnSecondary, color: '#ff4d4f' }}>Log out</button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabsWrap}>
                    <div style={styles.tab(activeTab === 'details')} onClick={() => setActiveTab('details')}>
                        <User size={14} /> DETAILS
                    </div>
                    <div style={styles.tab(activeTab === 'posts')} onClick={() => setActiveTab('posts')}>
                        <Grid size={14} /> POSTS
                    </div>
                    <div style={styles.tab(activeTab === 'interviews')} onClick={() => setActiveTab('interviews')}>
                        <Calendar size={14} /> SCHEDULED INTERVIEWS
                    </div>
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div style={styles.detailsCard}>
                        {loading ? <div style={{ color: '#a8a8a8' }}>Loading details...</div> : (
                            <>
                                <div style={styles.infoRow}><Mail size={18} color="#8e8e8e" /> <div><div style={{ fontSize: 12, color: '#8e8e8e' }}>Email</div><div>{profile?.email || user.email}</div></div></div>
                                <div style={styles.infoRow}><Book size={18} color="#8e8e8e" /> <div><div style={{ fontSize: 12, color: '#8e8e8e' }}>Registration ID</div><div>{profile?.reg_id || 'Not set'}</div></div></div>
                                <div style={styles.infoRow}><MapPin size={18} color="#8e8e8e" /> <div><div style={{ fontSize: 12, color: '#8e8e8e' }}>Branch</div><div>{profile?.branch || 'Not set'}</div></div></div>
                                <div style={styles.infoRow}><Phone size={18} color="#8e8e8e" /> <div><div style={{ fontSize: 12, color: '#8e8e8e' }}>Phone</div><div>{profile?.phone || 'Not set'}</div></div></div>
                                <div style={{ ...styles.infoRow, borderBottom: 'none' }}><Award size={18} color="#8e8e8e" /> <div><div style={{ fontSize: 12, color: '#8e8e8e' }}>CGPA & Backlogs</div><div>{profile?.cgpa?.toFixed(2) || 'N/A'} CGPA, {profile?.backlogs || 0} Backlogs</div></div></div>
                            </>
                        )}
                    </div>
                )}

                {/* Grid Feed (Posts) */}
                {activeTab === 'posts' && (
                    <div style={{ marginTop: 20, ...styles.grid }}>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <div key={i} style={styles.gridItem} />)
                        ) : posts.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: 60, textAlign: 'center', color: '#a8a8a8' }}>
                                <h2>No posts yet</h2>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <div key={post.id} style={styles.gridItem}>
                                    {post.media_url ? (
                                        <img src={post.media_url.startsWith('http') ? post.media_url : `${API}${post.media_url}`} alt="Post" style={styles.gridImg} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 13, background: `hsl(${i * 45}, 30%, 15%)` }}>
                                            {post.description.substring(0, 100)}{post.description.length > 100 ? '...' : ''}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Interviews Tab */}
                {activeTab === 'interviews' && (
                    <div style={{ marginTop: 20 }}>
                        {loading ? (
                            <div style={{ color: '#a8a8a8', padding: 20 }}>Loading interviews...</div>
                        ) : interviews.length === 0 ? (
                            <div style={{ padding: 60, textAlign: 'center', color: '#a8a8a8' }}>
                                <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                                <h2>No scheduled interviews</h2>
                            </div>
                        ) : (
                            interviews.map(iv => (
                                <div key={iv.id} style={{ ...styles.intCard, borderColor: iv.status === 'completed' ? '#10b981' : iv.status === 'cancelled' ? '#ef4444' : '#1d9bf0' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{iv.company}</div>
                                    <div style={{ color: '#a8a8a8', fontSize: 14, marginBottom: 12 }}>{iv.drive_role}</div>
                                    <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#f5f5f5' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} color="#8e8e8e" /> {new Date(iv.interview_date).toLocaleDateString()} at {iv.interview_time}</div>
                                        {iv.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} color="#8e8e8e" /> {iv.location}</div>}
                                    </div>
                                    {iv.notes && <div style={{ marginTop: 12, padding: 10, background: '#1a1a1a', borderRadius: 6, fontSize: 13, color: '#a8a8a8' }}>ℹ️ {iv.notes}</div>}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
