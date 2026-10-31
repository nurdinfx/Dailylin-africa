# Dailylink Africa - World-Class Bilingual News & Media Platform

A modern, high-performance, and production-ready digital news and media platform supporting two languages: **Somali** and **English**.

Built for international editorial excellence, inspired by BBC, CNN, and Reuters, with independent dual-language content management, real-time breaking news tickers, TipTap rich text editing, AI translation assistance, video multimedia showcase, full-screen photo galleries, and dynamic SEO & PWA capabilities.

---

## 🌟 Key Features

### 1. Bilingual System (Somali & English)
- **Instant Dual-Language Switcher**: Dedicated toggle in the sticky header with real-time language swap (`SO` / `EN`).
- **Independent Language Storage**: Articles store title, subtitle/excerpt, content, and slug independently in Somali and English.
- **Missing Translation Fallback**: Clear, polite notifications when an article is viewed in a language not yet translated, with fallback to the original text.
- **AI Translation Assistant**: Built-in newsroom translation engine in the CMS allowing editors to auto-translate drafts between Somali and English, review and edit before publishing.

### 2. Editorial Public Website
- **Sticky Header & Navigation**: Real-time date display in Somali/English, market pulse, categories dropdown, search modal trigger, dark/light theme toggle, mobile navigation drawer.
- **Breaking News Ticker**: Yellow accent banner (`#FFC928`) with animated marquee ticker, pause-on-hover, click-to-article, and admin master toggle.
- **Editorial Hero Section**: High-impact lead story with badges, reading time, author avatar, plus ranked secondary spotlight stories.
- **Dynamic News Feed**: Responsive grid with reading time calculations, category pills, author details, and time-ago formatting.
- **Multimedia & Video Showcase**: Embedded and streaming video player with modal viewer, duration badges, and view counters.
- **Curated Photo Galleries**: Visual journalism essays with interactive full-screen Lightbox viewer, captions, and photographer credits.
- **Editorial Footer**: Newsletter subscription box, bureau addresses (Mogadishu & Nairobi), social channels, and legal links.

### 3. Article Reading Experience
- Breadcrumb navigation and category badges.
- Large responsive headlines, subtitle excerpts, and featured images with captions.
- Estimated reading time ("3 daqiiqo oo akhris ah" / "3 min read").
- Interactive text size adjuster (`A` / `A+` / `A++`) for accessibility.
- Local article bookmarking (`localStorage`).
- Social sharing to Twitter/X, Facebook, WhatsApp, Telegram, and copy link with confirmation.
- Rich typography with custom blockquotes, informational highlight callout boxes (`.info`, `.tip`, `.warning`, `.breaking`).
- Real-time article view counter incrementing on view.
- Previous and next story navigation.

### 4. Admin Content Management System (CMS)
- **Secure Authentication**: Bcrypt password hashing, JWT session cookies, and Bearer token support.
- **Newsroom Dashboard**: Live statistics (Total Articles, Drafts, Categories, Media, Total Views) and engagement trend chart.
- **Articles Manager**: Search, filter by category/status, toggle breaking news and featured stories directly from the table, edit, delete.
- **Article Editor**:
  - Two dedicated tabs: **Somali Content** and **English Content**.
  - **TipTap Rich Text Editor**: Headings H1-H3, Bold, Italic, Underline, Lists, Blockquotes, Links, Image embedding, and Callout boxes.
  - Live split preview toggle.
  - One-click AI translation assistant (Somali ↔ English).
  - Status management: `PUBLISHED`, `DRAFT`, `SCHEDULED`, `ARCHIVED`.
- **Category Manager**: Create unlimited categories with Somali/English names, custom slugs, and color badges.
- **Media Library**: Upload photos/videos, search files, copy URL for article embedding, delete files.
- **Video Manager**: Add YouTube embeds or MP4 videos with duration and categories.
- **Photo Gallery Manager**: Curate multi-image photo essays with captions.
- **Site Settings**: Control brand name, taglines, breaking news banner switch, and social channels.

---

## 🚀 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Content Editor**: TipTap Rich Text Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-underline`)
- **Backend & Database**: Prisma ORM with SQLite (instantly switchable to Supabase PostgreSQL)
- **Authentication**: JWT token authentication with bcrypt password hashing
- **SEO & Discovery**: Dynamic `NewsArticle` schema JSON-LD, OpenGraph, Twitter Cards, `sitemap.xml`, `robots.txt`, hreflang alternate tags
- **PWA**: Installable web application with `manifest.webmanifest` and dynamic app icons

---

## 🔑 Default Admin Credentials

Access the administrative CMS at: [`/admin`](http://localhost:3000/admin) or [`/admin/login`](http://localhost:3000/admin/login)

- **Email**: `admin@dailylink.africa`
- **Password**: `admin123`
- **Role**: `SUPER_ADMIN`

*(A quick "Auto-fill Demo Credentials" button is also provided on the login page for instant access).*

---

## 🛠️ Getting Started & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Verify `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dailylink-africa-super-secure-jwt-key-editorial-2026"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# Optional Gemini API key for external AI translation:
GEMINI_API_KEY=""
```

### 3. Generate Prisma Client & Push Database Schema
```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Seed the Database
Pre-populates admin account, categories, high-resolution bilingual articles, multimedia videos, photo galleries, and settings:
```bash
npm run seed
```

### 5. Run the Application
```bash
# Development mode:
npm run dev

# Production build & start:
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Architecture

The system uses a clean relational schema defined in `prisma/schema.prisma`:

| Model | Purpose |
|---|---|
| `User` | Editorial administrators & roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) |
| `Category` | Bilingual categories with Somali name, English name, slug, color badge |
| `Article` | Primary news entity with separate `titleSo`/`contentSo` and `titleEn`/`contentEn` |
| `ArticleView` | Individual view tracking records for analytical reporting |
| `Media` | Media library records with size, dimensions, and URLs |
| `Video` | Video & multimedia stories with YouTube embed or uploaded video URLs |
| `PhotoGallery` | Photo essays with photographer credit |
| `GalleryImage` | Multi-image records linked to photo galleries with bilingual captions |
| `WebsiteSettings` | Global site identity, master breaking ticker toggle, contact info |

### Switching to Supabase / PostgreSQL
To deploy with Supabase PostgreSQL:
1. In `prisma/schema.prisma`, update the datasource provider from `"sqlite"` to `"postgresql"`.
2. In `.env`, set `DATABASE_URL` to your Supabase PostgreSQL connection string.
3. Run `npm run prisma:push` and `npm run seed`.

