'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Check, Loader2, X, Film, Image as ImageIcon } from 'lucide-react';

interface MediaInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'any';
  placeholder?: string;
  required?: boolean;
}

export default function MediaInput({
  label,
  value,
  onChange,
  type = 'image',
  placeholder,
  required = false,
}: MediaInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept =
    type === 'video'
      ? 'video/mp4,video/webm,video/ogg,video/quicktime'
      : type === 'image'
      ? 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml'
      : 'image/*,video/*';

  const defaultPlaceholder =
    type === 'video'
      ? 'https://www.youtube.com/watch?v=... or https://...'
      : 'https://images.unsplash.com/... or https://...';

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', type === 'video' ? 'videos' : 'images');

      const token = typeof window !== 'undefined' ? localStorage.getItem('dailylink_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/media', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await res.json();
      if (data?.media?.url) {
        onChange(data.media.url);
      }
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const isVideoFile =
    value?.startsWith('/uploads/') &&
    (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov'));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Mode Toggle: Device Upload vs Link */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
              mode === 'upload'
                ? 'bg-[#FFC928] text-black shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Device</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
              mode === 'url'
                ? 'bg-[#FFC928] text-black shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>URL / Link</span>
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#FFC928] dark:hover:border-[#FFC928] rounded-xl p-4 text-center cursor-pointer transition-colors bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center gap-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            {uploading ? (
              <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] dark:text-[#FFC928]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading from device to server...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#FFC928]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {type === 'video' ? (
                    <Film className="w-5 h-5 text-[#D97706] dark:text-[#FFC928]" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-[#D97706] dark:text-[#FFC928]" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Click to browse from your device
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {type === 'video'
                      ? 'MP4, WebM, MOV video files'
                      : 'JPG, PNG, WebP image files'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || defaultPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:border-[#FFC928]"
          />
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-semibold">{error}</p>
      )}

      {/* Current Value / Preview Bar */}
      {value && (
        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {type === 'video' || isVideoFile ? (
              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0 overflow-hidden">
                <Film className="w-5 h-5 text-[#FFC928]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 shrink-0 overflow-hidden border border-zinc-300 dark:border-zinc-600">
                <img
                  src={value}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Selected Source:
              </span>
              <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">
                {value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-md text-zinc-400 hover:text-red-500 transition-colors"
            title="Remove selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

