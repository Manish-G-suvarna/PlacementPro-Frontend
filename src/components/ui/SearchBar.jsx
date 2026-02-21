'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import styles from '../Globe/GlobeView.module.css';

export default function SearchBar({ data, onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = data.filter(loc =>
            loc.name.toLowerCase().includes(val.toLowerCase()) ||
            loc.title.toLowerCase().includes(val.toLowerCase())
        );
        setResults(filtered);
    };

    const handleSelect = (loc) => {
        setQuery(loc.name);
        setResults([]);
        onSelect(loc);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search locations..."
                    value={query}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>
            {results.length > 0 && (
                <ul className={styles.searchResults}>
                    {results.map(loc => (
                        <li key={loc.id} onClick={() => handleSelect(loc)} className={styles.searchResultItem}>
                            <strong>{loc.name}</strong>
                            <span>{loc.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
