'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Calendar, ArrowRight } from 'lucide-react';
import styles from './SearchOverlay.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TYPE_COLORS = {
    event: '#4f46e5',
    program: '#10b981',
    internship: '#f59e0b',
    competition: '#ef4444',
    announcement: '#6366f1',
};

export default function SearchOverlay({ open, onClose }) {
    const router = useRouter();
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Auto-focus input when overlay opens
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
        if (!open) {
            setQuery('');
            setResults([]);
            setSearched(false);
        }
    }, [open]);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setSearched(true);
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch(
                    `${API}/api/feed?search=${encodeURIComponent(query.trim())}&limit=12`,
                    { headers }
                );
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.posts || []);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    const handleResultClick = (postId) => {
        router.push(`/post/${postId}`);
        onClose();
    };

    const formatDate = (d) => {
        if (!d) return null;
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
            >
                {/* Standalone close button */}
                <button className={styles.overlayCloseBtn} onClick={onClose} aria-label="Close search">
                    <X size={24} />
                </button>
                <motion.div
                    className={styles.container}
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className={styles.searchBar}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.input}
                            placeholder="Search events, programs, internships..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Results */}
                    <div className={styles.results}>
                        {loading && (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <span>Searching...</span>
                            </div>
                        )}

                        {!loading && searched && results.length === 0 && (
                            <div className={styles.empty}>
                                <Search size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                                <p>No results found for &ldquo;{query}&rdquo;</p>
                                <span>Try different keywords</span>
                            </div>
                        )}

                        {!loading && !searched && (
                            <div className={styles.empty}>
                                <Search size={40} style={{ opacity: 0.15, marginBottom: 12 }} />
                                <p>Search for events, programs & opportunities</p>
                                <span>Start typing to see results</span>
                            </div>
                        )}

                        {!loading && results.map((post) => (
                            <motion.div
                                key={post.id}
                                className={styles.resultCard}
                                onClick={() => handleResultClick(post.id)}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                                transition={{ duration: 0.15 }}
                            >
                                <div className={styles.resultLeft}>
                                    <span
                                        className={styles.typeBadge}
                                        style={{
                                            background: `${TYPE_COLORS[post.type] || '#6b7280'}15`,
                                            color: TYPE_COLORS[post.type] || '#6b7280',
                                        }}
                                    >
                                        {post.type}
                                    </span>
                                    <h4 className={styles.resultTitle}>{post.title}</h4>
                                    <div className={styles.resultMeta}>
                                        {post.location && (
                                            <span><MapPin size={12} /> {post.location}</span>
                                        )}
                                        {post.start_date && (
                                            <span><Calendar size={12} /> {formatDate(post.start_date)}</span>
                                        )}
                                        {post.organizer_name && (
                                            <span>by {post.organizer_name}</span>
                                        )}
                                    </div>
                                </div>
                                <ArrowRight size={16} className={styles.arrow} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
