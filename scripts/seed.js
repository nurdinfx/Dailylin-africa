const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Dailylink Africa Seeder ---');

  // 1. Create Default Admin User
  const hashedPassword = await bcrypt.hash('Dailylink@2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dailylink.africa' },
    update: { passwordHash: hashedPassword, name: 'Editorial Director', role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@dailylink.africa',
      passwordHash: hashedPassword,
      name: 'Editorial Director',
      role: 'SUPER_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });
  console.log('✓ Admin user ready: admin@dailylink.africa / Dailylink@2026');

  // 2. Create Categories
  const categoriesData = [
    {
      nameSo: 'Siyaasadda',
      nameEn: 'Politics',
      slug: 'politics',
      descriptionSo: 'Wararkii ugu dambeeyay ee siyaasadda dalka, gobolka iyo caalamka.',
      descriptionEn: 'The latest political developments across Somalia, the Horn of Africa and the globe.',
      color: '#DC2626',
      order: 1,
    },
    {
      nameSo: 'Dhaqaalaha & Ganacsiga',
      nameEn: 'Business & Economy',
      slug: 'business',
      descriptionSo: 'Xogta ganacsiga, maalgashiga, suuqyada iyo kobaca dhaqaalaha Afrika.',
      descriptionEn: 'Business insights, investment opportunities, financial markets and African economic growth.',
      color: '#2563EB',
      order: 2,
    },
    {
      nameSo: 'Tiknoolajiyadda',
      nameEn: 'Technology',
      slug: 'technology',
      descriptionSo: 'Hal-abuurka casriga ah, FinTech, sirdoonka macmalka ah iyo horumarka dhijitaalka.',
      descriptionEn: 'Digital innovation, FinTech, artificial intelligence, and startup ecosystems.',
      color: '#7C3AED',
      order: 3,
    },
    {
      nameSo: 'Geeska Afrika',
      nameEn: 'Horn of Africa',
      slug: 'horn-of-africa',
      descriptionSo: 'Falanqayn iyo xogo ku saabsan xiriirka iyo isbeddellada Geeska Afrika.',
      descriptionEn: 'In-depth analysis and reporting on regional dynamics across the Horn of Africa.',
      color: '#D97706',
      order: 4,
    },
    {
      nameSo: 'Dhaqanka & Bulshada',
      nameEn: 'Culture & Society',
      slug: 'culture',
      descriptionSo: 'Suugaanta, farshaxanka, taariikhda iyo nolosha bulshada Soomaaliyeed.',
      descriptionEn: 'Somali literature, visual arts, heritage and social human stories.',
      color: '#059669',
      order: 5,
    },
    {
      nameSo: 'Ciyaaraha',
      nameEn: 'Sports',
      slug: 'sports',
      descriptionSo: 'Wararka ciyaaraha kubadda cagta, orodka iyo tartamada caalamiga ah.',
      descriptionEn: 'Football, athletics, continental leagues and international sports coverage.',
      color: '#EA580C',
      order: 6,
    },
    {
      nameSo: 'Cimilada & Deegaanka',
      nameEn: 'Climate & Environment',
      slug: 'climate',
      descriptionSo: 'Tamarta dib loo cusboonaysiiyo, biyaha, iyo la tacaalidda isbeddelka cimilada.',
      descriptionEn: 'Renewable energy, water security, and sustainable climate adaptation.',
      color: '#16A34A',
      order: 7,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✓ ${categoriesData.length} categories created`);

  // 3. Create Articles
  const articlesData = [
    {
      slug: 'horn-of-africa-infrastructure-accord-signed',
      categoryId: categoryMap['horn-of-africa'],
      authorName: 'Guled Abdi Barre',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      featuredImage: '/logo.png',
      imageCaption: 'Leaders meet during the historic Regional Infrastructure and Economic Corridor Summit.',
      status: 'PUBLISHED',
      isFeatured: true,
      isBreaking: true,
      isEditorPick: true,
      views: 1420,
      readTimeMin: 4,
      publishedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      titleSo: 'Heshiis Taariikhi ah oo ku Saabsan Jidadka Ganacsiga iyo Isku-xirka Geeska Afrika oo la Saxiixay',
      subtitleSo: 'Qorshahan cusub ayaa fududeynaya isu-socodka badeecadaha, dekadaha caalamiga ah iyo tamarta cagaaran.',
      contentSo: `
        <p class="lead">Magaalada Muqdisho iyo magaalooyinka gobolka ayaa maanta martigeliyay saxiixa heshiis weyn oo loogu magac daray <em>"Isku-xirka Dhaqaalaha Geeska Afrika"</em>, kaasoo lagu wado inuu wax ka beddelo isu-socodka ganacsiga xuduudaha.</p>
        
        <h2>Muhiimadda Heshiiska Cusub</h2>
        <p>Heshiiskan oo ay wada saxiixeen mas'uuliyiin heer gobol ah ayaa diiradda saaraya casriyeynta jidadka isku xira dekadaha casriga ah iyo dhulalka fog, fududeynta kastamyada dhijitaalka ah, iyo kobcinta fursadaha ganacsi ee dhalinyarada.</p>
        
        <div class="callout-box info">
          <strong>Xogta Muhiimka ah:</strong> Heshiiskan wuxuu horseedayaa in canshuuraha badeecadaha qaarkood la dhimo ilaa 30%, iyadoo la dhisayo marin gaar ah oo xawaare sare leh.
        </div>

        <p>Tallaabadan ayaa timid xilli baahi weyn loo qabay in la kordhiyo wax-soo-saarka gudaha iyo iskaashiga gobolka si loo abuuro fursado shaqo oo waara.</p>

        <blockquote>
          "Maanta waxay bilow u tahay cutub cusub oo barwaaqo iyo iskaashi dhab ah u horseedi doona shacabka Geeska Afrika."
          <cite>— Mas'uul sare oo ka tirsan guddiga fulinta</cite>
        </blockquote>

        <p>Khubarada dhaqaalaha ayaa saadaalinaya in heshiiskani uu kobcin doono wax-soo-saarka guud (GDP) ee dalalka gobolka sanadaha soo socda.</p>
      `,
      titleEn: 'Historic Regional Economic Corridor and Infrastructure Accord Signed in the Horn of Africa',
      subtitleEn: 'The comprehensive pact unlocks cross-border trade routes, modernizes port facilities, and boosts green energy transit.',
      contentEn: `
        <p class="lead">In a landmark development for regional integration, leaders across the Horn of Africa have formally ratified the <em>Comprehensive Economic Corridor Accord</em>, designed to transform trade logistics and connectivity.</p>

        <h2>Strategic Value of the Agreement</h2>
        <p>The accord establishes unified digital customs declarations, connects inland trade hubs with deep-water coastal ports, and standardizes commercial transport regulations across regional borders.</p>

        <div class="callout-box info">
          <strong>Key Takeaway:</strong> Analysts project trade transit times will drop by over 40%, unlocking hundreds of millions in direct commercial investment.
        </div>

        <p>The move comes amid burgeoning demand for seamless regional supply chains and robust digital infrastructure tailored for small and medium enterprises.</p>

        <blockquote>
          "This agreement marks the dawn of an interconnected, prosperous era built on mutual trust and sustainable regional commerce."
          <cite>— Senior Economic Development Envoy</cite>
        </blockquote>

        <p>International financing institutions have pledged long-term technical and infrastructure support to ensure swift implementation over the next 36 months.</p>
      `,
    },
    {
      slug: 'fintech-revolution-empowering-east-african-startups',
      categoryId: categoryMap['technology'],
      authorName: 'Amina Warsame Hassan',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Young software developers collaborating in a vibrant modern tech accelerator.',
      status: 'PUBLISHED',
      isFeatured: true,
      isBreaking: false,
      isEditorPick: true,
      views: 980,
      readTimeMin: 3,
      publishedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      titleSo: 'Kacdoonka FinTech: Sidee Shirkadaha Dhalinyarada ay u Beddelayaan Nidaamka Lacagaha Casriga ah',
      subtitleSo: 'Adeegyada lacagaha mobiilka iyo barnaamijyada maaliyadeed ee cusub ayaa horseeday koboc dhaqaale oo degdeg ah.',
      contentSo: `
        <p>Suuqa tignoolajiyada ee Bariga Afrika ayaa maraya heerkii ugu sarreeyay ee hal-abuur ganacsi, iyadoo dhalinyaro injineero ah ay hirgeliyeen adeegyo lacag-bixineed oo caalami ah.</p>
        
        <h2>Fududeynta Xawaaladaha iyo Ganacsiga Yaryar</h2>
        <p>Soomaaliya oo muddo dheer caan ku ahayd isticmaalka lacagaha taleefanka gacanta (Mobile Money) ayaa hadda u tallaabsatay nidaamyo maaliyadeed oo ku shaqeeya API furan iyo qalabka AI.</p>
        
        <div class="callout-box tip">
          <strong>Guul Weyn:</strong> In ka badan 80% ganacsiyada yaryar waxay hadda si toos ah u isticmaalaan qalab dhijitaal ah oo xisaabiya dakhliga iyo kharashka.
        </div>

        <p>Shirkadaha maalgashiga caalamiga ah ayaa bilaabay inay indhaha ku hayaan xarumaha tiknoolajiyadda ee Muqdisho, Hargeysa iyo Garowe.</p>
      `,
      titleEn: 'FinTech Revolution: How Young Innovators Are Redefining Modern Digital Finance Across East Africa',
      subtitleEn: 'Next-generation mobile payment platforms and open banking APIs are driving unprecedented commercial agility.',
      contentEn: `
        <p>The tech innovation landscape in the Horn of Africa is experiencing exponential momentum as young software engineers introduce world-class financial software tailored to local and diaspora dynamics.</p>

        <h2>Democratizing Cross-Border Commerce</h2>
        <p>Known globally for pioneering mobile money adoption, Somali entrepreneurs are now moving up the value stack into automated escrow services, open banking APIs, and AI-driven fraud detection systems.</p>

        <div class="callout-box tip">
          <strong>Key Milestone:</strong> Over 80% of micro-enterprises now track real-time liquidity and process settlements through unified digital interfaces.
        </div>

        <p>Venture capital firms from across Nairobi, London, and Dubai have accelerated their seed funding rounds for indigenous tech incubators.</p>
      `,
    },
    {
      slug: 'solar-energy-transition-illuminating-rural-communities',
      categoryId: categoryMap['climate'],
      authorName: 'Dr. Mohamed Nur Farole',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      featuredImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Solar array delivering reliable renewable power to regional farming settlements.',
      status: 'PUBLISHED',
      isFeatured: false,
      isBreaking: false,
      isEditorPick: false,
      views: 740,
      readTimeMin: 4,
      publishedAt: new Date(Date.now() - 1000 * 60 * 360),
      titleSo: 'Tamarta Cadceedda: Mashruucyo Cusub oo Iftiin iyo Biyo Gelinaya Deegaannada Miyiga ah',
      subtitleSo: 'Dhismaha matoorrada ku shaqeeya qorraxda ayaa hoos u dhigay qiimaha korontada iyo shidaalka.',
      contentSo: `
        <p>Adeegsiga tamarta cadceedda ayaa noqday xalka ugu habboon ee lagu gaarsiin karo koronto raqiis ah magaalooyinka yaryar iyo miyiga Soomaaliya.</p>
        
        <h2>Faa'iidooyinka Beeraleyda iyo Xoolo-dhaqatada</h2>
        <p>Ceelasha biyaha ee lagu xiray qorraxda ayaa meesha ka saaray baahidii shidaalka qaaliga ah, taasoo u oggolaatay beeraleyda inay kordhiyaan beerashada khudaarta iyo miraha.</p>
      `,
      titleEn: 'Solar Energy Surge: Mini-Grids Bring Clean Electricity and Water Pumping to Rural Settlements',
      subtitleEn: 'Decentralized solar-powered water and energy systems dramatically cut fuel costs while buffering climate extremes.',
      contentEn: `
        <p>The rapid expansion of community-scale solar micro-grids has emerged as a game-changer for off-grid communities, reducing energy tariffs and unlocking agricultural productivity.</p>

        <h2>Transforming Irrigation and Livestock Support</h2>
        <p>By replacing expensive diesel generators with high-durability photovoltaic pumps, farmers report reliable year-round irrigation and higher yields.</p>
      `,
    },
    {
      slug: 'preserving-somali-oral-poetry-in-digital-age',
      categoryId: categoryMap['culture'],
      authorName: 'Fadumo Jama Cisse',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Archival preservation of historic Somali literature, manuscripts, and acoustic recordings.',
      status: 'PUBLISHED',
      isFeatured: false,
      isBreaking: false,
      isEditorPick: true,
      views: 610,
      readTimeMin: 3,
      publishedAt: new Date(Date.now() - 1000 * 60 * 720),
      titleSo: 'Badbaadinta Gabayada iyo Suugaanta Soomaaliyeed: Mashruuca Dijitaalka ee Hidaha & Dhaqanka',
      subtitleSo: 'Barnaamij cusub oo lagu kaydinayo codadka gabayaagii waaweynaa ee taariikhda qarnigii 20-aad.',
      contentSo: `
        <p>Soomaalida oo dunida looga yaqaanno "Qaranka Gabayaaga" ayaa hadda bilowday qorshe ballaaran oo suugaanta qani ah lagu galinayo maktabadaha dhijitaalka ah ee internetka.</p>
        <p>Qorshahan ayaa u oggolaanaya jiilasha cusub ee qurbaha iyo dalka ku nool inay bartaan qawaaniinta miisaanka maansada iyo qiyamka suugaanta.</p>
      `,
      titleEn: 'Preserving Somali Oral Poetry: Major Digital Archiving Initiative Launched for New Generations',
      subtitleEn: 'Historic acoustic tape recordings and legendary poetry collections are being digitized for global accessibility.',
      contentEn: `
        <p>Celebrated internationally as a "Nation of Poets," a coalition of cultural scholars, universities, and technologists has unveiled a major digital archive preserving centuries of oral literary heritage.</p>
        <p>The multimedia platform provides annotations, audio restoration, and English translations of classic poetic meters for researchers worldwide.</p>
      `,
    },
    {
      slug: 'somali-premier-league-championship-heats-up',
      categoryId: categoryMap['sports'],
      authorName: 'Liban Abdirahman Kheyre',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      featuredImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Thrilling action under stadium floodlights as the national football league enters final stages.',
      status: 'PUBLISHED',
      isFeatured: false,
      isBreaking: false,
      isEditorPick: false,
      views: 1120,
      readTimeMin: 2,
      publishedAt: new Date(Date.now() - 1000 * 60 * 1440),
      titleSo: 'Tartanka Horyaalka Kubadda Cagta ee Dalka oo Maraya Meel Xasaasi ah',
      subtitleSo: 'Taageerayaal aad u tiro badan oo buuxiyay garoonka Stadium Mogadishu kulankii adkaa ee maanta.',
      contentSo: `
        <p>Magaalada Muqdisho waxaa si xiiso leh uga socda horyaalka kubadda cagta, iyadoo kooxaha ugu sarreeya ay ku loolamayaan hanashada koobka sanadkan.</p>
        <p>Cayaarihii ugu dambeeyay ayaa muujiyay horumarka weyn ee ay sameeyeen dhalinyarada cayaartoyda ah ee matala gobollada kala duwan.</p>
      `,
      titleEn: 'National Football Championship Heats Up with Record Stadium Attendances',
      subtitleEn: 'Electric atmosphere at Stadium Mogadishu as top regional clubs contend for the coveted title.',
      contentEn: `
        <p>The National Football Championship entered its defining phase today with high-intensity fixtures drawing tens of thousands of enthusiastic sports fans.</p>
        <p>Coaches commended improved grassroots academies and high-grade turf facilities for elevating sporting standards.</p>
      `,
    },
    {
      slug: 'maritime-trade-and-modern-ports-drive-horn-growth',
      categoryId: categoryMap['business'],
      authorName: 'Guled Abdi Barre',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      featuredImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Container terminals handling expanding international cargo along the Indian Ocean corridor.',
      status: 'PUBLISHED',
      isFeatured: false,
      isBreaking: false,
      isEditorPick: true,
      views: 890,
      readTimeMin: 4,
      publishedAt: new Date(Date.now() - 1000 * 60 * 2100),
      titleSo: 'Horumarka Dekadaha Casriga ah iyo Doorka ay ku Leeyihiin Dhaqaalaha Gobolka',
      subtitleSo: 'Ballaarinta marinnada maraakiibta caalamiga ah ayaa kor u qaaday dakhliga dhoofka iyo soo dejinta badeecadaha.',
      contentSo: `
        <p>Ballaarinta dekadaha Muqdisho, Berbera, Bosaso iyo Kismayo ayaa fursad weyn u siisay dalalka gudaha ku yaalla sida Itoobiya inay si hufan ugu xirmaan suuqyada caalamka.</p>
        <p>Tiknoolajiyadda casriga ah ee maaraynta konteenarrada ayaa meesha ka saartay dib-u-dhacyadii hore ee soo gaari jiray maraakiibta waaweyn.</p>
      `,
      titleEn: 'Modern Port Expansions Anchor Continental Trade and Indian Ocean Maritime Transit',
      subtitleEn: 'Automated container terminals and deep-water berths dramatically accelerate bulk commodity turnover.',
      contentEn: `
        <p>Deep-water port expansions across the Somali coastline are creating critical logistics gateways connecting landlocked African economies to the Red Sea and Gulf shipping arteries.</p>
        <p>Automated cranes and biometric clearance protocols have drastically reduced port turnaround cycles.</p>
      `,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }
  console.log(`✓ ${articlesData.length} articles created`);

  // 4. Create Videos
  const videosData = [
    {
      titleSo: 'Warbixin Gaar ah: Kobaca Dekadaha iyo Ganacsiga Badda ee Bariga Afrika',
      titleEn: 'Special Feature: Port Modernization and Indian Ocean Trade Hubs',
      descriptionSo: 'Daawo sida ay dekadaha casriga ahi u kobcinayaan maalgashiga caalamiga ah ee Geeska Afrika.',
      descriptionEn: 'A cinematic look at the infrastructure transforming container logistics along the East African coast.',
      youtubeId: 'dQw4w9WgXcQ', // safe embed demo
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      durationSec: 420,
      category: 'Business',
      isFeatured: true,
      views: 3400,
    },
    {
      titleSo: 'Hal-abuurka Dhalinyarada: Xarumaha Tiknoolajiyadda ee Geeska Afrika',
      titleEn: 'Youth Innovation: Inside the Booming Tech Incubators of the Horn',
      descriptionSo: 'Kulan aan la yeelannay injineero iyo hal-abuurayaal dhalinyaro ah oo soo saaray adeegyo casri ah.',
      descriptionEn: 'Meeting the developers and founders designing software solutions for African cities.',
      youtubeId: 'dQw4w9WgXcQ',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      durationSec: 310,
      category: 'Technology',
      isFeatured: false,
      views: 2150,
    },
    {
      titleSo: 'Dhaqanka iyo Suugaanta: Heesihii Qarnigii 20-aad iyo Qiimaha Maansada',
      titleEn: 'Heritage & Melody: 20th Century Musical Poetry and Visual Archives',
      descriptionSo: 'Daawo taariikhda hodanka ah ee fanka iyo dhaqanka Soomaaliyeed.',
      descriptionEn: 'Exploring the golden era of acoustic composition and lyrical poetry.',
      youtubeId: 'dQw4w9WgXcQ',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      durationSec: 540,
      category: 'Culture',
      isFeatured: false,
      views: 1890,
    },
  ];

  for (const vid of videosData) {
    await prisma.video.create({
      data: vid,
    });
  }
  console.log(`✓ ${videosData.length} multimedia videos created`);

  // 5. Create Photo Galleries
  const gallery1 = await prisma.photoGallery.create({
    data: {
      titleSo: 'Sawirro: Nolosha Maalinlaha ah iyo Quruxda Xeebaha Geeska Afrika',
      titleEn: 'Photo Essay: Daily Life and Coastal Landscapes Across the Horn of Africa',
      descriptionSo: 'Sawirro heersare ah oo muujinaya bilicda dabiiciga ah, suuqyada firfircoon iyo xeebaha quruxda badan.',
      descriptionEn: 'Striking high-resolution visuals documenting bustling trading markets, coastal horizons, and communal heritage.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      category: 'Life & Nature',
      photographer: 'Ahmed Farah Warsame',
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            captionSo: 'Bilicda xeebta cadceedda soo baxaysa xilliga subaxnimo.',
            captionEn: 'Golden dawn illumination along the white sand coastline.',
            order: 1,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
            captionSo: 'Doonyaha kalluumeysiga oo ka soo laabanaya badda.',
            captionEn: 'Traditional fishing boats returning at daybreak with fresh haul.',
            order: 2,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
            captionSo: 'Suuq ganacsi oo firfircoon oo ay dadku ku kulmaan.',
            captionEn: 'Lively community marketplace trading spices and textiles.',
            order: 3,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
            captionSo: 'Dhalinyarada mustaqbalka oo wax ku baranaya goobaha waxbarashada.',
            captionEn: 'Students learning in modern open-air educational spaces.',
            order: 4,
          },
        ],
      },
    },
  });
  console.log('✓ Photo gallery created with high-res images');

  // 6. Media Library Items
  const mediaItems = [
    {
      name: 'somali-coastal-port.jpg',
      url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      fileType: 'image/jpeg',
      sizeBytes: 420100,
      width: 1200,
      height: 800,
      altTextSo: 'Dekadda casriga ah iyo jidadka ganacsiga',
      altTextEn: 'Modern port and trade logistics corridors',
      folder: 'editorial',
    },
    {
      name: 'tech-coders-office.jpg',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      fileType: 'image/jpeg',
      sizeBytes: 310450,
      width: 1200,
      height: 800,
      altTextSo: 'Dhalinyarada injineerada FinTech',
      altTextEn: 'Young software developers collaborating',
      folder: 'technology',
    },
    {
      name: 'solar-renewable-panels.jpg',
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      fileType: 'image/jpeg',
      sizeBytes: 512000,
      width: 1200,
      height: 800,
      altTextSo: 'Tamarta cadceedda ee miyiga',
      altTextEn: 'Solar panels providing rural renewable electricity',
      folder: 'environment',
    },
  ];

  for (const m of mediaItems) {
    await prisma.media.create({
      data: m,
    });
  }
  console.log(`✓ ${mediaItems.length} media items created`);

  // 7. Website Settings
  await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteNameSo: 'Dailylink Africa',
      siteNameEn: 'Dailylink Africa',
      taglineSo: 'Ilaha Xogta iyo Wararka Runta ah ee Geeska Afrika iyo Caalamka',
      taglineEn: 'Your Trusted Source for African & Global News',
      breakingNewsEnabled: true,
      breakingCustomTextSo: 'Heshiis Taariikhi ah oo ku saabsan marinnada dhaqaalaha Geeska Afrika ayaa goor dhow lagu saxiixay shirka madaxda gobolka.',
      breakingCustomTextEn: 'Historic Regional Economic Corridor and Infrastructure Accord formally signed by African regional delegates.',
      contactEmail: 'contact@dailylink.africa',
      contactPhone: '+252 61 234 5678',
      twitterUrl: 'https://twitter.com/dailylinkafrica',
      facebookUrl: 'https://facebook.com/dailylinkafrica',
      youtubeUrl: 'https://youtube.com/@dailylinkafrica',
      telegramUrl: 'https://t.me/dailylinkafrica',
      instagramUrl: 'https://instagram.com/dailylinkafrica',
      defaultLanguage: 'so',
    },
  });
  console.log('✓ Website settings configured');

  console.log('--- Dailylink Africa Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

