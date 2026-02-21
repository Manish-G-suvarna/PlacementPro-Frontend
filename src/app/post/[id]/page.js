'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Bookmark, ExternalLink, Clock, ArrowLeft } from 'lucide-react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import styles from './detail.module.css';

const TYPE_COLORS = {
    event: '#7c5cfc', program: '#3b82f6', internship: '#10b981',
    competition: '#f59e0b', announcement: '#ef4444',
};

export default function PostDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        api.get(`/api/posts/${id}`)
            .then(res => setPost(res.data))
            .catch(() => router.push('/'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleSave = async () => {
        if (!user) { router.push('/login'); return; }
        setSaving(true);
        try {
            const res = await api.post(`/api/posts/${id}/save`);
            setPost(prev => ({ ...prev, is_saved: res.data.saved }));
        } catch { /* ignore */ }
        finally { setSaving(false); }
    };

    const handleApply = async () => {
        if (!user) { router.push('/login'); return; }
        setApplying(true);
        try {
            const res = await api.post(`/api/posts/${id}/apply`);
            setPost(prev => ({ ...prev, is_applied: true }));
            if (res.data.apply_link) window.open(res.data.apply_link, '_blank');
        } catch (err) {
            if (err.response?.status === 409) alert('Already applied!');
        } finally { setApplying(false); }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

    if (loading) return (
        <div className="container">
            <div className={styles.loadingWrap}>
                <div className={`skeleton ${styles.skelTitle}`} />
                <div className={`skeleton ${styles.skelBlock}`} />
                <div className={`skeleton ${styles.skelBlock2}`} />
            </div>
        </div>
    );

    if (!post) return null;
    const color = TYPE_COLORS[post.type] || '#7c5cfc';
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : [];

    return (
        <div className="container">
            <button onClick={() => router.back()} className={styles.backBtn}>
                <ArrowLeft size={18} /> Back
            </button>

            <span className={styles.badge} style={{ background: color + '18', color }}>{post.type.toUpperCase()}</span>
            <h1 className={styles.title}>{post.title}</h1>

            {/* Organizer */}
            <div className={styles.organizer}>
                <div className={styles.avatar} style={{ background: color + '25', color }}>
                    {(post.organizer_name || 'U')[0].toUpperCase()}
                </div>
                <div>
                    <div className={styles.orgName}>{post.organizer_name}</div>
                    {post.organizer_bio && <div className={styles.orgBio}>{post.organizer_bio}</div>}
                </div>
            </div>

            {/* Meta */}
            <div className={styles.metaGrid}>
                {post.start_date && (
                    <div className={styles.metaCard}>
                        <Calendar size={18} color={color} />
                        <div>
                            <div className={styles.metaLabel}>Date</div>
                            <div className={styles.metaValue}>
                                {fmt(post.start_date)}
                                {post.end_date && post.end_date !== post.start_date ? ` — ${fmt(post.end_date)}` : ''}
                            </div>
                        </div>
                    </div>
                )}
                {post.location && (
                    <div className={styles.metaCard}>
                        <MapPin size={18} color={color} />
                        <div>
                            <div className={styles.metaLabel}>Location</div>
                            <div className={styles.metaValue}>{post.location}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Description */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.desc}>{post.description}</p>
            </section>

            {/* Tags */}
            {tags.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Tags</h2>
                    <div className={styles.tags}>
                        {tags.map((tag, i) => <span key={i} className={styles.tag}>#{tag}</span>)}
                    </div>
                </section>
            )}

            <div className={styles.timestamp}>
                <Clock size={13} /> Posted {fmt(post.created_at)}
            </div>

            {/* Actions */}
            <div className={styles.actionBar}>
                <button
                    className={`${styles.saveBtn} ${post.is_saved ? styles.saveBtnActive : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Bookmark size={18} fill={post.is_saved ? 'currentColor' : 'none'} />
                    {post.is_saved ? 'Saved' : 'Save'}
                </button>
                <button
                    className={`${styles.applyBtn} ${post.is_applied ? styles.applyBtnDone : ''}`}
                    onClick={handleApply}
                    disabled={applying || post.is_applied}
                >
                    <ExternalLink size={18} />
                    {post.is_applied ? 'Applied ✓' : 'Apply Now'}
                </button>
            </div>
        </div>
    );
}
