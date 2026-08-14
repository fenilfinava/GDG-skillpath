"use client";
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import DashboardBackground from '@/components/layout/DashboardBackground';
import { ResumeProvider } from '@/lib/ResumeContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-transparent font-sans flex text-slate-100 selection:bg-blue-500/30 relative">
        
        {/* Dynamic Background from Landing Page */}
        <DashboardBackground />

        <Sidebar />
        <div className="flex-1 ml-[312px] flex flex-col min-h-screen relative z-10">
          <Navbar title="Overview" />
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ResumeProvider>
  );
}
