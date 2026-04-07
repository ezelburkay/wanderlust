// Selection Engine v1 - Mock Dataset

import type { 
  City, 
  PrimaryLens, 
  SupportingTag, 
  SeasonalTag 
} from './types';

// Mock city dataset with rich editorial metadata
export const MOCK_CITIES: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    imageAlt: 'Paris rooftops and river light at golden hour',
    imagePosition: 'center center',
    
    primaryLenses: ['romantic', 'food'],
    supportingTags: ['elegant', 'historic', 'walkable', 'cafe-heavy', 'art-led'],
    seasonalTags: ['spring', 'summer', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 95,
      food: 88,
      slow: 75,
      summer: 70,
      coastal: 20,
      weekend: 80
    },
    editorialScore: 92,
    uniquenessScore: 85,
    repeatPenaltyWeight: 30,
    
    vibeLine: 'The art of living beautifully',
    cardSentence: 'Where every corner tells a story of romance and refinement.',
    essence: 'Paris embodies the perfect blend of historic grandeur and contemporary romance, offering world-class art, cuisine, and timeless elegance.'
  },
  
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Lazio',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    imageAlt: 'Rome skyline with warm stone architecture',
    imagePosition: 'center center',
    
    primaryLenses: ['romantic', 'slow'],
    supportingTags: ['historic', 'elegant', 'walkable', 'cafe-heavy', 'art-led'],
    seasonalTags: ['spring', 'summer', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 90,
      food: 82,
      slow: 88,
      summer: 75,
      coastal: 15,
      weekend: 78
    },
    editorialScore: 89,
    uniquenessScore: 88,
    repeatPenaltyWeight: 25,
    
    vibeLine: 'Living history at every turn',
    cardSentence: 'Ancient wonders and romantic piazzas create an unforgettable journey through time.',
    essence: 'Rome offers an unparalleled blend of ancient history, romantic atmosphere, and the Italian art of living slowly.'
  },
  
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e8770c46',
    imageAlt: 'Tokyo skyline with Mount Fuji in background',
    imagePosition: 'center center',
    
    primaryLenses: ['food', 'weekend'],
    supportingTags: ['compact', 'stylish', 'hidden-gem', 'local', 'art-led'],
    seasonalTags: ['spring', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 70,
      food: 95,
      slow: 60,
      summer: 75,
      coastal: 40,
      weekend: 92
    },
    editorialScore: 94,
    uniquenessScore: 92,
    repeatPenaltyWeight: 20,
    
    vibeLine: 'Future meets tradition in perfect harmony',
    cardSentence: 'A dazzling metropolis where ancient traditions and cutting-edge innovation create endless discovery.',
    essence: 'Tokyo represents the pinnacle of urban sophistication, offering extraordinary cuisine, innovative design, and a unique blend of modernity and tradition.'
  },
  
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Catalonia',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2650a8c71ea3',
    imageAlt: 'Barcelona beach and city skyline',
    imagePosition: 'center center',
    
    primaryLenses: ['coastal', 'summer'],
    supportingTags: ['stylish', 'walkable', 'art-led', 'cafe-heavy', 'scenic'],
    seasonalTags: ['spring', 'summer', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 75,
      food: 80,
      slow: 70,
      summer: 92,
      coastal: 90,
      weekend: 85
    },
    editorialScore: 87,
    uniquenessScore: 86,
    repeatPenaltyWeight: 25,
    
    vibeLine: 'Mediterranean soul with artistic heart',
    cardSentence: 'Where Gaudí\'s imagination meets Mediterranean beaches in perfect harmony.',
    essence: 'Barcelona combines architectural brilliance, beach culture, and vibrant Mediterranean energy into an unforgettable coastal experience.'
  },
  
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    region: 'Hovedstaden',
    imageUrl: 'https://images.unsplash.com/photo-1518714341404-b83dce5a9e7f',
    imageAlt: 'Copenhagen colorful harbor with boats',
    imagePosition: 'center center',
    
    primaryLenses: ['slow', 'weekend'],
    supportingTags: ['compact', 'stylish', 'walkable', 'cafe-heavy', 'scenic'],
    seasonalTags: ['summer', 'year_round'],
    
    perLensScores: {
      romantic: 72,
      food: 78,
      slow: 90,
      summer: 85,
      coastal: 75,
      weekend: 88
    },
    editorialScore: 85,
    uniquenessScore: 84,
    repeatPenaltyWeight: 22,
    
    vibeLine: 'Nordic design meets hygge living',
    cardSentence: 'Effortlessly cool Copenhagen perfects the art of living well and slowly.',
    essence: 'Copenhagen embodies Scandinavian design excellence, sustainable living, and the gentle art of hygge - creating a perfectly balanced urban experience.'
  },
  
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Lisbon',
    imageUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f',
    imageAlt: 'Lisbon historic tram and colorful buildings',
    imagePosition: 'center center',
    
    primaryLenses: ['romantic', 'weekend'],
    supportingTags: ['historic', 'scenic', 'walkable', 'cafe-heavy', 'local'],
    seasonalTags: ['spring', 'summer', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 85,
      food: 82,
      slow: 78,
      summer: 80,
      coastal: 70,
      weekend: 90
    },
    editorialScore: 83,
    uniquenessScore: 87,
    repeatPenaltyWeight: 24,
    
    vibeLine: 'Seven hills of endless charm',
    cardSentence: 'Historic trams and Fado music create an atmosphere of timeless romance.',
    essence: 'Lisbon offers a perfect blend of old-world romance, stunning hilltop views, and a relaxed pace that captures the heart of every visitor.'
  },
  
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'North Holland',
    imageUrl: 'https://images.unsplash.com/photo-1555400067-3d5b2a0c336f',
    imageAlt: 'Amsterdam canals with bicycles',
    imagePosition: 'center center',
    
    primaryLenses: ['romantic', 'slow'],
    supportingTags: ['scenic', 'walkable', 'art-led', 'historic', 'compact'],
    seasonalTags: ['spring', 'summer', 'year_round'],
    
    perLensScores: {
      romantic: 88,
      food: 75,
      slow: 85,
      summer: 78,
      coastal: 65,
      weekend: 82
    },
    editorialScore: 86,
    uniquenessScore: 83,
    repeatPenaltyWeight: 26,
    
    vibeLine: 'Canals and culture in perfect balance',
    cardSentence: 'Where golden age architecture meets contemporary creativity along peaceful waterways.',
    essence: 'Amsterdam combines romantic canal scenery, world-class art, and a relaxed cycling culture that creates an uniquely European experience.'
  },
  
  {
    id: 'portland',
    name: 'Portland',
    country: 'United States',
    region: 'Oregon',
    imageUrl: 'https://images.unsplash.com/photo-1555423294-1e547c59795d',
    imageAlt: 'Portland skyline with Mount Hood',
    imagePosition: 'center center',
    
    primaryLenses: ['food', 'slow'],
    supportingTags: ['local', 'market', 'walkable', 'hidden-gem', 'low-key'],
    seasonalTags: ['summer', 'year_round'],
    
    perLensScores: {
      romantic: 65,
      food: 92,
      slow: 88,
      summer: 85,
      coastal: 70,
      weekend: 78
    },
    editorialScore: 81,
    uniquenessScore: 89,
    repeatPenaltyWeight: 21,
    
    vibeLine: 'Keep Portland weird and wonderful',
    cardSentence: 'A food lover\'s paradise where creativity and conscience create unforgettable flavors.',
    essence: 'Portland represents the perfect blend of culinary innovation, laid-back living, and environmental consciousness in a stunning Pacific Northwest setting.'
  },
  
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'South Aegean',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
    imageAlt: 'Santorini white buildings and blue domes',
    imagePosition: 'center center',
    
    primaryLenses: ['romantic', 'coastal'],
    supportingTags: ['scenic', 'elegant', 'summer', 'island', 'sun-drenched'],
    seasonalTags: ['summer', 'spring', 'autumn'],
    
    perLensScores: {
      romantic: 98,
      food: 70,
      slow: 75,
      summer: 95,
      coastal: 94,
      weekend: 72
    },
    editorialScore: 91,
    uniquenessScore: 93,
    repeatPenaltyWeight: 28,
    
    vibeLine: 'Where love meets the Aegean Sea',
    cardSentence: 'Iconic blue domes and dramatic sunsets create the ultimate romantic escape.',
    essence: 'Santorini represents the pinnacle of romantic island destinations, offering breathtaking views, luxurious simplicity, and unforgettable Mediterranean sunsets.'
  },
  
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Kansai',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e8770c46',
    imageAlt: 'Kyoto temple with cherry blossoms',
    imagePosition: 'center center',
    
    primaryLenses: ['slow', 'romantic'],
    supportingTags: ['historic', 'art-led', 'scenic', 'elegant', 'walkable'],
    seasonalTags: ['spring', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 85,
      food: 78,
      slow: 95,
      summer: 70,
      coastal: 20,
      weekend: 75
    },
    editorialScore: 93,
    uniquenessScore: 94,
    repeatPenaltyWeight: 23,
    
    vibeLine: 'Ancient traditions in modern harmony',
    cardSentence: 'Where geishas, gardens, and temples create an atmosphere of timeless elegance.',
    essence: 'Kyoto represents the soul of Japan, offering an unparalleled journey through ancient traditions, refined aesthetics, and the art of living deliberately.'
  },
  
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    region: 'Victoria',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    imageAlt: 'Melbourne city skyline at dusk',
    imagePosition: 'center center',
    
    primaryLenses: ['food', 'weekend'],
    supportingTags: ['stylish', 'art-led', 'cafe-heavy', 'culture', 'compact'],
    seasonalTags: ['spring', 'summer', 'autumn', 'year_round'],
    
    perLensScores: {
      romantic: 70,
      food: 90,
      slow: 65,
      summer: 85,
      coastal: 75,
      weekend: 88
    },
    editorialScore: 87,
    uniquenessScore: 85,
    repeatPenaltyWeight: 22,
    
    vibeLine: 'Cultural capital with coffee soul',
    cardSentence: 'Where world-class coffee meets vibrant street art and culinary innovation.',
    essence: 'Melbourne represents Australia\'s cultural powerhouse, offering exceptional coffee, diverse cuisine, and a thriving arts scene in a compact, walkable setting.'
  }
];

// Helper function to get cities by lens for testing
export function getCitiesByLens(lens: PrimaryLens): City[] {
  return MOCK_CITIES
    .filter(city => city.primaryLenses.includes(lens))
    .sort((a, b) => b.perLensScores[lens] - a.perLensScores[lens]);
}

// Helper function to get cities by supporting tag
export function getCitiesByTag(tag: SupportingTag): City[] {
  return MOCK_CITIES
    .filter(city => city.supportingTags.includes(tag))
    .sort((a, b) => b.editorialScore - a.editorialScore);
}

// Helper function to get seasonal cities
export function getSeasonalCities(season: SeasonalTag): City[] {
  return MOCK_CITIES
    .filter(city => city.seasonalTags.includes(season) || city.seasonalTags.includes('year_round'))
    .sort((a, b) => b.editorialScore - a.editorialScore);
}

