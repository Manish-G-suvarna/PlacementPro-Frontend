'use client';
import Link from 'next/link';
import { Calendar, MapPin, Bookmark, ExternalLink, MoreHorizontal } from 'lucide-react';
import styles from './PostCard.module.css';

const TYPE_COLORS = {
    event: '#7c5cfc',
    program: '#3b82f6',
    internship: '#10b981',
    competition: '#f59e0b',
    announcement: '#ef4444',
};

export default function PostCard({ post }) {
    const color = TYPE_COLORS[post.type] || '#7c5cfc';
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : [];

    const formatDate = (d) => {
        if (!d) return null;
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const timeAgo = (d) => {
        if (!d) return '';
        const diff = Date.now() - new Date(d).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return '1d';
        if (days < 7) return `${days}d`;
        if (days < 30) return `${Math.floor(days / 7)}w`;
        return formatDate(d);
    };

    return (
        <article className={styles.card}>
            {/* Header — avatar, name, type, time, more */}
            <div className={styles.header}>
                <Link href={`/post/${post.id}`} className={styles.avatarLink}>
                    <div className={styles.avatarRing} style={{ borderColor: color }}>
                        <div className={styles.avatar} style={{ background: color + '30', color }}>
                            {(post.organizer_name || 'U')[0].toUpperCase()}
                        </div>
                    </div>
                </Link>
                <div className={styles.headerInfo}>
                    <Link href={`/post/${post.id}`} className={styles.username}>{post.organizer_name}</Link>
                    <span className={styles.headerMeta}>
                        <span className={styles.timeDot}>•</span>
                        <span>{timeAgo(post.created_at)}</span>
                        <span className={styles.typePill} style={{ color }}>
                            {post.type}
                        </span>
                    </span>
                </div>
                <button className={styles.moreBtn}>
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Content area */}
            <Link href={`/post/${post.id}`} className={styles.contentLink}>
                <div className={styles.contentBox} style={{ borderColor: color + '30' }}>
                    {post.media_url && (
                        <div className={styles.mediaContainer}>
                            <img
                                src={post.media_url}
                                alt="Post media"
                                className={styles.postMedia}
                                loading="lazy"
                            />
                        </div>
                    )}
                    <h3 className={styles.title}>{post.title}</h3>
                    <p className={styles.desc}>{post.description}</p>

                    {/* Meta info */}
                    <div className={styles.metaRow}>
                        {post.start_date && (
                            <span className={styles.metaChip}>
                                <Calendar size={12} /> {formatDate(post.start_date)}
                            </span>
                        )}
                        {post.location && (
                            <span className={styles.metaChip}>
                                <MapPin size={12} /> {post.location}
                            </span>
                        )}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className={styles.tagRow}>
                            {tags.slice(0, 4).map((tag, i) => (
                                <span key={i} className={styles.tag} style={{ color: color }}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>

            {/* Action row */}
            <div className={styles.actions}>
                <div className={styles.actionLeft}>
                    <button className={`${styles.actionBtn} ${post.is_saved ? styles.actionSaved : ''}`}>
                        <Bookmark size={22} strokeWidth={1.6} fill={post.is_saved ? 'currentColor' : 'none'} />
                    </button>
                    {post.apply_link && (
                        <a href={post.apply_link} target="_blank" rel="noopener" className={styles.actionBtn}>
                            <ExternalLink size={22} strokeWidth={1.6} />
                        </a>
                    )}
                </div>
                <Link href={`/post/${post.id}`} className={styles.viewLink}>View details →</Link>
            </div>
        </article>
    );
}
