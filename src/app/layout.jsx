import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

export const metadata = {
  title: 'OrbitBoard | Niche Community & Discussion Platform',
  description: 'Join topic communities, discuss ideas, and share content.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-main text-primary min-h-screen antialiased selection:bg-accent-warm/20">
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
              
              {/* Global Toast Notifications */}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}