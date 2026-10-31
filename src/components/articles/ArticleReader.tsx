'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { 
  Clock, User, Share2, 
  Send, Link2, Bookmark, Check, ArrowLeft, ArrowRight,
  AlertCircle, ChevronRight, ZoomIn, ZoomOut
} from 'lucide-react';
import { TwitterIcon, FacebookIcon, WhatsAppIcon } from '@/components/common/SocialIcons';
import ArticleCard, { ArticleCardData } from './ArticleCard';

interface ArticleReaderProps {
  article: ArticleCardData & {
    imageCaption?: string | null;
    updatedAt?: string | Date;
  };
  relatedArticles: ArticleCardData[];
  latestArticles: ArticleCardData[];
  prevArticle?: { slug: string; titleSo: string; titleEn: string } | null;
  nextArticle?: { slug: string; titleSo: string; titleEn: string } | null;
}

export default function ArticleReader({
  article,
  relatedArticles,
  latestArticles,
  prevArticle,
  nextArticle,
}: ArticleReaderProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Check if article has content in current language
  const hasCurrentLangContent = language === 'so' 
    ? !!article.contentSo && article.contentSo.trim().length > 0
    : !!article.contentEn && article.contentEn.trim().length > 0;

  // Title, Subtitle, and Content with automatic fallback if missing
  const title = (language === 'so' ? article.titleSo : article.titleEn) || 
    (language === 'so' ? article.titleEn : article.titleSo);

  const subtitle = (language === 'so' ? article.subtitleSo : article.subtitleEn) || 
    (language === 'so' ? article.subtitleEn : article.subtitleSo);

  const content = (language === 'so' ? article.contentSo : article.contentEn) || 
    (language === 'so' ? article.contentEn : article.contentSo);

  const categoryName = article.category
    ? language === 'so'
      ? article.category.nameSo
      : article.category.nameEn
    : '';

  useEffect(() => {
    // Check bookmark state
    try {
      const saved = localStorage.getItem('dailylink_bookmarks');
      if (saved) {
        const bookmarks: string[] = JSON.parse(saved);
        setBookmarked(bookmarks.includes(article.id));
      }
    } catch {
      // ignore
    }

    // Record view count
    fetch(`/api/articles/${article.id}/view`, { method: 'POST' }).catch(() => {});
  }, [article.id]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('dailylink_bookmarks');
      let bookmarks: string[] = saved ? JSON.parse(saved) : [];
      if (bookmarked) {
        bookmarks = bookmarks.filter((id) => id !== article.id);
        setBookmarked(false);
      } else {
        bookmarks.push(article.id);
        setBookmarked(true);
      }
      localStorage.setItem('dailylink_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(title);

  const fontSizeClass = {
    normal: 'text-lg leading-relaxed',
    large: 'text-xl leading-loose',
    xlarge: 'text-2xl leading-loose',
  }[fontSize];

  return (
    <article className="py-8 bg-white dark:bg-[#101010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            {t.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          {article.category && (
            <>
              <Link
                href={`/category/${article.category.slug}`}
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                {categoryName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </>
          )}
          <span className="truncate max-w-[200px] text-zinc-700 dark:text-zinc-300 font-medium">
            {title}
          </span>
        </nav>

        {/* Translation Availability Notice */}
        {!hasCurrentLangContent && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-[#FFC928] shrink-0" />
            <div>
              <p className="font-semibold">{t.translationUnavailable}</p>
            </div>
          </div>
        )}

        {/* Header Block */}
        <header className="max-w-4xl">
          {categoryName && (
            <Link
              href={`/category/${article.category?.slug}`}
              className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFC928] text-black shadow-sm mb-4"
            >
              {categoryName}
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-[1.15] tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed font-serif">
              {subtitle}
            </p>
          )}

          {/* Author, Date & Reading Time Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-y border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm">
                  <Image
                    src={article.authorAvatar}
                    alt={article.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-500" />
                </div>
              )}
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">
                  {article.authorName}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {t.published}: {formatDate(article.publishedAt, language)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#FFC928]" />
                {article.readTimeMin || 4} {t.minRead}
              </span>

              {/* Text Size Control */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    fontSize === 'normal' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''
                  }`}
                  title="Normal font size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    fontSize === 'large' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''
                  }`}
                  title="Larger font size"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    fontSize === 'xlarge' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''
                  }`}
                  title="Extra large font size"
                >
                  A++
                </button>
              </div>

              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={toggleBookmark}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  bookmarked
                    ? 'bg-[#FFC928] text-black border-[#FFC928]'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-black'
                }`}
                title={bookmarked ? t.bookmarked : t.bookmark}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-black' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl my-8">
          <div className="relative w-full h-[320px] sm:h-[480px] md:h-[560px] rounded-2xl overflow-hidden shadow-lg bg-zinc-900">
            <Image
              src={article.featuredImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
          {article.imageCaption && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 px-2 italic border-l-2 border-[#FFC928]">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Article Layout: Content (8 cols) + Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article Body */}
          <div className="lg:col-span-8">
            {/* Social Share Bar */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider mr-2 text-zinc-500 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                {t.shareArticle}
              </span>

              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#1DA1F2] hover:text-white transition-colors"
                title="Share on Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#4267B2] hover:text-white transition-colors"
                title="Share on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#25D366] hover:text-white transition-colors"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0088cc] hover:text-white transition-colors"
                title="Share on Telegram"
              >
                <Send className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#FFC928] hover:text-black transition-colors text-xs font-semibold ml-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedToClipboard : 'Link'}</span>
              </button>
            </div>

            {/* Render Article HTML Content */}
            <div
              className={`article-body font-serif ${fontSizeClass}`}
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />

            {/* Story Navigation: Previous & Next */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 font-sans">
              {prevArticle ? (
                <Link
                  href={`/articles/${prevArticle.slug}`}
                  className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all flex flex-col justify-between"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    {t.previousArticle}
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-amber-800 dark:group-hover:text-[#FFC928] mt-2 line-clamp-2">
                    {language === 'so' ? prevArticle.titleSo : prevArticle.titleEn}
                  </p>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  href={`/articles/${nextArticle.slug}`}
                  className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all flex flex-col justify-between text-right"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1">
                    {t.nextArticle}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-amber-800 dark:group-hover:text-[#FFC928] mt-2 line-clamp-2">
                    {language === 'so' ? nextArticle.titleSo : nextArticle.titleEn}
                  </p>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Sticky Sidebar: Most Read & Related */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Most Read Box */}
            <div className="rounded-2xl p-6 bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="w-2 h-5 bg-[#FFC928] rounded-sm"></span>
                <h3 className="font-black text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t.trendingNews}
                </h3>
              </div>

              <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
                {latestArticles.slice(0, 4).map((art, idx) => {
                  const itemTitle = language === 'so' ? art.titleSo : art.titleEn;
                  return (
                    <article key={art.id} className="py-3 first:pt-0 last:pb-0 group">
                      <div className="flex items-start gap-3">
                        <span className="font-serif font-black text-2xl text-zinc-300 dark:text-zinc-600">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-800 dark:group-hover:text-[#FFC928] leading-snug line-clamp-2">
                            <Link href={`/articles/${art.slug}`}>{itemTitle}</Link>
                          </h4>
                          <span className="text-[11px] text-zinc-400 mt-1 block">
                            {formatTimeAgo(art.publishedAt, language)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Side Box */}
            <div className="rounded-2xl p-6 bg-[#111111] text-white border-2 border-[#FFC928] shadow-md">
              <h4 className="font-black text-lg text-[#FFC928] leading-tight">
                DAILYLINK<span className="text-white ml-1">AFRICA</span>
              </h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {language === 'so'
                  ? 'Ku xirnoow xogaha dhabta ah ee Geeska Afrika iyo caalamka maalin kasta.'
                  : 'Subscribe for verified Horn of Africa intelligence and editorial briefings.'}
              </p>
              <Link
                href="/#latest"
                className="mt-4 block w-full text-center bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold py-2 rounded-lg text-xs transition-colors"
              >
                {t.subscribe}
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Coverage Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2.5 h-6 bg-[#FFC928] rounded-sm"></span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                {t.relatedNews}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
