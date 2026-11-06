'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, FolderKanban } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    nameSo: '',
    nameEn: '',
    slug: '',
    descriptionSo: '',
    descriptionEn: '',
    color: '#0084FF',
    order: 0,
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFeedback(editingCategory ? 'Category updated!' : 'Category created successfully!');
        setFormData({
          nameSo: '',
          nameEn: '',
          slug: '',
          descriptionSo: '',
          descriptionEn: '',
          color: '#0084FF',
          order: 0,
        });
        setEditingCategory(null);
        fetchCategories();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {
      alert('Failed to save category');
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      nameSo: cat.nameSo,
      nameEn: cat.nameEn,
      slug: cat.slug,
      descriptionSo: cat.descriptionSo || '',
      descriptionEn: cat.descriptionEn || '',
      color: cat.color || '#0084FF',
      order: cat.order || 0,
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Articles in this category will be affected.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback('Category deleted');
        fetchCategories();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      alert('Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            News Categories ({categories.length})
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Organize news sections with independent Somali & English taxonomy.
          </p>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create / Edit Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#0084FF]" />
              <span>{editingCategory ? 'Edit Category' : 'Create New Category'}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Somali Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameSo}
                  onChange={(e) => setFormData({ ...formData, nameSo: e.target.value })}
                  placeholder="e.g. Siyaasadda, Tiknoolajiyadda"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  English Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Politics, Technology"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#0084FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. politics"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 rounded-xl bg-transparent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0084FF] hover:bg-[#006ED6] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setFormData({
                        nameSo: '',
                        nameEn: '',
                        slug: '',
                        descriptionSo: '',
                        descriptionEn: '',
                        color: '#0084FF',
                        order: 0,
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-xs uppercase tracking-wider text-zinc-400">
              Existing Taxonomy
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{ backgroundColor: cat.color || '#0084FF' }}
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {cat.nameEn} / <span className="text-zinc-500">{cat.nameSo}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span>slug: /{cat.slug}</span>
                        <span>•</span>
                        <span>{cat._count?.articles || 0} stories published</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.nameEn)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

