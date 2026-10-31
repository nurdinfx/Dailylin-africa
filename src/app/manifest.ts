import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dailylink Africa - News & Media',
    short_name: 'Dailylink',
    description: 'World-Class Bilingual Digital News & Media Platform for the Horn of Africa and the World.',
    start_url: '/',
    display: 'standalone',
    background_color: '#101010',
    theme_color: '#FFC928',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}

