'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from './TipTapEditor';
import MediaInput from './MediaInput';
import { 
  Sparkles, Save, CheckCircle2, AlertCircle, ArrowRightLeft, 
  Flame, Star, Eye, Image as ImageIcon, Loader2 
} from 'lucide-react';

interface CategoryOption {
  id: string;
  nameSo: string;
  nameEn: string;
  slug: string;
}

interface ArticleFormData {
  id?: string;
  slug?: string;
  categoryId: string;
  featuredImage: string;
  imageCaption?: string;
  status: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isEditorPick: boolean;
  authorName: string;
  authorAvatar?: string;
  titleSo: string;
  subtitleSo?: string;
  contentSo: string;
  titleEn: string;
  subtitleEn?: string;
  contentEn: string;
  customSlug?: string;
  tags?: string;
}

interface ArticleFormProps {
  initialData?: ArticleFormData;
  categories: CategoryOption[];
  isEditing?: boolean;
}

export default function ArticleForm({
  initialData,
  categories,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();

  // Active language tab in editor: 'so' | 'en'
  const [activeTab, setActiveTab] = useState<'so' | 'en'>('so');

  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      categoryId: categories[0]?.id || '',
      featuredImage: '',
      imageCaption: '',
      status: 'PUBLISHED',
      isFeatured: false,
      isBreaking: false,
      isEditorPick: false,
      authorName: 'Dailylink Africa Editorial',
      authorAvatar: '',
      titleSo: '',
      subtitleSo: '',
      contentSo: '<p>Halkan ku qor warbixinta maqaalkaaga...</p>',
      titleEn: '',
      subtitleEn: '',
      contentEn: '<p>Write your article report here...</p>',
      customSlug: '',
      tags: '',
    }
  );

  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // AI Translation Assistant
  const handleAITranslation = async (from: 'so' | 'en', to: 'so' | 'en') => {
    const sourceTitle = from === 'so' ? formData.titleSo : formData.titleEn;
    const sourceSubtitle = from === 'so' ? formData.subtitleSo : formData.subtitleEn;
    const sourceContent = from === 'so' ? formData.contentSo : formData.contentEn;

    if (!sourceTitle && !sourceContent) {
      setFeedback({
        type: 'error',
        message: `Please write content in ${from === 'so' ? 'Somali' : 'English'} first before translating.`,
      });
      return;
    }

    setTranslating(true);
    setFeedback(null);

    try {
      // Translate title
      let targetTitle = '';
      if (sourceTitle) {
        const resTitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceTitle, from, to }),
        });
        if (resTitle.ok) {
          const data = await resTitle.json();
          targetTitle = data.translatedText;
        }
      }

      // Translate subtitle
      let targetSubtitle = '';
      if (sourceSubtitle) {
        const resSubtitle = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceSubtitle, from, to }),
        });
        if (resSubtitle.ok) {
          const data = await resSubtitle.json();
          targetSubtitle = data.translatedText;
        }
      }

      // Translate content
      let targetContent = '';
      if (sourceContent) {
        const resContent = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceContent, from, to }),
        });
        if (resContent.ok) {
          const data = await resContent.json();
          targetContent = data.translatedText;
        }
      }

      if (to === 'en') {
        setFormData((prev) => ({
          ...prev,
          titleEn: targetTitle || prev.titleEn,
          subtitleEn: targetSubtitle || prev.subtitleEn,
          contentEn: targetContent || prev.contentEn,
        }));
        setActiveTab('en');
      } else {
        setFormData((prev) => ({
          ...prev,
          titleSo: targetTitle || prev.titleSo,
          subtitleSo: targetSubtitle || prev.subtitleSo,
          contentSo: targetContent || prev.contentSo,
        }));
        setActiveTab('so');
      }

      setFeedback({
        type: 'success',
        message: `Draft translation to ${to === 'so' ? 'Somali' : 'English'} generated! Please review and edit before publishing.`,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Translation service failed. Please try again.' });
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const url = isEditing ? `/api/articles/${initialData?.id}` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        featuredImage: formData.featuredImage?.trim() || '/logo.png',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      setFeedback({
        type: 'success',
        message: isEditing ? 'Article updated successfully!' : 'Article published successfully!',
      });

      setTimeout(() => {
        router.push('/admin/articles');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Notification Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Language Tabs & AI Translation Assistant Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2">
            Language:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('so')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'so'
                ? 'bg-[#0084FF] text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            🇸🇴 Somali Version {formData.titleSo ? '✓' : ''}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'en'
                ? 'bg-[#0084FF] text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            🇬🇧 English Version {formData.titleEn ? '✓' : ''}
          </button>
        </div>

        {/* AI Translation Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'so' ? (
            <button
              type="button"
              disabled={translating}
              onClick={() => handleAITranslation('so', 'en')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-900 dark:text-purple-300 text-xs font-bold transition-all disabled:opacity-50 border border-purple-300 dark:border-purple-800"
            >
              {translating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              )}
              <span>AI Draft: Somali → English</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={translating}
              onClick={() => handleAITranslation('en', 'so')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-900 dark:text-purple-300 text-xs font-bold transition-all disabled:opacity-50 border border-purple-300 dark:border-purple-800"
            >
              {translating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              )}
              <span>AI Draft: English → Somali</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Somali Tab Fields */}
          {activeTab === 'so' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Ciwaanka Maqaalka (Somali Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleSo}
                  onChange={(e) => setFormData({ ...formData, titleSo: e.target.value })}
                  placeholder="Gali ciwaanka rasmiga ah ee maqaalka..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold text-lg sm:text-xl focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Hordhaca / Dulmarka (Somali Subtitle / Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitleSo || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleSo: e.target.value })}
                  placeholder="Hordhac kooban oo soo koobaya nuxurka sheekada..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Qoraalka Buuxa (Somali Rich Content) *
                </label>
                <TipTapEditor
                  content={formData.contentSo}
                  onChange={(html) => setFormData({ ...formData, contentSo: html })}
                  placeholder="Ku qor warbixinta buuxda ee maqaalka halkan..."
                />
              </div>
            </div>
          )}

          {/* English Tab Fields */}
          {activeTab === 'en' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Article Headline (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter official English news headline..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold text-lg sm:text-xl focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Subtitle / Excerpt (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitleEn || ''}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  placeholder="A concise lead sentence highlighting key development..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Full Story Content (English Rich Content) *
                </label>
                <TipTapEditor
                  content={formData.contentEn}
                  onChange={(html) => setFormData({ ...formData, contentEn: html })}
                  placeholder="Write the full English news report here..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish / Status Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Publication Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold focus:outline-none"
              >
                <option value="PUBLISHED">Published (Live)</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameSo})
                  </option>
                ))}
              </select>
            </div>

            {/* Editorial Badges Toggles */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBreaking}
                  onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0084FF] focus:ring-0"
                />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#0084FF]" />
                  Mark as Breaking News
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0084FF] focus:ring-0"
                />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#0084FF]" />
                  Lead Featured Story
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEditorPick}
                  onChange={(e) => setFormData({ ...formData, isEditorPick: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0084FF] focus:ring-0"
                />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Editor's Choice
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isEditing ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>

          {/* Featured Image Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Featured Media
            </h3>

            <MediaInput
              label="Article Featured Image"
              type="image"
              required
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
              placeholder="Paste image link or upload directly from your device"
            />

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">
                Image Caption & Credits
              </label>
              <input
                type="text"
                value={formData.imageCaption || ''}
                onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                placeholder="Photo: Reuters / Dailylink Archive"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Author Details Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Journalist / Author
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">
                Author Avatar URL
              </label>
              <input
                type="url"
                value={formData.authorAvatar || ''}
                onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

