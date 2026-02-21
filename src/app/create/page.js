'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import styles from './create.module.css';

const TYPES = ['event', 'internship', 'competition', 'program', 'announcement'];

export default function CreatePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        title: '', description: '', type: 'event', tags: '',
        location: '', start_date: '', end_date: '', apply_link: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            setError('Title and description are required');
            return;
        }
        setSubmitting(true); setError('');
        try {
            let finalMediaUrl = '';

            // Upload image to backend/cloudinary first if selected
            if (imageFile) {
                setUploadingImage(true);
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await api.post('/api/upload', formData);
                finalMediaUrl = uploadRes.data.url;
                setUploadingImage(false);
            }

            const postData = { ...form, media_url: finalMediaUrl };
            await api.post('/api/posts', postData);
            router.push('/');
        } catch (err) {
            setUploadingImage(false);
            setError(err.response?.data?.error || 'Failed to create post');
        } finally { setSubmitting(false); }
    };

    if (authLoading || !user) return null;

    return (
        <div className="container">
            <h1 className={styles.title}>Create Post</h1>
            <p className={styles.sub}>Share an event, opportunity, or announcement.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <label className={styles.label}>Type</label>
                <div className={styles.typeRow}>
                    {TYPES.map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`${styles.typeBtn} ${form.type === t ? styles.typeBtnActive : ''}`}
                            onClick={() => update('type', t)}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                <label className={styles.label}>Title *</label>
                <input className={styles.input} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. TechFest 2026" />

                <label className={styles.label}>Description *</label>
                <textarea className={styles.textarea} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the event, opportunity, or announcement..." rows={5} />

                <label className={styles.label}>Image (Optional)</label>
                <div className={styles.imageUploadContainer}>
                    {imagePreview ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                            <button
                                type="button"
                                onClick={removeImage}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button type="button" className={styles.imageUploadBtn} onClick={() => fileInputRef.current?.click()}>
                            <ImageIcon size={18} /> Upload Image
                        </button>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className={styles.hiddenInput}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.half}>
                        <label className={styles.label}>Start Date</label>
                        <input className={styles.input} type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)} />
                    </div>
                    <div className={styles.half}>
                        <label className={styles.label}>End Date</label>
                        <input className={styles.input} type="date" value={form.end_date} onChange={e => update('end_date', e.target.value)} />
                    </div>
                </div>

                <label className={styles.label}>Location</label>
                <input className={styles.input} value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. SRM University, Chennai" />

                <label className={styles.label}>Tags</label>
                <input className={styles.input} value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="e.g. tech, coding, hackathon" />

                <label className={styles.label}>Apply / Registration Link</label>
                <input className={styles.input} value={form.apply_link} onChange={e => update('apply_link', e.target.value)} placeholder="https://..." />

                <button className={styles.submitBtn} disabled={submitting || uploadingImage}>
                    {(submitting || uploadingImage) ? 'Uploading & Posting...' : <><Send size={16} /> Publish Post</>}
                </button>
            </form>
        </div>
    );
}
