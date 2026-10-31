const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Clearing Mock Data & Preparing Real Database ---');

  // 1. Delete all mock articles, views, videos, galleries, and media
  await prisma.articleView.deleteMany({});
  console.log('✓ Cleared article views');

  await prisma.article.deleteMany({});
  console.log('✓ Cleared all mock articles');

  await prisma.galleryImage.deleteMany({});
  console.log('✓ Cleared all mock gallery images');

  await prisma.photoGallery.deleteMany({});
  console.log('✓ Cleared all mock photo galleries');

  await prisma.video.deleteMany({});
  console.log('✓ Cleared all mock videos');

  await prisma.media.deleteMany({});
  console.log('✓ Cleared all mock media library items');

  // 2. Ensure default admin user is present with clean credentials
  const hashedPassword = await bcrypt.hash('Dailylink@2026', 10);
  await prisma.user.upsert({
    where: { email: 'admin@dailylink.africa' },
    update: {
      passwordHash: hashedPassword,
      name: 'Editorial Director',
      role: 'SUPER_ADMIN',
      avatarUrl: '/logo.png',
    },
    create: {
      email: 'admin@dailylink.africa',
      passwordHash: hashedPassword,
      name: 'Editorial Director',
      role: 'SUPER_ADMIN',
      avatarUrl: '/logo.png',
    },
  });
  console.log('✓ Admin user verified: admin@dailylink.africa / Dailylink@2026');

  // 3. Update Website Settings with real contact & location details
  await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {
      siteNameSo: 'Dailylink Africa',
      siteNameEn: 'Dailylink Africa',
      taglineSo: 'News | Insights | Africa | Beyond',
      taglineEn: 'News | Insights | Africa | Beyond',
      logoUrl: '/logo.png',
      breakingNewsEnabled: true,
      breakingCustomTextSo: null,
      breakingCustomTextEn: null,
      contactEmail: 'newsroom@dailylink.africa',
      contactPhone: '+252906 592 946',
      twitterUrl: 'https://twitter.com/dailylinkafrica',
      facebookUrl: 'https://facebook.com/dailylinkafrica',
      youtubeUrl: 'https://youtube.com/@dailylinkafrica',
      telegramUrl: 'https://t.me/dailylinkafrica',
      instagramUrl: 'https://instagram.com/dailylinkafrica',
      defaultLanguage: 'so',
    },
    create: {
      id: 'default',
      siteNameSo: 'Dailylink Africa',
      siteNameEn: 'Dailylink Africa',
      taglineSo: 'News | Insights | Africa | Beyond',
      taglineEn: 'News | Insights | Africa | Beyond',
      logoUrl: '/logo.png',
      breakingNewsEnabled: true,
      breakingCustomTextSo: null,
      breakingCustomTextEn: null,
      contactEmail: 'newsroom@dailylink.africa',
      contactPhone: '+252906 592 946',
      twitterUrl: 'https://twitter.com/dailylinkafrica',
      facebookUrl: 'https://facebook.com/dailylinkafrica',
      youtubeUrl: 'https://youtube.com/@dailylinkafrica',
      telegramUrl: 'https://t.me/dailylinkafrica',
      instagramUrl: 'https://instagram.com/dailylinkafrica',
      defaultLanguage: 'so',
    },
  });
  console.log('✓ Website settings updated: Phone +252906 592 946, Logo /logo.png');

  console.log('--- Database is 100% clean and ready for real news! ---');
}

main()
  .catch((e) => {
    console.error('Clear error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

