'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// ─── Canvas texture generator ─────────────────────────────────────────────
// Maps GeoJSON geographic coordinates to the equirectangular canvas
function projectCoord(lng, lat, w, h) {
    const x = ((lng + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return [x, y];
}

function buildEarthCanvas(geojson) {
    const W = 2048, H = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Ocean fill
    ctx.fillStyle = '#0b1f3a';
    ctx.fillRect(0, 0, W, H);

    // Country fill — dark charcoal so borders will pop
    ctx.fillStyle = '#09090f';
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 0;

    const drawPolygon = (ring) => {
        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
            const [x, y] = projectCoord(lng, lat, W, H);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
    };

    for (const feature of geojson.features) {
        const { type, coordinates } = feature.geometry;
        if (type === 'Polygon') coordinates.forEach(drawPolygon);
        if (type === 'MultiPolygon') coordinates.forEach(p => p.forEach(drawPolygon));
    }

    return canvas;
}

// ─── Country border lines (GeoJSON → LineSegments) ────────────────────────
function latLngToXYZ(lat, lng, r = 1.001) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return [
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    ];
}

function buildBorderGeometry(geojson) {
    const positions = [];

    const processRing = (coords) => {
        for (let i = 0; i < coords.length - 1; i++) {
            const [lng1, lat1] = coords[i];
            const [lng2, lat2] = coords[i + 1];
            positions.push(...latLngToXYZ(lat1, lng1));
            positions.push(...latLngToXYZ(lat2, lng2));
        }
    };

    for (const f of geojson.features) {
        const { type, coordinates } = f.geometry;
        if (type === 'Polygon') coordinates.forEach(processRing);
        if (type === 'MultiPolygon') coordinates.forEach(p => p.forEach(processRing));
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
}

// ─── Components ───────────────────────────────────────────────────────────
function Globe({ texture }) {
    return (
        <mesh>
            <sphereGeometry args={[1, 72, 72]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}

function Borders({ geom }) {
    if (!geom) return null;
    return (
        <lineSegments geometry={geom}>
            <lineBasicMaterial
                color="#3b65d4"
                transparent
                opacity={0.65}
                linewidth={1}
                depthWrite={false}
            />
        </lineSegments>
    );
}

export default function Earth() {
    const [texture, setTexture] = useState(null);
    const [borderGeom, setBorderGeom] = useState(null);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
            .then(r => r.json())
            .then(data => {
                // Build canvas texture
                const canvas = buildEarthCanvas(data);
                const tex = new THREE.CanvasTexture(canvas);
                setTexture(tex);

                // Build border geometry
                setBorderGeom(buildBorderGeometry(data));
            })
            .catch(console.error);
    }, []);

    return (
        <group>
            {/* Fallback dark sphere while GeoJSON loads */}
            {!texture && (
                <mesh>
                    <sphereGeometry args={[1, 72, 72]} />
                    <meshBasicMaterial color="#0b1f3a" />
                </mesh>
            )}

            {texture && <Globe texture={texture} />}
            <Borders geom={borderGeom} />

            {/* Atmospheric rim glow */}
            <mesh scale={[1.03, 1.03, 1.03]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#163a6b"
                    transparent
                    opacity={0.18}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
