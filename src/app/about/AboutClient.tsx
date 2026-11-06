'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Target, Award, Users, CheckCircle } from 'lucide-react';

export default function AboutClient() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#0084FF] dark:text-[#38BDF8] block mb-2">
          {language === 'so' ? 'Hadafka iyo Qiyamka' : 'Our Mission & Editorial Standard'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
          {language === 'so'
            ? 'Warbaahinta Casriga ah ee Geeska Afrika'
            : 'Independent Journalism for the Horn of Africa'}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {language === 'so'
            ? 'Dailylink Africa waa hay\'ad warbaahineed oo madax-bannaan, u heellan faafinta xogta sugan, falanqaynta qoto-dheer iyo codadka muhiimka ah ee gobolka iyo qurba-joogta.'
            : 'Dailylink Africa is an independent digital news and media organization dedicated to verified facts, rigorous economic reporting, and nuanced cultural storytelling across the Horn of Africa and the diaspora.'}
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-[#0084FF] text-white flex items-center justify-center font-bold mb-4 shadow">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
            {language === 'so' ? 'Xaqiijinta & Hufnaanta' : 'Editorial Integrity'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {language === 'so'
              ? 'Waxaan si adag u ilaalinaa anshaxa saxaafadda xorta ah, anagoo ka fogaaneyna wararka been abuurka ah iyo danaha gaarka ah.'
              : 'Our reporters adhere to strict verification standards, ensuring every dispatch is corroborated, balanced, and context-rich.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-[#002B66] text-[#38BDF8] flex items-center justify-center font-bold mb-4 shadow border border-[#0084FF]/40">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
            {language === 'so' ? 'Labo Luuqadood (Bilingual)' : 'Bilingual Journalism'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {language === 'so'
              ? 'Waxaan wararka ku gudbinnaa Af-Soomaali iyo Ingiriisi si aan u xiriirinno shacabka gobolka iyo bulshada caalamka.'
              : 'Publishing simultaneously in Somali and English bridges local communities with international stakeholders, researchers, and policymakers.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-[#0084FF] text-white flex items-center justify-center font-bold mb-4 shadow">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
            {language === 'so' ? 'Diiradda Dhaqaalaha & Hal-abuurka' : 'Innovation & Growth'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {language === 'so'
              ? 'Waxaan si gaar ah u iftiiminnaa guulaha ganacsiga, tamarta cagaaran, iyo hal-abuurka dhalinyarada tignoolajiyada.'
              : 'Spotlighting entrepreneurial milestones, sustainable energy transitions, and youth-led tech innovations shaping Africa’s future.'}
          </p>
        </div>
      </div>
    </div>
  );
}

