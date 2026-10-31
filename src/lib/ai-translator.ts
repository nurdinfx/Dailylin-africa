/**
 * Dailylink Africa Editorial AI Translation Engine
 * Supports Somali -> English and English -> Somali journalistic translation.
 * Uses Gemini API if GEMINI_API_KEY is configured, or an intelligent built-in
 * editorial translation dictionary & parser for instant offline draft assistance.
 */

interface TranslationResult {
  translatedText: string;
  sourceLang: 'so' | 'en';
  targetLang: 'so' | 'en';
  modelUsed: string;
}

export async function translateContent(
  text: string,
  from: 'so' | 'en',
  to: 'so' | 'en'
): Promise<TranslationResult> {
  if (!text || text.trim() === '') {
    return { translatedText: '', sourceLang: from, targetLang: to, modelUsed: 'none' };
  }

  // Check if GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert bilingual news translator for Dailylink Africa. 
Translate the following news content from ${from === 'so' ? 'Somali' : 'English'} to ${
                      to === 'so' ? 'Somali' : 'English'
                    }. 
Preserve HTML formatting, paragraph breaks, and journalistic tone. 
Return ONLY the translated text without commentary or quotation wrapping:

${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (output) {
          return {
            translatedText: output.trim(),
            sourceLang: from,
            targetLang: to,
            modelUsed: 'gemini-1.5-flash',
          };
        }
      }
    } catch {
      // Fallback to built-in translator
    }
  }

  // Built-in intelligent journalistic translation dictionary & parser
  const translated = runEditorialGlossaryTranslator(text, from, to);
  return {
    translatedText: translated,
    sourceLang: from,
    targetLang: to,
    modelUsed: 'editorial-rule-translator',
  };
}

// Comprehensive journalistic glossary for Somali <-> English
const SOMALIA_TO_ENGLISH_GLOSSARY: Record<string, string> = {
  // Common news phrases
  'war deg deg ah': 'breaking news',
  'wararkii ugu dambeeyay': 'latest news',
  'madaxweynaha': 'the president',
  'ra\'iisul wasaaraha': 'the prime minister',
  'golaha wasiirrada': 'the cabinet of ministers',
  'baarlamaanka': 'the parliament',
  'shir jaraa\'id': 'press conference',
  'dowladda federalka': 'the federal government',
  'wasaaradda arrimaha dibadda': 'the ministry of foreign affairs',
  'wasaaradda maaliyadda': 'the ministry of finance',
  'wasaaradda warfaafinta': 'the ministry of information',
  'amniga iyo nabadgelyada': 'security and peace',
  'geeska afrika': 'the Horn of Africa',
  'qaramada midoobay': 'the United Nations',
  'midowga afrika': 'the African Union',
  'magaalada muqdisho': 'the city of Mogadishu',
  'horumarka dhaqaalaha': 'economic development',
  'heshiis cusub': 'new agreement',
  'ganacsiga iyo maalgashiga': 'trade and investment',
  'shir heer sare ah': 'high-level summit',
  'shirka jaraa\'id': 'the press briefing',
  'waxbarashada iyo caafimaadka': 'education and health',
  'bayaanka wadajirka ah': 'joint communique',
  'go\'aanno muhiim ah': 'key resolutions',
  'waxaa la xaqiijiyay': 'it was confirmed that',
  'sida ay sheegeen mas\'uuliyiinta': 'according to officials',
  'dhanka kale': 'on the other hand',
  'isbeddelka cimilada': 'climate change',
  'tiknoolajiyadda cusub': 'emerging technology',
  'xiriirka labada dal': 'bilateral relations',
  'dib u dhiska dalka': 'national reconstruction',
  'maanta': 'today',
  'shalay': 'yesterday',
  'berri': 'tomorrow',
  'toddobaadkan': 'this week',
  'bishan': 'this month',
};

const ENGLISH_TO_SOMALI_GLOSSARY: Record<string, string> = {
  'breaking news': 'war deg deg ah',
  'latest news': 'wararkii ugu dambeeyay',
  'the president': 'madaxweynaha',
  'president': 'madaxweyne',
  'the prime minister': 'ra\'iisul wasaaraha',
  'prime minister': 'ra\'iisul wasaare',
  'the cabinet': 'golaha wasiirrada',
  'parliament': 'baarlamaanka',
  'press conference': 'shir jaraa\'id',
  'federal government': 'dowladda federaalka',
  'ministry of foreign affairs': 'wasaaradda arrimaha dibadda',
  'ministry of finance': 'wasaaradda maaliyadda',
  'ministry of information': 'wasaaradda warfaafinta',
  'security and peace': 'amniga iyo nabadgelyada',
  'the horn of africa': 'geeska afrika',
  'horn of africa': 'geeska afrika',
  'united nations': 'qaramada midoobay',
  'african union': 'midowga afrika',
  'mogadishu': 'Muqdisho',
  'economic development': 'horumarka dhaqaalaha',
  'new agreement': 'heshiis cusub',
  'trade and investment': 'ganacsiga iyo maalgashiga',
  'high-level summit': 'shir heer sare ah',
  'education and health': 'waxbarashada iyo caafimaadka',
  'joint communique': 'bayaan wadajir ah',
  'climate change': 'isbeddelka cimilada',
  'bilateral relations': 'xiriirka laba geesoodka ah',
  'today': 'maanta',
  'yesterday': 'shalay',
  'this week': 'toddobaadkan',
  'in a statement': 'bayaan ay soo saareen',
  'announced that': 'waxay ku dhawaaqeen in',
  'official sources': 'ilo wareedyo rasmi ah',
};

function runEditorialGlossaryTranslator(text: string, from: 'so' | 'en', to: 'so' | 'en'): string {
  // If translating from Somali to English
  if (from === 'so' && to === 'en') {
    let result = text;
    // Replace key phrases
    for (const [so, en] of Object.entries(SOMALIA_TO_ENGLISH_GLOSSARY)) {
      const regex = new RegExp(`\\b${so}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        // match capitalization
        if (match[0] === match[0].toUpperCase()) {
          return en.charAt(0).toUpperCase() + en.slice(1);
        }
        return en;
      });
    }
    return result;
  }

  // If translating from English to Somali
  let result = text;
  for (const [en, so] of Object.entries(ENGLISH_TO_SOMALI_GLOSSARY)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      if (match[0] === match[0].toUpperCase()) {
        return so.charAt(0).toUpperCase() + so.slice(1);
      }
      return so;
    });
  }
  return result;
}

