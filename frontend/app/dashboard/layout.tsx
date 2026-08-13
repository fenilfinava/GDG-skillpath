import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import DashboardBackground from '@/components/layout/DashboardBackground';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent font-sans flex text-slate-100 selection:bg-blue-500/30 relative">
      
      {/* Dynamic Background from Landing Page */}
      <DashboardBackground />

      <Sidebar />
      <div className="flex-1 ml-[312px] flex flex-col min-h-screen relative z-10 min-w-0 overflow-x-hidden">
        <Navbar title="Overview" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
