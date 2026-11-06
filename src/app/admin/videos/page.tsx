'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaInput from '@/components/admin/MediaInput';
import { Video, Plus, Trash2, Play, CheckCircle2 } from 'lucide-react';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titleSo: '',
    titleEn: '',
    descriptionSo: '',
    descriptionEn: '',
    videoUrl: '',
    thumbnailUrl: '',
    durationSec: 240,
    category: 'Business',
    isFeatured: false,
  });

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFeedback('Video published successfully!');
        setModalOpen(false);
        setFormData({
          titleSo: '',
          titleEn: '',
          descriptionSo: '',
          descriptionEn: '',
          videoUrl: '',
          thumbnailUrl: '',
          durationSec: 240,
          category: 'Business',
          isFeatured: false,
        });
        fetchVideos();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      alert('Failed to publish video');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const res = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
      }
    } catch {
      alert('Failed to delete video');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Multimedia & Video Management ({videos.length})
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Publish and organize video reports, interviews, and YouTube features.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Video</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 bg-zinc-900">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </div>
                </div>
                {vid.category && (
                  <span className="absolute top-2.5 left-2.5 bg-black/80 text-[#0084FF] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    {vid.category}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2">
                    {vid.titleEn}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
                    SO: {vid.titleSo}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>{vid.durationSec ? `${Math.floor(vid.durationSec / 60)} mins` : '3 mins'}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(vid.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Publish Video Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
                Add Multimedia / Video
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Video Title (Somali) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleSo}
                    onChange={(e) => setFormData({ ...formData, titleSo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Video Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                  />
                </div>

                <MediaInput
                  label="Video File / YouTube Video"
                  type="video"
                  required
                  value={formData.videoUrl}
                  onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  placeholder="Paste YouTube link or click 'Upload Device' above"
                />

                <MediaInput
                  label="Video Thumbnail Image (Optional - Auto-extracted for YouTube)"
                  type="image"
                  required={false}
                  value={formData.thumbnailUrl}
                  onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  placeholder="Paste Image URL or upload from device"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      value={formData.durationSec}
                      onChange={(e) => setFormData({ ...formData, durationSec: parseInt(e.target.value, 10) || 180 })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md"
                  >
                    Publish Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
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

