'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Eye, Code, AlertTriangle, Info, CheckCircle2, Flame
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Write article content here...',
}: TipTapEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D97706] dark:text-[#FFC928] underline underline-offset-2',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-base leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertCallout = (type: 'info' | 'tip' | 'warning' | 'breaking') => {
    const label = {
      info: 'Information',
      tip: 'Editor Insight',
      warning: 'Important Alert',
      breaking: 'Breaking Development',
    }[type];

    const html = `<div class="callout-box ${type}"><strong>${label}:</strong> Enter details here...</div><p></p>`;
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-750 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-[#181818] shadow-sm">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-[#1E1E1E] border-b border-zinc-200 dark:border-zinc-800 select-none">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('underline') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('blockquote') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Quote Block"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Media & Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
            editor.isActive('link') ? 'bg-zinc-200 dark:bg-zinc-700 text-[#FFC928]' : ''
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
          title="Insert Image URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Callout insertion buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertCallout('info')}
            className="p-1 px-2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:opacity-80 flex items-center gap-1"
            title="Insert Info Box"
          >
            <Info className="w-3 h-3" />
            <span>Info</span>
          </button>
          <button
            type="button"
            onClick={() => insertCallout('tip')}
            className="p-1 px-2 rounded bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-xs font-semibold hover:opacity-80 flex items-center gap-1"
            title="Insert Tip Box"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Tip</span>
          </button>
          <button
            type="button"
            onClick={() => insertCallout('warning')}
            className="p-1 px-2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:opacity-80 flex items-center gap-1"
            title="Insert Warning Box"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Warn</span>
          </button>
          <button
            type="button"
            onClick={() => insertCallout('breaking')}
            className="p-1 px-2 rounded bg-yellow-200 dark:bg-yellow-900/60 text-yellow-900 dark:text-yellow-200 text-xs font-bold hover:opacity-80 flex items-center gap-1"
            title="Insert Breaking Callout"
          >
            <Flame className="w-3 h-3 text-[#FFC928]" />
            <span>Breaking</span>
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-colors ${
            isPreview
              ? 'bg-[#FFC928] text-black shadow-sm'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {/* Editor Content or Live Preview */}
      {isPreview ? (
        <div className="p-6 bg-white dark:bg-[#121212] min-h-[300px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC928] block mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            Live Reader Preview Mode
          </span>
          <div
            className="article-body font-serif text-lg leading-relaxed max-w-none"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}

