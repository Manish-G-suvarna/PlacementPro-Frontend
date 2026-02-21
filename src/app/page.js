'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import PostCard from '../components/ui/PostCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import styles from './page.module.css';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (p = 1) => {
    try {
      const res = await api.get('/api/feed', { params: { page: p, limit: 10 } });
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newUniquePosts = res.data.posts.filter(item => !existingIds.has(item.id));
          return [...prev, ...newUniquePosts];
        });
      }
      setHasMore(res.data.page < res.data.totalPages);
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setPage(p => p + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  return (
    <div className="container">


      {loading && posts.length === 0 ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <p>No posts yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
          {loading && <SkeletonCard />}
          {!hasMore && posts.length > 0 && (
            <p className={styles.endMsg}>You&apos;re all caught up ✓</p>
          )}
        </>
      )}
    </div>
  );
}
