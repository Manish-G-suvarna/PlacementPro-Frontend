'use client';
import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Major world cities and countries with approximate centroids
const LABELS = [
    // Countries
    { name: 'RUSSIA', lat: 61.5, lng: 105.3 },
    { name: 'CANADA', lat: 60.0, lng: -96.0 },
    { name: 'USA', lat: 37.1, lng: -95.7 },
    { name: 'BRAZIL', lat: -14.2, lng: -51.9 },
    { name: 'AUSTRALIA', lat: -25.3, lng: 133.8 },
    { name: 'CHINA', lat: 35.9, lng: 104.2 },
    { name: 'INDIA', lat: 20.6, lng: 78.9 },
    { name: 'ARGENTINA', lat: -38.4, lng: -63.6 },
    { name: 'KAZAKHSTAN', lat: 48.0, lng: 66.9 },
    { name: 'ALGERIA', lat: 28.0, lng: 1.7 },
    { name: 'SUDAN', lat: 12.9, lng: 30.2 },
    { name: 'MEXICO', lat: 23.6, lng: -102.6 },
    { name: 'INDONESIA', lat: -0.8, lng: 113.9 },
    { name: 'PAKISTAN', lat: 30.4, lng: 69.3 },
    { name: 'IRAN', lat: 32.4, lng: 53.7 },
    { name: 'MONGOLIA', lat: 46.9, lng: 103.8 },
    { name: 'SAUDI ARABIA', lat: 23.9, lng: 45.1 },
    { name: 'NIGER', lat: 17.6, lng: 8.1 },
    { name: 'ANGOLA', lat: -11.2, lng: 17.9 },
    { name: 'MALI', lat: 17.6, lng: -3.9 },
    { name: 'ETHIOPIA', lat: 9.1, lng: 40.5 },
    { name: 'NIGERIA', lat: 9.1, lng: 8.7 },
    { name: 'SOUTH AFRICA', lat: -29.0, lng: 25.0 },
    { name: 'GERMANY', lat: 51.2, lng: 10.5 },
    { name: 'FRANCE', lat: 46.2, lng: 2.2 },
    { name: 'UKRAINE', lat: 48.4, lng: 31.2 },
    { name: 'TURKEY', lat: 38.9, lng: 35.2 },
    { name: 'MYANMAR', lat: 19.2, lng: 96.7 },
    { name: 'JAPAN', lat: 36.2, lng: 138.2 },
    { name: 'THAILAND', lat: 15.9, lng: 100.9 },
    { name: 'EGYPT', lat: 26.8, lng: 30.8 },
    { name: 'COLOMBIA', lat: 4.6, lng: -74.3 },
    { name: 'PERU', lat: -9.2, lng: -75.0 },
    // Major Cities (smaller text)
    { name: 'New York', lat: 40.7, lng: -74.0, city: true },
    { name: 'London', lat: 51.5, lng: -0.1, city: true },
    { name: 'Tokyo', lat: 35.7, lng: 139.7, city: true },
    { name: 'Mumbai', lat: 19.1, lng: 72.9, city: true },
    { name: 'Dubai', lat: 25.2, lng: 55.3, city: true },
    { name: 'Singapore', lat: 1.35, lng: 103.8, city: true },
    { name: 'Sydney', lat: -33.9, lng: 151.2, city: true },
    { name: 'São Paulo', lat: -23.5, lng: -46.6, city: true },
    { name: 'Beijing', lat: 39.9, lng: 116.4, city: true },
    { name: 'Cairo', lat: 30.0, lng: 31.2, city: true },
    { name: 'Lagos', lat: 6.5, lng: 3.4, city: true },
    { name: 'Seoul', lat: 37.6, lng: 126.9, city: true },
    { name: 'Bangalore', lat: 12.97, lng: 77.6, city: true },
    { name: 'Berlin', lat: 52.5, lng: 13.4, city: true },
    { name: 'Toronto', lat: 43.7, lng: -79.4, city: true },
];

function latLngTo3D(lat, lng, r = 1.02) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    );
}

export default function CountryLabels() {
    const positions = useMemo(() =>
        LABELS.map(l => ({ ...l, pos: latLngTo3D(l.lat, l.lng) })),
        []);

    return (
        <group>
            {positions.map((label) => (
                <Html
                    key={label.name}
                    position={label.pos}
                    center
                    zIndexRange={[1, 0]}
                    occlude={false}
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{
                        color: label.city ? 'rgba(180,220,255,0.75)' : 'rgba(148,187,233,0.55)',
                        fontSize: label.city ? '9px' : '8px',
                        fontWeight: label.city ? 500 : 600,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: label.city ? '0.02em' : '0.12em',
                        whiteSpace: 'nowrap',
                        textShadow: '0 0 6px rgba(0,0,0,0.9)',
                        userSelect: 'none',
                        pointerEvents: 'none',
                    }}>
                        {label.name}
                    </div>
                </Html>
            ))}
        </group>
    );
}
