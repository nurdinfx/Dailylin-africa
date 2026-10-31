'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Upload, Search, Copy, Check, Trash2, 
  Folder, Image as ImageIcon, Link as LinkIcon, Plus 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalName, setExternalName] = useState('');
  const [search, setSearch] = useState('');

  const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/media?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'editorial');

    const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        fetchMedia();
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddExternalUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          url: externalUrl,
          name: externalName || 'Remote Media',
          fileType: 'image/jpeg',
          folder: 'remote',
        }),
      });

      if (res.ok) {
        setUrlModalOpen(false);
        setExternalUrl('');
        setExternalName('');
        fetchMedia();
      }
    } catch {
      alert('Failed to register media URL');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media item?')) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== id));
      }
    } catch {
      alert('Failed to delete media');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Media Library ({media.length})
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Upload, organize, and reuse editorial photos and media assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct file upload */}
            <label className="cursor-pointer inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* URL input modal trigger */}
            <button
              type="button"
              onClick={() => setUrlModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:border-[#FFC928] transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Add from URL</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media files by name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div className="relative w-full h-36 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                  <span>{formatDate(item.createdAt, 'en')}</span>
                  <span>{item.fileType?.split('/')[1]?.toUpperCase() || 'IMG'}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url, item.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#D97706] dark:text-[#FFC928] hover:underline"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* External URL Modal */}
        {urlModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
                Register Remote Image / Media URL
              </h3>
              <form onSubmit={handleAddExternalUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Image Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={externalName}
                    onChange={(e) => setExternalName(e.target.value)}
                    placeholder="e.g. Mogadishu Port Aerial"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Image Direct URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Add to Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

