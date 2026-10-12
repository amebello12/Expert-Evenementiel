import { ServiceItem, EventShowcase, GalleryItem, PackageFormula, TestimonialItem } from '../types';

export const COMPANY_INFO = {
  name: 'EXPERT ÉVÉNEMENTIEL',
  slogan: '« Le son. L’ambiance. L’émotion. Votre événement, notre expertise. »',
  heroTagline: '« Donnez du son, de l’énergie et du style à vos événements. »',
  taglineKeywords: 'Sonorisation • DJ • Animation • MC • Photographie • Vidéo • Audiovisuel',
  country: 'Sénégal',
  headquarters: 'Dakar, Sénégal (Interventions à Dakar, Thiès, Saly, Saint-Louis et dans toutes les régions)',
  phone: '+221 77 645 80 80',
  phoneAlt: '+221 78 512 40 40',
  whatsappNumber: '221776458080',
  email: 'contact@expert-evenementiel.sn',
  workingHours: 'Disponible 7j/7 - 24h/24 pour vos événements',
  whatsappDefaultMsg: 'Bonjour Expert Événementiel, je souhaite avoir des informations concernant vos prestations.',
  stats: [
    { value: '+500', label: 'Événements réussis', desc: 'Particuliers et entreprises' },
    { value: '10+', label: 'Ans d’expertise', desc: 'Dans le son et l’audiovisuel' },
    { value: '100%', label: 'Matériel Haute Qualité', desc: 'RCF, Pioneer DJ, Shure' },
    { value: '4.9/5', label: 'Satisfaction client', desc: 'Recommandé par nos clients' },
  ]
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'sonorisation',
    number: '01',
    title: 'Location de sonorisation',
    shortDesc: 'Enceintes professionnelles, amplificateurs, tables de mixage, microphones et caissons de basses.',
    fullDesc: 'Équipements audio haut de gamme adaptés à tous types d’espaces (salles closes, jardins, plages, esplanades). Acoustique calibrée avec précision pour un son pur, puissant et sans saturation.',
    features: [
      'Enceintes actives & passives line array et point source',
      'Caissons de basses puissants pour une immersion totale',
      'Consoles de mixage numériques et analogiques (Yamaha, Allen & Heath)',
      'Microphones sans fil HF Shure & Sennheiser haute fidélité',
      'Installation et réglages acoustiques sur site par techniciens certifiés'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Speaker',
    highlightBadge: 'Matériel Pro'
  },
  {
    id: 'dj-animation',
    number: '02',
    title: 'DJ & Animation',
    shortDesc: 'DJ professionnel, ambiance musicale, animation et programmation adaptée au public et à l’événement.',
    fullDesc: 'Une maîtrise rythmique d’exception pour enflammer vos pistes de danse. Répertoire musical éclectique : Mbalax, Afrobeats, Amapiano, Zouk, Coupé-Décalé, Pop internationale, R&B, House et Lounge.',
    features: [
      'Régie DJ professionnelle Pioneer DJ (CDJ 3000 / DJM 900 NXS2)',
      'Programmation sur mesure selon vos goûts et les moments forts',
      'Transitions fluides et interaction respectueuse avec les invités',
      'Playlists personnalisées (entrée des mariés, discours, dancefloor)',
      'DJ expérimenté habitué aux réceptions prestigieuses'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Music',
    highlightBadge: 'Ambiance Garantie'
  },
  {
    id: 'mc-ceremonie',
    number: '03',
    title: 'MC / Maître de cérémonie',
    shortDesc: 'Présentation, coordination et animation du programme de votre événement avec classe et éloquence.',
    fullDesc: 'Un maître de cérémonie professionnel bilingue (Français / Wolof / Anglais) pour rythmer votre cérémonie, valoriser vos intervenants et garantir le respect strict du chronogramme.',
    features: [
      'Coordination globale avec les organisateurs et prestataires',
      'Prise de parole captivante, élégante et chaleureuse',
      'Gestion protocolaire pour conférences, galas et mariages VIP',
      'Animations dynamiques et animation de jeux pour convives',
      'Maîtrise bilingue Français & Wolof, Anglais disponible'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Mic',
    highlightBadge: 'Élégance & Rythme'
  },
  {
    id: 'photographie',
    number: '04',
    title: 'Photographie',
    shortDesc: 'Couverture photo professionnelle de mariages, anniversaires, soirées, cérémonies et événements pro.',
    fullDesc: 'Immortalisez chaque instant d’émotion avec nos photographes passionnés. Boîtiers plein format haute définition, optiques lumineuses et retouches professionnelles soignées.',
    features: [
      'Reportage complet des préparatifs jusqu’à la fin de la soirée',
      'Séances photos de couple, portraits VIP et photos de groupe',
      'Galerie en ligne privée sécurisée pour partage instantané',
      'Tirages express et albums photos de luxe sur demande',
      'Matériel Sony Alpha / Canon Série L dernière génération'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Camera',
    highlightBadge: 'Haute Définition'
  },
  {
    id: 'video-audiovisuel',
    number: '05',
    title: 'Vidéo & Audiovisuel',
    shortDesc: 'Captation vidéo, production audiovisuelle et couverture professionnelle de vos événements.',
    fullDesc: 'Vivez l’expérience cinématographique. Tournage multi-caméras en 4K Ultra HD, prises de vue aériennes par drone agréé et réalisation de teasers percutants pour vos réseaux sociaux.',
    features: [
      'Captation 4K multi-angles avec stabilisateurs gyroscopiques',
      'Prises de vues aériennes par drone pour plans panoramiques',
      'Aftermovie dynamique (1 à 3 minutes) optimisé pour les réseaux',
      'Film intégral scénarisé de l’événement avec mixage audio',
      'Streaming live et retransmission sur écrans géants LED'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Video',
    highlightBadge: 'Cinématographique'
  },
  {
    id: 'son-lumiere',
    number: '06',
    title: 'Son & Lumière',
    shortDesc: 'Mise en place d’équipements sonores et d’éclairage pour créer une ambiance professionnelle et immersive.',
    fullDesc: 'Sublimez vos espaces avec nos solutions d’éclairage architectural et dynamique. Lyres beam mobiles, projecteurs PAR LED, effets de fumée lourde pour ouverture de bal et wash architectural.',
    features: [
      'Projecteurs PAR LED sans fil sur batterie (éclairage d’ambiance)',
      'Lyres robotisées asservies DMX pour des jeux de lumières dynamiques',
      'Effet nuage / fumée lourde pour ouverture de bal féerique',
      'Machines à étincelles froides intérieures (sécurisées à 100%)',
      'Ponts de lumière, totems en aluminium et distribution électrique pro'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Sparkles',
    highlightBadge: 'Spectacle Immersif'
  }
];

export const EVENTS_SHOWCASE: EventShowcase[] = [
  {
    id: 'mariage-almadies',
    title: 'Mariage Somptueux aux Almadies',
    category: 'Mariages',
    location: 'Les Almadies, Dakar',
    attendees: '350 invités',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    description: 'Une scénographie lumineuse féerique avec éclairage architectural ambre, ouverture de bal sur nuage de fumée lourde et DJ set Mbalax-Afrobeats raffiné.',
    servicesProvided: ['Sonorisation Premium', 'DJ Pro', 'Son & Lumière', 'Vidéo 4K']
  },
  {
    id: 'gala-societe-generale',
    title: 'Gala Annuel & Cérémonie de Remise de Prix',
    category: 'Événements d’entreprise',
    location: 'King Fahd Palace, Dakar',
    attendees: '450 collaborateurs',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    description: 'Accompagnement audiovisuel complet, pupitre orateur avec micros sans fil Shure, projection simultanée et animation musicale de prestige.',
    servicesProvided: ['Audiovisuel Pro', 'MC Bilingue', 'Éclairage corporate', 'Sonorisation']
  },
  {
    id: 'anniversaire-vip-saly',
    title: 'Anniversaire VIP & Pool Party à Saly',
    category: 'Anniversaires',
    location: 'Villa Privée, Saly Portudal',
    attendees: '120 convives',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    description: 'Ambiance lounge en début de soirée au bord de l’eau puis montée en intensité avec DJ live mix, lyres robotisées et effets étincelles.',
    servicesProvided: ['DJ Live Mix', 'Sonorisation Extérieure', 'Éclairage dynamique', 'Photographie']
  },
  {
    id: 'conference-tech-dakar',
    title: 'Sommet Économique & Tech Afrique de l’Ouest',
    category: 'Conférences',
    location: 'Centre International de Conférences Abdou Diouf (CICAD)',
    attendees: '800 délégués',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
    description: 'Régie son multi-zones, captation intégrale pour diffusion streaming internationale et couverture photographique haute résolution.',
    servicesProvided: ['Sonorisation Salle', 'Micros Conférence', 'Captation Vidéo Pro', 'Streaming']
  },
  {
    id: 'soiree-blanche-ngor',
    title: 'Soirée Blanche Exclusive & Show DJ',
    category: 'Soirées',
    location: 'Île de Ngor, Dakar',
    attendees: '250 fêtards',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    description: 'Puissance sonore cristalline avec caissons de basses immergés dans l’ambiance océanique, jeux de faisceaux lumineux vertigineux et show DJ.',
    servicesProvided: ['DJ Animateur', 'Sonorisation Extérieure', 'Effets Spéciaux', 'Aftermovie']
  },
  {
    id: 'bapteme-traditionnel-thies',
    title: 'Baptême Royal & Festivités Traditionnelles',
    category: 'Baptêmes',
    location: 'Thiès Résidence',
    attendees: '200 invités',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    description: 'Respect parfait des traditions sénégalaises et accueil musical chaleureux, sonorisation douce pour les griots et discours, suivie d’une belle animation festive.',
    servicesProvided: ['Sonorisation Adaptée', 'DJ Traditionnel & Moderne', 'Photographe Dédié']
  },
  {
    id: 'concert-live-dakar',
    title: 'Concert Acoustique & Showcase Live',
    category: 'Concerts',
    location: 'Institut Français de Dakar',
    attendees: '600 spectateurs',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    description: 'Régie retour sur scène, mixage façade haute fidélité pour instruments traditionnels (kora, balafon) et synthétiseurs modernes.',
    servicesProvided: ['Sonorisation Concert', 'Ingénieur du Son', 'Pont Éclairage', 'Enregistrement Live']
  },
  {
    id: 'ceremonie-prestige',
    title: 'Cérémonie Officielle & Remise de Diplômes',
    category: 'Cérémonies',
    location: 'Plateau, Dakar',
    attendees: '400 personnes',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
    description: 'Protocole impeccable, régie micro sans faille, hymnes et intermèdes musicaux au timing parfait gérés par notre MC et nos techniciens.',
    servicesProvided: ['MC Maître de Cérémonie', 'Sonorisation Protocole', 'Reportage Photo & Vidéo']
  }
];

export const WHY_CHOOSE_US = [
  {
    icon: 'Speaker',
    title: 'Matériel professionnel',
    desc: 'Marques de référence mondiale (Pioneer DJ, RCF, Yamaha, Shure, Sennheiser). Équipements récents révisés après chaque prestation.'
  },
  {
    icon: 'Disc3',
    title: 'DJ expérimenté',
    desc: 'Maîtrise absolue du dancefloor avec un répertoire pan-africain et international : Mbalax, Afrobeats, Amapiano, Zouk, Hip-hop, Pop.'
  },
  {
    icon: 'Flame',
    title: 'Animation dynamique',
    desc: 'Une capacité unique à créer une symbiose avec vos invités, gérer le timing des surprises et maintenir une ambiance électrisante.'
  },
  {
    icon: 'Volume2',
    title: 'Qualité sonore irréprochable',
    desc: 'Calibrage acoustique fin selon la géométrie du lieu. Zéro larsen, clarté absolue de la voix et des basses enveloppantes et rondes.'
  },
  {
    icon: 'Users',
    title: 'Équipe professionnelle',
    desc: 'Techniciens du son, ingénieurs lumière, DJ et cadreurs qualifiés, en tenue soignée et animés par le sens du service d’excellence.'
  },
  {
    icon: 'Clock',
    title: 'Ponctualité rigoureuse',
    desc: 'Installation et balances techniques achevées 3 heures avant l’arrivée des premiers invités pour une sérénité totale le jour J.'
  },
  {
    icon: 'Sparkles',
    title: 'Accompagnement personnalisé',
    desc: 'Visite technique préalable, coordination avec votre traiteur et wedding planner, conseils sur mesure pour magnifier votre fête.'
  },
  {
    icon: 'CheckCircle2',
    title: 'Solutions adaptées à votre budget',
    desc: 'Flexibilité tarifaire et formules modulables transparentes, pensées pour offrir le meilleur rapport qualité/prix du marché sénégalais.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Régie DJ Pioneer en Pleine Action',
    category: 'DJ en prestation',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'En Direct',
    description: 'Mix live sur platines Pioneer CDJ 3000 lors d’une soirée VIP à Dakar.'
  },
  {
    id: 'gal-2',
    title: 'Table de Mixage & Console Audio',
    category: 'Matériel de sonorisation',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Technique Pro',
    description: 'Alignement audio et balance fréquences pour une acoustique parfaite.'
  },
  {
    id: 'gal-3',
    title: 'Scénographie Mariage Lumineuse',
    category: 'Mariages',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Luxe & Féerie',
    description: 'Projecteurs architecturaux et mise en valeur des tables de mariage.'
  },
  {
    id: 'gal-4',
    title: 'Public en Liesse & Ambiance Dancefloor',
    category: 'Public & Ambiance',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Énergie Pure',
    description: 'Une piste de danse comble vibrant au rythme des meilleurs sons.'
  },
  {
    id: 'gal-5',
    title: 'Jeux de Lumières & Lyres Robotisées',
    category: 'Éclairages',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Show Lumière',
    description: 'Faisceaux DMX et faisceaux laser synchronisés avec le rythme musical.'
  },
  {
    id: 'gal-6',
    title: 'Ouverture de Bal Romantique',
    category: 'Mariages',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Émotion',
    description: 'Fumée lourde et étincelles froides pour une danse inoubliable.'
  },
  {
    id: 'gal-7',
    title: 'Gala d’Entreprise & Conférence Dakar',
    category: 'Événements',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Corporate',
    description: 'Installation discrète et élégante adaptée aux exigences institutionnelles.'
  },
  {
    id: 'gal-8',
    title: 'Soirée Festivités & Jeux de Faisceaux',
    category: 'Soirées',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    type: 'photo',
    durationOrTag: 'Nightlife',
    description: 'Le summum de l’ambiance festive à Dakar avec son surround et effets visuels.'
  }
];

export const FORMULAS_LIST: PackageFormula[] = [
  {
    id: 'essentielle',
    name: 'FORMULE ESSENTIELLE',
    tagline: 'L’essentiel pour un son clair et une ambiance réussie',
    priceNote: 'Sur devis',
    servicesIncluded: ['Sonorisation professionnelle', 'DJ professionnel'],
    idealFor: 'Anniversaires privés, cocktails intimes, réunions (jusqu’à 100 personnes)',
    features: [
      '2 Enceintes amplifiées professionnelles haute fidélité',
      'Table de mixage & régie DJ Pioneer',
      'DJ animateur expérimenté (mix varié)',
      '1 Micro sans fil HF pour discours et annonces',
      'Installation, câblage & désinstallation inclus',
      'Jusqu’à 6 heures de prestation'
    ],
    isPopular: false
  },
  {
    id: 'premium',
    name: 'FORMULE PREMIUM',
    tagline: 'L’alliance parfaite du son, de l’ambiance et de l’animation dynamique',
    priceNote: 'Sur devis',
    badge: 'La Plus Demandée',
    servicesIncluded: ['Sonorisation professionnelle', 'DJ professionnel', 'Animation dynamique'],
    idealFor: 'Mariages élégants, baptêmes, soirées privées, réceptions (jusqu’à 250 personnes)',
    features: [
      'Système sonore 4 enceintes + caisson de basses puissant',
      'Régie DJ professionnelle haut de gamme',
      'DJ & Animateur pour coordonner les temps forts',
      'Pack de 4 projecteurs d’ambiance LED',
      '2 Micros sans fil professionnels Shure',
      'Visite technique préalable du lieu de réception',
      'Jusqu’à 8 heures de prestation'
    ],
    isPopular: true
  },
  {
    id: 'evenement',
    name: 'FORMULE ÉVÉNEMENT',
    tagline: 'L’expérience complète tout-en-un pour un événement mémorable',
    priceNote: 'Sur devis',
    badge: 'Expérience Totale',
    servicesIncluded: ['Sonorisation', 'DJ', 'MC / Maître de cérémonie', 'Éclairage complet'],
    idealFor: 'Mariages VIP, galas d’entreprise, remises de prix, grandes célébrations',
    features: [
      'Système de sonorisation forte puissance multi-points',
      'DJ professionnel & Maître de cérémonie (MC) bilingue',
      'Show lumière complet : 8 projecteurs PAR LED + 2 lyres robotisées',
      'Effet fumée lourde ou étincelles froides pour ouverture de bal',
      'Régie micro HF complète (4 micros) pour panel et intervenants',
      'Présence continue de 2 techniciens dédiés',
      'Durée de prestation flexible'
    ],
    isPopular: false
  },
  {
    id: 'sur-mesure',
    name: 'FORMULE SUR MESURE',
    tagline: 'Une solution 100% personnalisée adaptée à vos exigences exactes',
    priceNote: 'Sur devis',
    badge: '100% Personnalisable',
    servicesIncluded: ['Son', 'Lumière', 'DJ', 'MC', 'Photo', 'Vidéo', 'Drone', 'Écrans LED'],
    idealFor: 'Concerts, festivals, séminaires multi-jours, mariages d’envergure',
    features: [
      'Étude acoustique et scénographique personnalisée',
      'Choix libre des prestations à la carte ou pack global',
      'Couverture photo & vidéo 4K avec drone et montage teaser',
      'Murs d’écrans LED géants et retransmission live',
      'Groupes électrogènes de secours insonorisés si nécessaire',
      'Chef de projet audiovisuel dédié de la conception au démontage'
    ],
    isPopular: false
  }
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Fatou & Ibrahima Diallo',
    role: 'Mariés',
    event: 'Mariage somptueux aux Almadies',
    city: 'Dakar',
    rating: 5,
    comment: 'Une prestation tout simplement magistrale ! Le DJ a su alterner avec brio entre Mbalax, Afrobeats et musiques douces pour le dîner. L’ouverture de bal avec la fumée lourde a ému tous nos invités. Mille mercis à Expert Événementiel pour leur sérieux et leur ponctualité exemplaire.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    date: 'Janvier 2026'
  },
  {
    id: 'test-2',
    name: 'Mamadou Lamine Ndiaye',
    role: 'Directeur de la Communication',
    event: 'Gala Annuel Société Financière',
    city: 'King Fahd Palace, Dakar',
    rating: 5,
    comment: 'Travailler avec Expert Événementiel a été un pur soulagement pour notre direction. Le matériel sonore était d’une clarté irréprochable pour les allocutions de nos dirigeants, et l’éclairage corporate a sublimé la salle. Une équipe réactive et extrêmement professionnelle.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    date: 'Décembre 2025'
  },
  {
    id: 'test-3',
    name: 'Aïssatou Ba',
    role: 'Organisatrice de Réception',
    event: 'Baptême & Fête de Famille',
    city: 'Saly Portudal',
    rating: 5,
    comment: 'L’équipe est arrivée 3 heures en avance comme convenu. Zéro imprévu technique, le son était puissant sans jamais agresser les oreilles des aînés. Le MC et le DJ ont su faire danser toutes les générations jusqu’à 4h du matin. Je recommande les yeux fermés !',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    date: 'Février 2026'
  },
  {
    id: 'test-4',
    name: 'Cheikh Tidiane Sy',
    role: 'Fondateur de Start-up',
    event: 'Lancement de Produit & Conférence Tech',
    city: 'Dakar Plateau',
    rating: 5,
    comment: 'La captation vidéo et la régie micro étaient parfaites pour notre événement retransmis en direct sur nos réseaux. Leur matériel est ultra moderne et leurs tarifs sur devis sont tout à fait justifiés par la qualité de service fournie.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    date: 'Novembre 2025'
  }
];
