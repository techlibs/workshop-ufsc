// Beach data for Florianópolis (Floripa)

export interface Beach {
  id: string;
  name: string;
  region: string; // Norte, Sul, Leste, etc
  description: string;
  characteristics: {
    surfing: boolean;
    surfQuality: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'pro';
    waves: string;
    chilling: boolean;
    familyFriendly: boolean;
    infrastructure: 'basic' | 'moderate' | 'excellent';
    crowded: 'low' | 'moderate' | 'high';
    waterQuality: 'poor' | 'good' | 'excellent';
  };
  activities: string[];
  bestFor: string[];
  access: string;
  highlights: string[];
}

export const floripaBeaches: Beach[] = [
  // NORTE (North)
  {
    id: 'jurere-internacional',
    name: 'Jurerê Internacional',
    region: 'Norte',
    description: 'Upscale beach known for luxury resorts, beach clubs, and calm waters. Perfect for relaxing in style.',
    characteristics: {
      surfing: false,
      surfQuality: 'none',
      waves: 'Very calm, almost no waves',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'excellent',
      crowded: 'high',
      waterQuality: 'excellent'
    },
    activities: ['Beach clubs', 'Stand-up paddle', 'Jet ski', 'Fine dining', 'Shopping'],
    bestFor: ['Luxury relaxation', 'Families', 'Social scene', 'Calm water activities'],
    access: 'Easy - Paved roads, parking available',
    highlights: ['P12 Beach Club', 'Calm waters', 'High-end restaurants', 'Celebrity spotting']
  },
  {
    id: 'canasvieiras',
    name: 'Canasvieiras',
    region: 'Norte',
    description: 'Popular tourist beach with warm, calm waters and extensive infrastructure.',
    characteristics: {
      surfing: false,
      surfQuality: 'none',
      waves: 'Very calm',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'excellent',
      crowded: 'high',
      waterQuality: 'good'
    },
    activities: ['Swimming', 'Beach sports', 'Boat tours', 'Dining'],
    bestFor: ['Families', 'Tourists', 'Calm swimming'],
    access: 'Easy - Main roads, lots of parking',
    highlights: ['Warm water', 'Tourist infrastructure', 'Boat trips to nearby islands']
  },
  {
    id: 'praia-brava',
    name: 'Praia Brava',
    region: 'Norte',
    description: 'Modern beach with strong waves, popular with surfers and young crowd.',
    characteristics: {
      surfing: true,
      surfQuality: 'intermediate',
      waves: 'Strong and consistent',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'excellent',
      crowded: 'moderate',
      waterQuality: 'good'
    },
    activities: ['Surfing', 'Beach volleyball', 'Bars and restaurants', 'Nightlife'],
    bestFor: ['Intermediate surfers', 'Young crowd', 'Beach sports'],
    access: 'Easy - Well-developed area',
    highlights: ['Consistent surf', 'Modern buildings', 'Vibrant atmosphere']
  },

  // SUL (South)
  {
    id: 'campeche',
    name: 'Praia do Campeche',
    region: 'Sul',
    description: 'Long beach with excellent waves for surfing and pristine white sand.',
    characteristics: {
      surfing: true,
      surfQuality: 'advanced',
      waves: 'Powerful and consistent, can be heavy',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'moderate',
      crowded: 'moderate',
      waterQuality: 'excellent'
    },
    activities: ['Surfing', 'Kitesurfing', 'Beach walks', 'Sand sports'],
    bestFor: ['Advanced surfers', 'Kitesurfers', 'Long walks'],
    access: 'Easy - Main road access',
    highlights: ['Quality surf breaks', 'Ilha do Campeche nearby', 'Wide beach', 'Beautiful sunsets']
  },
  {
    id: 'armacao',
    name: 'Armação',
    region: 'Sul',
    description: 'Traditional fishing village with good beginner surf and charming atmosphere.',
    characteristics: {
      surfing: true,
      surfQuality: 'beginner',
      waves: 'Gentle, good for learning',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'moderate',
      crowded: 'low',
      waterQuality: 'good'
    },
    activities: ['Beginner surfing', 'Fishing', 'Local seafood', 'Church visits'],
    bestFor: ['Surf learners', 'Authentic experience', 'Seafood lovers'],
    access: 'Moderate - Some narrow roads',
    highlights: ['Surf schools', 'Igreja Sant\'Ana', 'Fresh fish', 'Local vibe']
  },
  {
    id: 'matadeiro',
    name: 'Praia do Matadeiro',
    region: 'Sul',
    description: 'Secluded beach accessed by trail, perfect for nature lovers and intermediate surfers.',
    characteristics: {
      surfing: true,
      surfQuality: 'intermediate',
      waves: 'Consistent, medium size',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'basic',
      crowded: 'low',
      waterQuality: 'excellent'
    },
    activities: ['Surfing', 'Hiking', 'Nature watching', 'Photography'],
    bestFor: ['Adventure seekers', 'Intermediate surfers', 'Nature lovers'],
    access: 'Difficult - Trail access only (20 min walk)',
    highlights: ['Pristine nature', 'Uncrowded', 'Quality waves', 'Trail through Atlantic Forest']
  },

  // LESTE (East)
  {
    id: 'joaquina',
    name: 'Praia da Joaquina',
    region: 'Leste',
    description: 'Famous surf beach with professional competitions and sand dunes for sandboarding.',
    characteristics: {
      surfing: true,
      surfQuality: 'pro',
      waves: 'Powerful, world-class waves',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'excellent',
      crowded: 'high',
      waterQuality: 'excellent'
    },
    activities: ['Professional surfing', 'Sandboarding', 'Beach sports', 'Competitions'],
    bestFor: ['Expert surfers', 'Surf competitions', 'Sandboarding', 'Sports enthusiasts'],
    access: 'Easy - Main road, large parking',
    highlights: ['WCT surf competitions', 'Sand dunes', 'Surf culture', 'Strong waves']
  },
  {
    id: 'mole',
    name: 'Praia Mole',
    region: 'Leste',
    description: 'Trendy beach popular with young crowd, good waves and liberal atmosphere.',
    characteristics: {
      surfing: true,
      surfQuality: 'intermediate',
      waves: 'Good quality, consistent',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'moderate',
      crowded: 'high',
      waterQuality: 'excellent'
    },
    activities: ['Surfing', 'Beach bars', 'Social scene', 'Paragliding landing'],
    bestFor: ['Young crowd', 'LGBTQ+ friendly', 'Intermediate surfers', 'Party atmosphere'],
    access: 'Moderate - Limited parking',
    highlights: ['Liberal vibe', 'Bar do Deca', 'Beautiful people', 'Paragliders landing']
  },
  {
    id: 'galheta',
    name: 'Praia da Galheta',
    region: 'Leste',
    description: 'Naturist beach accessed by trail, pristine and undeveloped.',
    characteristics: {
      surfing: true,
      surfQuality: 'intermediate',
      waves: 'Variable, can be good',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'basic',
      crowded: 'low',
      waterQuality: 'excellent'
    },
    activities: ['Naturism', 'Surfing', 'Hiking', 'Nature appreciation'],
    bestFor: ['Naturists', 'Privacy seekers', 'Nature lovers'],
    access: 'Difficult - Trail access only',
    highlights: ['Clothing optional', 'Pristine nature', 'Privacy', 'Beautiful scenery']
  },
  {
    id: 'barra-da-lagoa',
    name: 'Barra da Lagoa',
    region: 'Leste',
    description: 'Fishing village with canal, good restaurants and nearby surf breaks.',
    characteristics: {
      surfing: true,
      surfQuality: 'beginner',
      waves: 'Small to medium, protected',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'moderate',
      crowded: 'moderate',
      waterQuality: 'good'
    },
    activities: ['Canal swimming', 'Surfing', 'Fishing', 'Seafood dining', 'Boat trips'],
    bestFor: ['Families', 'Beginner surfers', 'Seafood lovers', 'Authentic experience'],
    access: 'Easy - Good roads',
    highlights: ['Canal for safe swimming', 'Fishing boats', 'Fresh seafood', 'Local culture']
  },
  {
    id: 'mocambique',
    name: 'Praia do Moçambique',
    region: 'Leste',
    description: 'Longest beach in Floripa (13km), wild and undeveloped with strong waves.',
    characteristics: {
      surfing: true,
      surfQuality: 'advanced',
      waves: 'Powerful and unpredictable',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'basic',
      crowded: 'low',
      waterQuality: 'excellent'
    },
    activities: ['Surfing', 'Long walks', '4x4 driving', 'Wilderness experience'],
    bestFor: ['Adventure seekers', 'Experienced surfers', 'Solitude', 'Nature photographers'],
    access: 'Difficult - Dirt roads, 4x4 recommended',
    highlights: ['13km of pristine beach', 'Wild nature', 'Uncrowded', 'Strong currents']
  },

  // OESTE (West - Baía Norte)
  {
    id: 'santo-antonio-de-lisboa',
    name: 'Santo Antônio de Lisboa',
    region: 'Oeste',
    description: 'Historic district with calm bay waters, no waves but great for sunset watching.',
    characteristics: {
      surfing: false,
      surfQuality: 'none',
      waves: 'No waves - bay water',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'moderate',
      crowded: 'low',
      waterQuality: 'good'
    },
    activities: ['Sunset watching', 'Seafood dining', 'Historic walk', 'Craft shopping'],
    bestFor: ['Romantic dinners', 'Sunset views', 'Azorean culture', 'Calm atmosphere'],
    access: 'Easy - Paved roads',
    highlights: ['Best sunsets', 'Azorean architecture', 'Oyster restaurants', 'Craft fair']
  },

  // SPECIAL MENTIONS
  {
    id: 'lagoinha-do-leste',
    name: 'Lagoinha do Leste',
    region: 'Sul',
    description: 'Remote paradise beach accessed only by hiking trail, perfect waves and natural beauty.',
    characteristics: {
      surfing: true,
      surfQuality: 'advanced',
      waves: 'Perfect when working, remote location',
      chilling: true,
      familyFriendly: false,
      infrastructure: 'basic',
      crowded: 'low',
      waterQuality: 'excellent'
    },
    activities: ['Hiking', 'Surfing', 'Camping', 'Photography', 'Swimming in lagoon'],
    bestFor: ['Adventure', 'Perfect waves', 'Pristine nature', 'Escape crowds'],
    access: 'Very difficult - 50min to 2hr hike required',
    highlights: ['Untouched paradise', 'Freshwater lagoon', 'Perfect waves', 'Wildlife']
  },
  {
    id: 'santinho',
    name: 'Praia do Santinho',
    region: 'Norte',
    description: 'Beach with archaeological sites and good surf, mix of nature and history.',
    characteristics: {
      surfing: true,
      surfQuality: 'intermediate',
      waves: 'Consistent, good shape',
      chilling: true,
      familyFriendly: true,
      infrastructure: 'moderate',
      crowded: 'low',
      waterQuality: 'excellent'
    },
    activities: ['Surfing', 'Rock inscriptions viewing', 'Resort amenities', 'Nature walks'],
    bestFor: ['Intermediate surfers', 'History buffs', 'Resort stay', 'Quiet beach time'],
    access: 'Moderate - Some unpaved roads',
    highlights: ['Ancient rock inscriptions', 'Resort', 'Consistent surf', 'Less crowded']
  }
];

// Helper functions
export function getBeachesBySurfQuality(quality: Beach['characteristics']['surfQuality']): Beach[] {
  return floripaBeaches.filter(beach => beach.characteristics.surfQuality === quality);
}

export function getBeachesForActivity(activity: 'surfing' | 'chilling'): Beach[] {
  return floripaBeaches.filter(beach => 
    activity === 'surfing' ? beach.characteristics.surfing : beach.characteristics.chilling
  );
}

export function getBeachesByRegion(region: string): Beach[] {
  return floripaBeaches.filter(beach => beach.region.toLowerCase() === region.toLowerCase());
}

export function searchBeaches(query: string): Beach[] {
  const lowerQuery = query.toLowerCase();
  return floripaBeaches.filter(beach => 
    beach.name.toLowerCase().includes(lowerQuery) ||
    beach.description.toLowerCase().includes(lowerQuery) ||
    beach.activities.some(activity => activity.toLowerCase().includes(lowerQuery)) ||
    beach.bestFor.some(use => use.toLowerCase().includes(lowerQuery)) ||
    beach.highlights.some(highlight => highlight.toLowerCase().includes(lowerQuery))
  );
}
