'use client';
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function getPosFromLatLng(lat, lng, radius = 1.008) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

export default function Markers({ data, onClick }) {
    return (
        <group>
            {data.map(marker => (
                <Marker key={marker.id} {...marker} onClick={onClick} />
            ))}
        </group>
    );
}

function Marker({ lat, lng, name, title, type, onClick }) {
    const pos = getPosFromLatLng(lat, lng);
    const materialRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (materialRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
            materialRef.current.opacity = hovered ? 1 : 0.8 * pulse;
        }
    });

    return (
        <group position={pos}>
            {/* Core dot */}
            <mesh
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={(e) => { e.stopPropagation(); onClick({ name, title, type }); }}
            >
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial ref={materialRef} color={hovered ? '#67e8f9' : '#22d3ee'} transparent opacity={0.9} />
            </mesh>

            {/* Outer glow ring */}
            <mesh scale={hovered ? 2.8 : 2.0}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial
                    color="#67e8f9"
                    transparent
                    opacity={hovered ? 0.3 : 0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
