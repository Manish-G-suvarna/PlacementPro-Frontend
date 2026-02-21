'use client';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Keeps rotateSpeed proportional to camera distance.
 * So zooming in doesn't make the globe feel faster to drag.
 * Base distance = 3 (default camera z), base speed = 0.4
 */
export default function DynamicControls({ orbitRef }) {
    const BASE_DISTANCE = 3;
    const BASE_SPEED = 0.4;

    useFrame(() => {
        if (!orbitRef?.current) return;
        const dist = orbitRef.current.object.position.length();
        // Scale speed linearly with distance so it stays consistent
        const scaled = BASE_SPEED * (dist / BASE_DISTANCE);
        orbitRef.current.rotateSpeed = Math.max(0.05, Math.min(scaled, 1.5));
    });

    return null;
}
