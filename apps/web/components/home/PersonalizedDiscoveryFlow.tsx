"use client";

import { useMemo } from "react";
import type { CityViewModel, HomepageDiscoveryViewModel } from "../../content";
import { CityCard } from "../city";

interface PersonalizedDiscoveryFlowProps {
  collections: HomepageDiscoveryViewModel[];
  isSearchDriven: boolean;
}

interface DiscoveryFlowSection {
  cities: CityViewModel[];
  label: string;
  layout: "three" | "four";
  slug: string;
  title: string;
}

interface DiscoveryIntro {
  eyebrow: string;
  identity: string;
  text: string;
  title: string;
}
const defaultDiscoverySupport = "Not more options — just a more thoughtful edit of places that match how you want to travel next.";
export function PersonalizedDiscoveryFlow({ collections, isSearchDriven }: PersonalizedDiscoveryFlowProps) {
  
  const discoveryIntro = useMemo(() => {
    if (collections.length > 0) {
      const primaryCollection = collections[0];
      return {
        eyebrow: primaryCollection?.label || "For you",
        identity: "",
        title: primaryCollection?.title || "Cities in focus",
        text: primaryCollection?.subtitle || defaultDiscoverySupport
      };
    }

    // Fallback only if no collections
    return {
      eyebrow: "For you",
      identity: "",
      title: "Cities in focus",
      text: defaultDiscoverySupport
    };
  }, [collections]);

  const sections = useMemo(() => {
    const visibleCollections = isSearchDriven ? collections : collections.slice(0, 1);

    if (visibleCollections.length === 0) {
      return [];
    }

    const sectionCandidates = visibleCollections.map((collection, index) => {
      if (!collection || !collection.cities || !Array.isArray(collection.cities)) {
        console.warn('Invalid collection in discovery content:', collection);
        return null;
      }
      
      return {
        cities: collection.cities.filter(Boolean),
        label: collection.label || `Collection ${index + 1}`,
        layout: index === 0 ? "four" as const : "three" as const,
        slug: collection.slug || `collection-${index}`,
        title: collection.title || "Cities"
      };
    });

    return sectionCandidates.filter((section): section is DiscoveryFlowSection => section !== null);
  }, [collections, isSearchDriven]);

  return (
    <section className="discovery-flow" id="discover">
      <div className="site-shell">
        <div className="discovery-flow__intro">
          <p className="discovery-flow__eyebrow">{discoveryIntro.eyebrow}</p>
          {discoveryIntro.identity && <p className="discovery-flow__intro-identity">{discoveryIntro.identity}</p>}
          <h2 className="discovery-flow__intro-title">{discoveryIntro.title}</h2>
          <p className="discovery-flow__intro-text">{discoveryIntro.text}</p>
        </div>

        {sections.map((section: DiscoveryFlowSection, index: number) => (
          <div className={`discovery-flow-section${index === 0 ? " discovery-flow-section--primary" : ""}`} key={section.slug}>
            {index > 0 ? (
              <div className="discovery-flow-section__heading">
                <p className="discovery-flow-section__label">{section.label}</p>
                <h3 className="discovery-flow-section__title">{section.title}</h3>
              </div>
            ) : null}

            <div className={`discovery-flow-section__grid discovery-flow-section__grid--${section.layout}`}>
              {section.cities.map((city: CityViewModel) => (
                <CityCard
                  key={`${section.slug}-${city.slug}`}
                  badgeText={index === 0 ? null : undefined}
                  city={city}
                  descriptorText={index === 0 ? city.country : undefined}
                  sentenceText={index === 0 ? city.cardSentence : undefined}
                  variant={index === 0 ? "editorial" : "default"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
