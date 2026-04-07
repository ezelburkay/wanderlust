// Selection Engine v1 - Example Usage Demo

import { 
  buildHomepageSections, 
  getSelectionSummary,
  MOCK_CITIES,
  type PrimaryLens 
} from './index';

/**
 * Demo function showing how to use the selection engine
 */
export function demoSelectionEngine() {
  console.log('=== Wanderlust Selection Engine v1 Demo ===\n');
  
  // Example 1: User has food onboarding, clicks romantic pill
  console.log('1. Food onboarding + Romantic pill selection:');
  const romanticPlan = buildHomepageSections(
    MOCK_CITIES,
    'romantic', // active pill
    'food',    // onboarding preference  
    'summer'   // current season
  );
  
  romanticPlan.sections.forEach((section, index) => {
    console.log(`\nSection ${index + 1}: ${section.type}`);
    console.log(`Title: ${section.title}`);
    console.log(`Cities: ${section.cities.map(c => c.name).join(', ')}`);
  });
  
  const romanticSummary = getSelectionSummary(romanticPlan);
  console.log(`\nSummary: ${romanticSummary.totalCities} cities, ${(romanticSummary.duplicationRate * 100).toFixed(1)}% duplication`);
  
  // Example 2: User has slow onboarding, clicks coastal pill
  console.log('\n\n2. Slow onboarding + Coastal pill selection:');
  const coastalPlan = buildHomepageSections(
    MOCK_CITIES,
    'coastal',
    'slow', 
    'summer'
  );
  
  coastalPlan.sections.forEach((section, index) => {
    console.log(`\nSection ${index + 1}: ${section.type}`);
    console.log(`Title: ${section.title}`);
    console.log(`Cities: ${section.cities.map(c => c.name).join(', ')}`);
  });
  
  const coastalSummary = getSelectionSummary(coastalPlan);
  console.log(`\nSummary: ${coastalSummary.totalCities} cities, ${(coastalSummary.duplicationRate * 100).toFixed(1)}% duplication`);
  
  // Example 3: Weekend pill with weekend onboarding (same lens)
  console.log('\n\n3. Weekend onboarding + Weekend pill selection:');
  const weekendPlan = buildHomepageSections(
    MOCK_CITIES,
    'weekend',
    'weekend',
    'summer'
  );
  
  weekendPlan.sections.forEach((section, index) => {
    console.log(`\nSection ${index + 1}: ${section.type}`);
    console.log(`Title: ${section.title}`);
    console.log(`Cities: ${section.cities.map(c => c.name).join(', ')}`);
  });
  
  const weekendSummary = getSelectionSummary(weekendPlan);
  console.log(`\nSummary: ${weekendSummary.totalCities} cities, ${(weekendSummary.duplicationRate * 100).toFixed(1)}% duplication`);
}

/**
 * Test function for development/debugging
 */
export function testSelectionEngine() {
  const testCases: Array<{
    name: string;
    activeLens: PrimaryLens;
    onboardingLens: PrimaryLens;
  }> = [
    { name: 'Romantic + Food', activeLens: 'romantic', onboardingLens: 'food' },
    { name: 'Food + Romantic', activeLens: 'food', onboardingLens: 'romantic' },
    { name: 'Slow + Coastal', activeLens: 'slow', onboardingLens: 'coastal' },
    { name: 'Summer + Weekend', activeLens: 'summer', onboardingLens: 'weekend' },
    { name: 'Coastal + Slow', activeLens: 'coastal', onboardingLens: 'slow' },
    { name: 'Weekend + Food', activeLens: 'weekend', onboardingLens: 'food' }
  ];
  
  console.log('=== Selection Engine Test Suite ===\n');
  
  testCases.forEach(testCase => {
    console.log(`\n${testCase.name}:`);
    const plan = buildHomepageSections(
      MOCK_CITIES,
      testCase.activeLens,
      testCase.onboardingLens,
      'summer'
    );
    
    const summary = getSelectionSummary(plan);
    
    console.log(`  Active section: ${plan.sections[0].cities.length} cities`);
    console.log(`  Seasonal section: ${plan.sections[1].cities.length} cities`);
    console.log(`  Onboarding section: ${plan.sections[2].cities.length} cities`);
    console.log(`  Explore section: ${plan.sections[3].cities.length} cities`);
    console.log(`  Total: ${summary.totalCities} cities`);
    console.log(`  Duplication: ${(summary.duplicationRate * 100).toFixed(1)}%`);
    
    // Check for empty sections (should never happen)
    const emptySections = plan.sections.filter(s => s.cities.length === 0);
    if (emptySections.length > 0) {
      console.log(`  WARNING: ${emptySections.length} empty sections!`);
    }
    
    // Check for excessive duplication
    if (summary.duplicationRate > 0.3) {
      console.log(`  WARNING: High duplication rate!`);
    }
  });
}

/**
 * Integration example for homepage component
 */
export function homepageIntegrationExample() {
  // This shows how to integrate with a React homepage component
  const integrationCode = `
// In your homepage component:
import { buildHomepageSections, MOCK_CITIES } from '@/lib/selection-engine';

function Homepage({ activePill, onboardingPreference }) {
  const plan = buildHomepageSections(
    MOCK_CITIES,
    activePill,
    onboardingPreference,
    'summer' // or get current season dynamically
  );

  return (
    <>
      <HeroSection />
      <SearchSection activePill={activePill} />
      
      {/* Section 1: Active pill */}
      <PersonalizedDiscoveryFlow 
        cities={plan.sections[0].cities}
        title={plan.sections[0].title}
        subtitle={plan.sections[0].subtitle}
      />
      
      {/* Section 2: Seasonal */}
      <SeasonalDiscoverySection 
        cities={plan.sections[1].cities}
        title={plan.sections[1].title}
        subtitle={plan.sections[1].subtitle}
      />
      
      {/* Section 3: Onboarding */}
      <PreferenceSeasonSection 
        cities={plan.sections[2].cities}
        title={plan.sections[2].title}
        subtitle={plan.sections[2].subtitle}
      />
      
      {/* Section 4: Explore */}
      <CityBrowser cities={plan.sections[3].cities} />
    </>
  );
}
`;

  console.log('Homepage Integration Example:');
  console.log(integrationCode);
}

// Export for easy testing
export const DEMO_FUNCTIONS = {
  demoSelectionEngine,
  testSelectionEngine,
  homepageIntegrationExample
} as const;

