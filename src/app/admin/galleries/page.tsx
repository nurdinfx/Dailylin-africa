'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaInput from '@/components/admin/MediaInput';
import { Camera, Plus, Trash2, Eye, CheckCircle2, UploadCloud, Loader2 } from 'lucide-react';

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const galleryFilesRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleSo: '',
    titleEn: '',
    descriptionSo: '',
    descriptionEn: '',
    coverImage: '',
    category: 'Life & Culture',
    photographer: 'Dailylink Africa Staff',
    imageUrls: '',
  });

  const handleUploadGalleryPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'galleries');

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: formDataUpload,
        });
        const data = await res.json();
        if (data?.media?.url) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls ? `${prev.imageUrls}\n${data.media.url}` : data.media.url,
            coverImage: prev.coverImage || data.media.url,
          }));
        }
      } catch {
        // ignore
      }
    }
    setUploadingPhotos(false);
  };

  const fetchGalleries = async () => {
    try {
      const res = await fetch('/api/galleries');
      const data = await res.json();
      setGalleries(data.galleries || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse newline or comma separated URLs
      const urls = formData.imageUrls
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean)
        .map((url) => ({ imageUrl: url }));

      if (urls.length === 0 && formData.coverImage) {
        urls.push({ imageUrl: formData.coverImage });
      }

      const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: urls,
        }),
      });

      if (res.ok) {
        setFeedback('Photo gallery created successfully!');
        setModalOpen(false);
        setFormData({
          titleSo: '',
          titleEn: '',
          descriptionSo: '',
          descriptionEn: '',
          coverImage: '',
          category: 'Life & Culture',
          photographer: 'Dailylink Africa Staff',
          imageUrls: '',
        });
        fetchGalleries();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      alert('Failed to create gallery');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this photo gallery?')) return;
    try {
      const res = await fetch('/api/galleries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setGalleries(galleries.filter((g) => g.id !== id));
      }
    } catch {
      alert('Failed to delete gallery');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Photo Galleries ({galleries.length})
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Curate high-resolution visual journalism and photographic essays.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Photo Gallery</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gal) => (
            <div
              key={gal.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 bg-zinc-900">
                <img
                  src={gal.coverImage}
                  alt={gal.titleEn}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {gal.images?.length || 1} Photos
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2">
                    {gal.titleEn}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
                    SO: {gal.titleSo}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>Photo: {gal.photographer || 'Editorial'}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(gal.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
                Create Photo Gallery Essay
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Gallery Title (Somali) *
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
                    Gallery Title (English) *
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
                  label="Gallery Cover Image"
                  type="image"
                  required
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  placeholder="Paste cover link or upload from your device"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Additional Gallery Photos
                    </label>
                    <button
                      type="button"
                      onClick={() => galleryFilesRef.current?.click()}
                      disabled={uploadingPhotos}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFC928] text-black font-bold text-[11px] shadow-sm hover:bg-[#E5B420] transition-colors"
                    >
                      {uploadingPhotos ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5" />
                      )}
                      <span>Upload Photos from Device</span>
                    </button>
                    <input
                      ref={galleryFilesRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadGalleryPhotos}
                      className="hidden"
                    />
                  </div>

                  <textarea
                    rows={4}
                    value={formData.imageUrls}
                    onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                    placeholder="Photo URLs will automatically appear here when uploaded from your device, or you can paste external URLs (one per line)..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Tip: Click "Upload Photos from Device" above to select multiple photos from your computer at once.
                  </span>
                </div>

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
                      Photographer
                    </label>
                    <input
                      type="text"
                      value={formData.photographer}
                      onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md"
                  >
                    Save Photo Gallery
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

