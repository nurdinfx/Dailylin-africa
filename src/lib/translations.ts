export type Language = 'so' | 'en';

export interface Translations {
  // Brand & Meta
  siteName: string;
  tagline: string;
  
  // Navigation
  home: string;
  latestNews: string;
  categories: string;
  videos: string;
  photos: string;
  aboutUs: string;
  contactUs: string;
  search: string;
  admin: string;
  searchPlaceholder: string;
  
  // Breaking News
  breakingNews: string;
  liveUpdates: string;

  // Editorial
  featuredStory: string;
  editorsPick: string;
  topStories: string;
  readMore: string;
  readTime: string;
  minRead: string;
  published: string;
  updated: string;
  byAuthor: string;
  shareArticle: string;
  copiedToClipboard: string;
  bookmark: string;
  bookmarked: string;
  relatedNews: string;
  trendingNews: string;
  previousArticle: string;
  nextArticle: string;
  translationUnavailable: string;
  adjustFontSize: string;
  
  // Sections
  multimediaShowcase: string;
  multimediaDesc: string;
  watchVideo: string;
  photoGalleries: string;
  photoGalleriesDesc: string;
  viewGallery: string;
  photosCount: string;
  stayInformed: string;
  newsletterPrompt: string;
  subscribe: string;
  allRightsReserved: string;
  
  // Filters & Search
  allCategories: string;
  filterBy: string;
  sortBy: string;
  noResultsFound: string;
  recentSearches: string;
  clearHistory: string;
  searchPrompt: string;
  articlesFound: string;
  
  // Common UI
  lightMode: string;
  darkMode: string;
  loading: string;
  error: string;
  close: string;
  backToHome: string;
}

export const translations: Record<Language, Translations> = {
  so: {
    siteName: 'Dailylink Africa',
    tagline: 'Ilaha Xogta iyo Wararka Runta ah ee Geeska Afrika iyo Caalamka',
    home: 'Bogga Hore',
    latestNews: 'Wararkii Ugu Dambeeyay',
    categories: 'Qaybaha Wararka',
    videos: 'Muuqaallo',
    photos: 'Sawirro',
    aboutUs: 'Nagu Saabsan',
    contactUs: 'Nala Soo Xiriir',
    search: 'Raadi',
    admin: 'Maamulka',
    searchPlaceholder: 'Raadi warar, maqaallo, xogo...',
    breakingNews: 'DEG DEG',
    liveUpdates: 'Warar Toos Ah',
    featuredStory: 'Warka Koowaad',
    editorsPick: 'Xulashada Tifaftiraha',
    topStories: 'Wararka Ugu Muhiimsan',
    readMore: 'Akhriso Faahfaahinta',
    readTime: 'Wakhtiga akhriska',
    minRead: 'daqiiqo oo akhris ah',
    published: 'La daabacay',
    updated: 'La cusbooneysiiyay',
    byAuthor: 'Waxaa qoray',
    shareArticle: 'La wadaag asxaabtaada',
    copiedToClipboard: 'Xiriirka waa la koobiyeeyay!',
    bookmark: 'Keydso',
    bookmarked: 'Waa la keydiyay',
    relatedNews: 'Warar Ku Saabsan',
    trendingNews: 'Ugu Akhriska Badan',
    previousArticle: 'Warkii Hore',
    nextArticle: 'Warka Xiga',
    translationUnavailable: 'Warkaani kuma jiro luuqaddan hadda. Waxaad ku akhrisan kartaa luuqadda asalka ah.',
    adjustFontSize: 'Cabbirka Qoraalka',
    multimediaShowcase: 'Muuqaallada & Warbaahinta',
    multimediaDesc: 'Daawo warbixinno muuqaal ah, waraysiyo gaar ah iyo falanqayn qoto-dheer.',
    watchVideo: 'Daawo Muuqaalka',
    photoGalleries: 'Kaydka Sawirrada',
    photoGalleriesDesc: 'Sheekooyin muuqaal ah oo lagu cabbiray sawirro heersare ah oo laga soo qaaday goobaha dhacdooyinka.',
    viewGallery: 'Eeg Sawirrada',
    photosCount: 'Sawir',
    stayInformed: 'Kala Soco Wararka Ugu Dambeeyay',
    newsletterPrompt: 'Ku biir wargeyskayaga maalinlaha ah si aad u hesho xogta muhiimka ah ee Geeska Afrika.',
    subscribe: 'Is-diiwaangeli',
    allRightsReserved: 'Dhammaan xuquuqda way dhowran yihiin.',
    allCategories: 'Dhammaan Qaybaha',
    filterBy: 'Kala shaandhee',
    sortBy: 'U kala horraysii',
    noResultsFound: 'Wax natiijo ah lama helin raadintaada.',
    recentSearches: 'Raadintii Dhawaa',
    clearHistory: 'Tirtir',
    searchPrompt: 'Gali ereyada aad rabto inaad baarto...',
    articlesFound: 'warar la helay',
    lightMode: 'Muuqaalka Cad',
    darkMode: 'Muuqaalka Madow',
    loading: 'Fadlan sug...',
    error: 'Khalad ayaa dhacay. Fadlan dib u tijaabi.',
    close: 'Xir',
    backToHome: 'Ku Laabo Bogga Hore',
  },
  en: {
    siteName: 'Dailylink Africa',
    tagline: 'Your Trusted Source for African & Global News',
    home: 'Home',
    latestNews: 'Latest News',
    categories: 'Categories',
    videos: 'Videos',
    photos: 'Photos',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    search: 'Search',
    admin: 'Admin',
    searchPlaceholder: 'Search articles, topics, multimedia...',
    breakingNews: 'BREAKING',
    liveUpdates: 'Live Updates',
    featuredStory: 'Top Story',
    editorsPick: "Editor's Choice",
    topStories: 'Top Stories',
    readMore: 'Read Full Story',
    readTime: 'Reading time',
    minRead: 'min read',
    published: 'Published',
    updated: 'Updated',
    byAuthor: 'Reported by',
    shareArticle: 'Share this story',
    copiedToClipboard: 'Link copied to clipboard!',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    relatedNews: 'Related Coverage',
    trendingNews: 'Most Read',
    previousArticle: 'Previous Story',
    nextArticle: 'Next Story',
    translationUnavailable: 'This article is currently not translated in this language. Showing the original version.',
    adjustFontSize: 'Text Size',
    multimediaShowcase: 'Video & Multimedia',
    multimediaDesc: 'Watch exclusive reports, in-depth investigations, and editorial video features.',
    watchVideo: 'Watch Video',
    photoGalleries: 'Photo Galleries',
    photoGalleriesDesc: 'Visual journalism and photo essays documenting key events across the African continent.',
    viewGallery: 'View Gallery',
    photosCount: 'Photos',
    stayInformed: 'Stay Informed with Dailylink Africa',
    newsletterPrompt: 'Get verified reporting, geopolitical briefings, and breaking alerts directly to your inbox.',
    subscribe: 'Subscribe',
    allRightsReserved: 'All rights reserved.',
    allCategories: 'All Categories',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    noResultsFound: 'No stories found matching your criteria.',
    recentSearches: 'Recent Searches',
    clearHistory: 'Clear',
    searchPrompt: 'Enter keywords to search articles...',
    articlesFound: 'articles found',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    loading: 'Loading...',
    error: 'An unexpected error occurred. Please try again.',
    close: 'Close',
    backToHome: 'Back to Home',
  },
};

