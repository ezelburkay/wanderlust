// Selection Engine v1 - Main Index

// Export all types
export * from './types';

// Export constants
export * from './constants';

// Export core functions
export * from './core';

// Export main engine
export * from './engine';

// Export mock data for testing
export * from './mock-data';

// Example usage and integration guide
export const SelectionEngineGuide = {
  /**
   * How to integrate with homepage:
   * 
   * 1. Import the engine:
   *    import { buildHomepageSections, MOCK_CITIES } from '@/lib/selection-engine';
   * 
   * 2. Build sections for search-active mode:
   *    const plan = buildHomepageSections(
   *      MOCK_CITIES,
   *      'romantic', // active pill
   *      'food',    // onboarding preference
   *      'summer'   // current season
   *    );
   * 
   * 3. Use sections in homepage components:
   *    plan.sections.map(section => ({
   *      type: section.type,
   *      title: section.title,
   *      subtitle: section.subtitle,
   *      cities: section.cities
   *    }))
   * 
   * 4. For debugging/analytics:
   *    const summary = getSelectionSummary(plan);
   *    console.log('Duplication rate:', summary.duplicationRate);
   */
  
  integrationNotes: {
    homepageStructure: [
      'HeroSection',
      'SearchSection', 
      'PersonalizedDiscoveryFlow (active-lens section)',
      'SeasonalDiscoverySection (seasonal section)',
      'PreferenceSeasonSection (onboarding section)',
      'CityBrowser (explore section)'
    ],
    
    dataFlow: [
      'User clicks pill -> activeLens updates',
      'Engine builds 4 sections with deduplication',
      'Homepage renders sections in order',
      'Each section gets appropriate title/copy',
      'Cities are scored and ranked intelligently'
    ],
    
    fallbackBehavior: [
      'If exact matches are weak -> use adjacency mapping',
      'If still weak -> use editorial expansion',
      'If still weak -> use diverse city selection',
      'Never show empty sections or error states'
    ]
  },
  
  performance: {
    cityCount: '12 mock cities provided',
    scoringComplexity: 'O(n log n) for sorting and selection',
    memoryUsage: 'Lightweight, pure functions',
    scalability: 'Can handle 100+ cities easily'
  },
  
  editorialGuarantees: [
    'No "search results" language',
    'No fallback explanations in UI',
    'Always complete 4-section structure',
    'Premium editorial tone maintained',
    'Smart deduplication prevents repetition'
  ]
} as const;
