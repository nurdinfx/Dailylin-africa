'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Settings, Save, CheckCircle2, Flame, Globe, Mail, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setFeedback('Website settings saved successfully!');
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[#0084FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure global brand identity, breaking news banner, social feeds and contact details.
          </p>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Breaking News Ticker Master Control */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#0084FF]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
                  Breaking News Ticker Banner
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.breakingNewsEnabled}
                  onChange={(e) => setSettings({ ...settings, breakingNewsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0084FF] focus:ring-0"
                />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {settings.breakingNewsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Custom Breaking Text (Somali)
                </label>
                <input
                  type="text"
                  value={settings.breakingCustomTextSo || ''}
                  onChange={(e) => setSettings({ ...settings, breakingCustomTextSo: e.target.value })}
                  placeholder="Qoraal deg deg ah..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Custom Breaking Text (English)
                </label>
                <input
                  type="text"
                  value={settings.breakingCustomTextEn || ''}
                  onChange={(e) => setSettings({ ...settings, breakingCustomTextEn: e.target.value })}
                  placeholder="Breaking news headline..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Brand Identity & Taglines */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Globe className="w-4 h-4 text-[#0084FF]" />
              Brand Identity & Multilingual Taglines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.siteNameEn || 'Dailylink Africa'}
                  onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value, siteNameSo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Default Platform Language
                </label>
                <select
                  value={settings.defaultLanguage || 'so'}
                  onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                >
                  <option value="so">Somali (Default)</option>
                  <option value="en">English (Default)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Tagline (Somali)
                </label>
                <input
                  type="text"
                  value={settings.taglineSo || ''}
                  onChange={(e) => setSettings({ ...settings, taglineSo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Tagline (English)
                </label>
                <input
                  type="text"
                  value={settings.taglineEn || ''}
                  onChange={(e) => setSettings({ ...settings, taglineEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact & Social Links */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Share2 className="w-4 h-4 text-[#0084FF]" />
              Newsroom Contacts & Official Social Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Newsroom Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  value={settings.contactPhone || ''}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl || ''}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebookUrl || ''}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={settings.youtubeUrl || ''}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Website Settings'}</span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

