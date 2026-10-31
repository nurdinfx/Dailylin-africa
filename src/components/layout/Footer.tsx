'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Send, Mail, Phone, MapPin, CheckCircle
} from 'lucide-react';
import { TwitterIcon, FacebookIcon, YoutubeIcon, InstagramIcon } from '@/components/common/SocialIcons';

interface CategoryItem {
  id: string;
  slug: string;
  nameSo: string;
  nameEn: string;
}

export default function Footer({ categories = [] }: { categories?: CategoryItem[] }) {
  const { language, t } = useLanguage();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-zinc-300 border-t-4 border-[#FFC928]">
      {/* Newsletter Bar */}
      <div className="border-b border-[#222222] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.stayInformed}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              {t.newsletterPrompt}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#1B1B1B] text-white px-4 py-2.5 rounded-lg border border-[#333333] focus:outline-none focus:border-[#FFC928] text-sm"
              />
              <button
                type="submit"
                className="bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm shrink-0 shadow-md"
              >
                <span>{t.subscribe}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
            {subscribed && (
              <p className="text-[#FFC928] text-xs font-medium mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {language === 'so' ? 'Waad ku mahadsan tahay ku biiristaada!' : 'Thank you for subscribing!'}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-[#FFC928] shrink-0">
                <Image
                  src="/logo.png"
                  alt="Dailylink Africa"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                DAILYLINK<span className="text-[#FFC928] ml-1">AFRICA</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {language === 'so'
                ? 'Dailylink Africa waa warbaahin madax-bannaan oo u heellan faafinta wararka xaqiiqada ku dhisan, falanqayn qoto-dheer iyo xogaha muhiimka ah ee Geeska Afrika iyo caalamka.'
                : 'Dailylink Africa is an independent digital media platform committed to verified journalism, in-depth geopolitical analysis, and multimedia storytelling across the Horn of Africa and the world.'}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#FFC928] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#FFC928] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#FFC928] hover:text-black flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#FFC928] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FFC928] pl-2.5">
              {language === 'so' ? 'Bogagga Muhiimka ah' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/#latest" className="hover:text-white transition-colors">
                  {t.latestNews}
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-white transition-colors">
                  {t.videos}
                </Link>
              </li>
              <li>
                <Link href="/photos" className="hover:text-white transition-colors">
                  {t.photos}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FFC928] pl-2.5">
              {t.categories}
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#FFC928] transition-colors"
                  >
                    {language === 'so' ? cat.nameSo : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#FFC928] pl-2.5">
              {language === 'so' ? 'Xafiiska Wararka' : 'Newsroom & Contact'}
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
                <span>{language === 'so' ? 'Garoowe, Nugaal, Soomaaliya' : 'Garowe, Nugaal, Somalia'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC928] shrink-0" />
                <a href="mailto:newsroom@dailylink.africa" className="hover:text-white">
                  newsroom@dailylink.africa
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC928] shrink-0" />
                <a href="tel:+252906592946" className="hover:text-white">
                  +252906 592 946
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="border-t border-[#222222] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} Dailylink Africa. {t.allRightsReserved}</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              {language === 'so' ? 'Ilaalinta Xogta' : 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              {language === 'so' ? 'Shuruudaha Adeegga' : 'Terms of Service'}
            </Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              {language === 'so' ? 'Anshaxa Saxaafadda' : 'Editorial Code'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
