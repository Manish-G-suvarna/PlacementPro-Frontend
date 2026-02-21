'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Users, Globe2, BarChart3, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './welcome.module.css';

const WORDS = ['Opportunities', 'Mentorship', 'Careers', 'Connections', 'Growth'];

export default function WelcomePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [wordIdx, setWordIdx] = useState(0);

    // If already logged in, send them straight to their platform
    useEffect(() => {
        if (loading) return;
        if (user) {
            if (user.role === 'admin') router.replace('/admin');
            else if (user.role === 'organizer') router.replace('/alumni');
            else router.replace('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2400);
        return () => clearInterval(t);
    }, []);

    // Don't flash the welcome page to logged-in users
    if (loading || user) return null;


    return (
        <div className={styles.page}>
            {/* Layered background effects */}
            <div className={styles.bgOrbs}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.orb3} />
            </div>
            <div className={styles.noiseOverlay} />

            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navLogo}>
                    <Sparkles size={20} className={styles.logoIcon} />
                    <span>PlacementPro</span>
                </div>
                <div className={styles.navLinks}>
                    <button className={styles.navBtn} onClick={() => router.push('/login')}>Log In</button>
                    <button className={styles.navBtnPrimary} onClick={() => router.push('/register')}>
                        Sign Up <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <Zap size={14} /> Now Live — Campus Placements 2025
                </div>
                <h1 className={styles.heroTitle}>
                    Your Gateway to<br />
                    <span className={styles.heroRotate} key={wordIdx}>{WORDS[wordIdx]}</span>
                </h1>
                <p className={styles.heroSub}>
                    The all-in-one platform that connects students, Training &amp; Placement Officers,
                    and alumni into one powerful placement ecosystem.
                </p>
                <div className={styles.heroCtas}>
                    <button className={styles.ctaGlow} onClick={() => router.push('/register')}>
                        Get Started Free <ArrowRight size={18} />
                    </button>
                    <button className={styles.ctaGhost} onClick={() => router.push('/login')}>
                        I have an account
                    </button>
                </div>

                {/* Stats strip */}
                <div className={styles.statsStrip}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>500+</span>
                        <span className={styles.statLabel}>Students Placed</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>50+</span>
                        <span className={styles.statLabel}>Partner Companies</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNum}>12 LPA</span>
                        <span className={styles.statLabel}>Avg. Package</span>
                    </div>
                </div>
            </section>

            {/* Scroll indicator */}
            <div className={styles.scrollHint}>
                <ChevronDown size={20} />
            </div>

            {/* Features section */}
            <section className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>Built for Every Stakeholder</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.fCard}>
                        <div className={`${styles.fIcon} ${styles.fIconBlue}`}><Users size={28} /></div>
                        <h3>For Students</h3>
                        <p>Track applications, discover opportunities, get skill-gap insights, and connect with alumni mentors.</p>
                    </div>
                    <div className={styles.fCard}>
                        <div className={`${styles.fIcon} ${styles.fIconPurple}`}><Shield size={28} /></div>
                        <h3>For TPO Admins</h3>
                        <p>Create placement drives, define eligibility criteria, schedule interviews, and send targeted notifications — all from one dashboard.</p>
                    </div>
                    <div className={styles.fCard}>
                        <div className={`${styles.fIcon} ${styles.fIconCyan}`}><Globe2 size={28} /></div>
                        <h3>For Alumni</h3>
                        <p>Give back to your alma mater — post job referrals, offer mentorship slots, and guide the next generation.</p>
                    </div>
                    <div className={styles.fCard}>
                        <div className={`${styles.fIcon} ${styles.fIconAmber}`}><BarChart3 size={28} /></div>
                        <h3>Market Intelligence</h3>
                        <p>Data-driven skill gap analysis, market demand tracking, and personalized learning recommendations.</p>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className={styles.ctaSection}>
                <h2>Ready to transform your placement journey?</h2>
                <button className={styles.ctaGlow} onClick={() => router.push('/register')}>
                    Create Your Account <ArrowRight size={18} />
                </button>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2025 PlacementPro · Built for campus excellence</p>
            </footer>
        </div>
    );
}
