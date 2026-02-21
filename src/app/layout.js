import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AppShell from '../components/layout/AppShell';

export const metadata = {
  title: 'PlacementPro — Events, Internships & Opportunities',
  description: 'Discover events, internships, competitions, programs, and announcements.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
