"use client";

import { useState } from "react";
import type { CityEssence } from "../../../../packages/content/schemas/city";

type Category = keyof CityEssence;

const categories: Category[] = ["eat", "walk", "stay", "book"];

const categoryLabels: Record<Category, string> = {
  eat: "Eat",
  walk: "Walk",
  stay: "Stay",
  book: "Book"
};

function getMapsSearchUrl(mapsQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}

interface Props {
  essence: CityEssence;
}

export function CityEssenceAccordion({ essence }: Props) {
  const [open, setOpen] = useState<Category>("eat");

  return (
    <div className="city-essence__categories">
      {categories.map((cat) => (
        <div
          className={`essence-category${open === cat ? " essence-category--open" : ""}`}
          key={cat}
        >
          <button
            aria-expanded={open === cat}
            className="essence-category__header"
            onClick={() => setOpen(cat)}
            type="button"
          >
            <span className="essence-category__title">{categoryLabels[cat]}</span>
            <span className="essence-category__see-all">See all</span>
          </button>

          {open === cat && (
            <ul className="essence-items">
              {essence[cat].map((item) => {
                const href = item.mapsQuery
                  ? getMapsSearchUrl(item.mapsQuery)
                  : item.url;

                return (
                  <li className="essence-item" key={item.title}>
                    {href != null ? (
                      <a
                        className="essence-item__link"
                        href={href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="essence-item__title">{item.title}</span>
                        {item.subtitle != null && (
                          <span className="essence-item__subtitle">{item.subtitle}</span>
                        )}
                      </a>
                    ) : (
                      <div className="essence-item__content">
                        <span className="essence-item__title">{item.title}</span>
                        {item.subtitle != null && (
                          <span className="essence-item__subtitle">{item.subtitle}</span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
