'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const PUBLIC_PATHS = ['/welcome', '/login', '/register'];

export default function RouteGuard({ children }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

    useEffect(() => {
        if (loading) return;
        if (!user && !isPublic) {
            router.replace('/welcome');
        }
    }, [user, loading, isPublic, router]);

    // Show nothing while checking auth on protected routes
    if (loading) return null;
    if (!user && !isPublic) return null;

    return children;
}
