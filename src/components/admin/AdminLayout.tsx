'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, FolderKanban, Image as ImageIcon, 
  Video, Camera, Settings, LogOut, ExternalLink, Shield, 
  Menu, X, Bell, ChevronRight, UserCheck
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Check auth session
    const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/auth/me', { headers, credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dailylink_token');
    }
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Articles', href: '/admin/articles', icon: FileText },
    { label: 'Categories', href: '/admin/categories', icon: FolderKanban },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Videos', href: '/admin/videos', icon: Video },
    { label: 'Photo Galleries', href: '/admin/galleries', icon: Camera },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#101010] text-zinc-900 dark:text-zinc-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141414] text-white flex flex-col border-r border-[#242424] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#242424]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#0084FF] shrink-0">
              <Image
                src="/logo.png"
                alt="Dailylink Africa"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-lg tracking-tight">
              DAILYLINK <span className="text-[#38BDF8] text-xs uppercase px-1.5 py-0.5 rounded bg-zinc-800 ml-1">CMS</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        {user && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-[#1B1B1B] border border-[#2A2A2A] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0084FF] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider block">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-[#0084FF] text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#242424] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#38BDF8]" />
              Public Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-[#141414] border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span>Editorial Workspace</span>
              <span>•</span>
              <span className="text-zinc-700 dark:text-zinc-200">Somali & English Bilingual CMS</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/articles/create"
              className="bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:border-[#0084FF] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

