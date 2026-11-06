'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@dailylink.africa');
  const [password, setPassword] = useState('Dailylink@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('dailylink_token', data.token);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@dailylink.africa');
    setPassword('Dailylink@2026');
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Editorial Decorative glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0084FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0084FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-[#0084FF] shadow-lg shrink-0">
              <Image
                src="/logo.png"
                alt="Dailylink Africa"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tight">
              DAILYLINK<span className="text-[#0084FF] ml-1">AFRICA</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1">
            <Shield className="w-3.5 h-3.5 text-[#0084FF]" />
            <span>Editorial Content Management System</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#151515] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-2">Admin Sign In</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Authorized newsroom editors and administrators only.
          </p>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@dailylink.africa"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1F1F1F] border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1F1F1F] border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to CMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials shortcut */}
          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-1.5 text-xs text-[#0084FF] hover:underline font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-fill Admin Credentials (admin@dailylink.africa / Dailylink@2026)</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Return to Dailylink Africa Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}

