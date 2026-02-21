import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={`${styles.circle} skeleton`} />
                <div style={{ flex: 1 }}>
                    <div className={`${styles.line} ${styles.w60} skeleton`} />
                    <div className={`${styles.line} ${styles.w30} ${styles.mt4} skeleton`} />
                </div>
            </div>
            <div className={`${styles.block} skeleton`} />
            <div className={styles.tagRow}>
                <div className={`${styles.tagBlock} skeleton`} />
                <div className={`${styles.tagBlock} skeleton`} />
                <div className={`${styles.tagBlock} skeleton`} />
            </div>
        </div>
    );
}
