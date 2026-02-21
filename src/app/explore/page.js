'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import PostCard from '../../components/ui/PostCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import styles from './explore.module.css';

const TYPES = ['all', 'event', 'internship', 'competition', 'program', 'announcement'];

export default function ExplorePage() {
    const [activeType, setActiveType] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPosts([]);
        setLoading(true);
        const params = {};
        if (activeType !== 'all') params.type = activeType;
        api.get('/api/feed', { params: { ...params, limit: 30 } })
            .then(res => setPosts(res.data.posts))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [activeType]);

    return (
        <div className="container">
            <h1 className={styles.title}>Explore</h1>
            <p className={styles.sub}>Filter by category to find what interests you.</p>

            <div className={styles.chips}>
                {TYPES.map(type => (
                    <button
                        key={type}
                        className={`${styles.chip} ${activeType === type ? styles.chipActive : ''}`}
                        onClick={() => setActiveType(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : posts.length === 0 ? (
                <div className={styles.empty}>No {activeType === 'all' ? '' : activeType} posts found.</div>
            ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
            )}
        </div>
    );
}
