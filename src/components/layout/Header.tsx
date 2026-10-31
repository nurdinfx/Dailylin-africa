'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Sun, Moon, Search, Menu, X, ChevronDown, 
  Video, Camera
} from 'lucide-react';
import SearchModal from '@/components/common/SearchModal';

interface CategoryItem {
  id: string;
  slug: string;
  nameSo: string;
  nameEn: string;
}

export default function Header({ categories = [] }: { categories?: CategoryItem[] }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Format live date according to active language
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDateStr(now.toLocaleDateString(language === 'so' ? 'so-SO' : 'en-US', options));
  }, [language]);

  const navLinks = [
    { label: t.home, href: '/' },
    { label: t.latestNews, href: '/#latest' },
    { label: t.videos, href: '/videos', icon: Video },
    { label: t.photos, href: '/photos', icon: Camera },
    { label: t.aboutUs, href: '/about' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#111111] text-[#E0E0E0] text-xs py-1.5 px-4 sm:px-8 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline font-medium text-[#FFC928] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse"></span>
              {currentDateStr}
            </span>
            <span className="hidden md:inline text-zinc-400">|</span>
            <span className="hidden md:inline text-zinc-400">
              {language === 'so' ? 'Garoowe, Nugaal, Soomaaliya' : 'Garowe, Nugaal, Somalia'}
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#222222] rounded-full p-0.5 border border-[#333333]">
              <button
                type="button"
                onClick={() => setLanguage('so')}
                className={`px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                  language === 'so'
                    ? 'bg-[#FFC928] text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white'
                }`}
                aria-label="Switch to Somali"
              >
                SO
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-[#FFC928] text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-[#222222] hover:bg-[#333333] text-zinc-200 transition-colors border border-[#333333]"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FFC928]" /> : <Moon className="w-3.5 h-3.5 text-zinc-200" />}
            </button>


          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#101010]/95 backdrop-blur-md shadow-md border-b border-zinc-200 dark:border-zinc-800'
            : 'bg-white dark:bg-[#101010] border-b border-zinc-200 dark:border-zinc-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md border-2 border-[#FFC928] group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/logo.png"
                  alt="Dailylink Africa"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-[#111111] dark:text-white">
                  DAILYLINK<span className="text-[#E5B420] ml-1">AFRICA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {language === 'so' ? 'News | Insights | Africa | Beyond' : 'News | Insights | Africa | Beyond'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-black dark:text-[#FFC928] bg-zinc-100 dark:bg-zinc-800/60'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 opacity-75" />}
                    {link.label}
                  </Link>
                );
              })}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  onBlur={() => setTimeout(() => setCategoriesDropdownOpen(false), 200)}
                  className="px-3.5 py-2 rounded-md font-semibold text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center gap-1"
                >
                  <span>{t.categories}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {categoriesDropdownOpen && categories.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-white dark:bg-[#1B1B1B] border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-800 hover:text-amber-800 dark:hover:text-[#FFC928] transition-colors"
                      >
                        {language === 'so' ? cat.nameSo : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Search and Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-[#FFC928] transition-all"
                aria-label="Open search"
              >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden md:inline text-xs font-medium text-zinc-400">
                  {t.search}...
                </span>
                <kbd className="hidden md:inline text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141414] px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-semibold text-base text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="px-3 text-xs font-bold uppercase text-zinc-400 tracking-wider">
                {t.categories}
              </span>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-[#FFC928]"
                  >
                    {language === 'so' ? cat.nameSo : cat.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

