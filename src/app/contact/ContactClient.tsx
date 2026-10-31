'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactClient() {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2.5 h-7 bg-[#FFC928] rounded-sm"></span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            {t.contactUs}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
          {language === 'so'
            ? 'U soo dir talooyinkaaga, xog-ogaalnimada wararka (tips), ama weydiimaha xayeysiiska qolka wararka ee Dailylink Africa.'
            : 'Get in touch with the Dailylink Africa newsroom for editorial tips, op-ed submissions, or partnership inquiries.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 space-y-6">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white">
            {language === 'so' ? 'Xafiisyada Wararka' : 'Editorial Newsrooms'}
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#FFC928] shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 dark:text-white block">
                  {language === 'so' ? 'Xarunta Guud ee Wararka' : 'Headquarters & Newsroom'}
                </strong>
                <span>
                  {language === 'so'
                    ? 'Garoowe, Nugaal, Soomaaliya'
                    : 'Garowe, Nugaal, Somalia'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#FFC928] shrink-0" />
              <span>newsroom@dailylink.africa</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#FFC928] shrink-0" />
              <a href="tel:+252906592946" className="hover:text-[#FFC928] transition-colors">
                +252906 592 946
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {language === 'so'
                  ? 'Farriintaada si guul leh ayaa loo diray! Xafiiska wararka ayaa kula soo xiriiri doona.'
                  : 'Your dispatch was submitted successfully. Our editorial team will review it.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {language === 'so' ? 'Magacaaga' : 'Your Full Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#FFC928]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {language === 'so' ? 'Email-kaaga' : 'Your Email'} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#FFC928]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {language === 'so' ? 'Mowduuca' : 'Subject'} *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#FFC928]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {language === 'so' ? 'Farriintaada' : 'Message / Dispatch Details'} *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-[#FFC928]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFC928] hover:bg-[#E5B420] text-black font-bold py-3 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'so' ? 'Dir Farriinta' : 'Submit to Newsroom'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

