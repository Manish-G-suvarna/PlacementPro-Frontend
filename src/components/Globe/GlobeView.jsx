'use client';
import React, { useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import Markers from './Markers';
import CountryLabels from './CountryLabels';
import DynamicControls from './DynamicControls';
import SearchBar from '../UI/SearchBar';
import styles from './GlobeView.module.css';
import { gsap } from 'gsap';
import { getPosFromLatLng } from './utils';
import { MapPin, X } from 'lucide-react';

const MARKER_DATA = [
    { id: 1, name: "San Francisco, USA", title: "Tech Hub", lat: 37.7749, lng: -122.4194, type: "hub" },
    { id: 2, name: "London, UK", title: "Finance Capital", lat: 51.5074, lng: -0.1278, type: "hub" },
    { id: 3, name: "Bangalore, India", title: "Silicon Valley of India", lat: 12.9716, lng: 77.5946, type: "hub" },
    { id: 4, name: "Singapore", title: "Asian Hub", lat: 1.3521, lng: 103.8198, type: "hub" },
    { id: 5, name: "Tokyo, Japan", title: "Innovation City", lat: 35.6762, lng: 139.6503, type: "hub" },
];

export default function GlobeView() {
    const orbitRef = useRef(null);
    const [selected, setSelected] = useState(null);
    const router = useRouter();

    const handleSearchSelect = (location) => {
        if (!orbitRef.current) return;
        const localPos = getPosFromLatLng(location.lat, location.lng, 1);
        const euler = new THREE.Euler(0, -Math.PI / 2, 0);
        localPos.applyEuler(euler);
        const cameraPos = localPos.clone().multiplyScalar(2.0);
        const camera = orbitRef.current.object;
        gsap.to(camera.position, { x: cameraPos.x, y: cameraPos.y, z: cameraPos.z, duration: 1.5, ease: 'power3.inOut' });
        gsap.to(orbitRef.current.target, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'power3.inOut' });
    };

    return (
        <div className={styles.globeContainer}>
            {/* ── UI overlay ── */}
            <div className={styles.uiLayer}>
                <div className={styles.topBar}>
                    <div className={styles.titleCard}>
                        <h2>Global Hubs</h2>
                        <p>Explore opportunities worldwide</p>
                    </div>
                    <div className={styles.searchWrapper}>
                        <SearchBar onSelect={handleSearchSelect} data={MARKER_DATA} />
                        <button className={styles.closeGlobeBtn} onClick={() => router.push('/')}> <X size={18} /> </button>
                    </div>
                </div>

                {/* Bottom-left info panel — shows on marker CLICK */}
                {selected && (
                    <div className={styles.infoPanel}>
                        <button className={styles.infoPanelClose} onClick={() => setSelected(null)}>
                            <X size={14} />
                        </button>
                        <div className={styles.infoPanelHeader}>
                            <h3 className={styles.infoPanelName}>{selected.name}</h3>
                            <div className={styles.infoPanelLocation}>
                                <MapPin size={12} />
                                <span>{selected.title}</span>
                            </div>
                        </div>
                        <div className={styles.infoPanelStats}>
                            <div className={styles.statBlock}>
                                <span className={styles.statLabel}>Type</span>
                                <span className={styles.statValue}>{selected.type}</span>
                            </div>
                        </div>
                        <button className={styles.exploreBtn}>Explore Hub</button>
                    </div>
                )}

                <div className={styles.instructions}>
                    <p>Drag to rotate &middot; Scroll to zoom &middot; Click marker for details</p>
                </div>
            </div>

            {/* ── 3D Canvas ── */}
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <color attach="background" args={['#020202']} />
                <ambientLight intensity={1} />

                {/* Fix: keeps drag speed constant as you zoom in/out */}
                <DynamicControls orbitRef={orbitRef} />

                <Suspense fallback={null}>
                    <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
                    <group rotation={[0, -Math.PI / 2, 0]}>
                        <Earth />
                        <Markers data={MARKER_DATA} onClick={setSelected} />
                        <CountryLabels />
                    </group>
                </Suspense>

                <OrbitControls
                    ref={orbitRef}
                    enablePan={false}
                    enableZoom={true}
                    minDistance={1.5}
                    maxDistance={4}
                    zoomSpeed={0.5}
                    rotateSpeed={0.4}
                    enableDamping={false}
                />
            </Canvas>
        </div>
    );
}
