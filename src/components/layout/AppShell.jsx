'use client';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import RecommendationsSidebar from './RecommendationsSidebar';
import RadialNavigation from '../ui/RadialNavigation';
import RouteGuard from './RouteGuard';

export default function AppShell({ children }) {
    const pathname = usePathname();
    const isGlobe = pathname === '/map';
    const isAdmin = pathname.startsWith('/admin');
    const isAlumni = pathname.startsWith('/alumni');
    const isPublic = ['/welcome', '/login', '/register'].some(p => pathname.startsWith(p));
    const hideShell = isGlobe || isAdmin || isAlumni || isPublic;

    return (
        <RouteGuard>
            {/* Admin and Alumni pages have their own layout */}
            {(isAdmin || isAlumni) ? (
                <>{children}</>
            ) : isPublic || isGlobe ? (
                <div className={isGlobe ? '' : ''}>
                    {children}
                    {isGlobe && <RadialNavigation />}
                </div>
            ) : (
                <div className="appShell">
                    <Navigation />
                    <main className="mainContent">
                        <div className="feedContainer">
                            {children}
                        </div>
                    </main>
                    <RecommendationsSidebar />
                    <RadialNavigation />
                </div>
            )}
        </RouteGuard>
    );
}
