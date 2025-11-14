'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Sidebar from './Sidebar';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <Sidebar />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
} 