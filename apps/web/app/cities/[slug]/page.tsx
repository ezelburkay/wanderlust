<main className="page-main city-page">
<section className="city-hero">
<div className="site-shell city-hero__grid">
<div className="city-hero__media">
<div
           aria-label={city.imageAlt}
           className="city-hero__image"
           role="img"
           style={{
             backgroundImage: `linear-gradient(180deg, rgba(17, 16, 14, 0.08) 0%, rgba(17, 16, 14, 0.24) 100%), url(${city.imageUrl})`,
             backgroundPosition: city.imagePosition,
             backgroundSize: "cover"
           }}
         />
</div>
<div className="city-hero__content">
<Link className="city-back-link" href="/">
           Back to briefings
</Link>
<span className="section-label">{city.country}</span>
<h1 className="city-hero__title">{city.name}</h1>
<p className="city-hero__essence">{city.essence}</p>
</div>
</div>
</section>
   {quickFacts.length > 0 ? (
<section className="quick-facts">
<div className="site-shell quick-facts__grid">
         {quickFacts.map((fact) => (
<article className="quick-fact" key={fact.key}>
<span className="quick-fact__label">{fact.label}</span>
<p className="quick-fact__value">{fact.value}</p>
</article>
         ))}
</div>
</section>
   ) : null}
<section className="city-sections">
<div className="site-shell city-sections__grid">
<div className="city-column">
<section className="content-panel">
<div className="content-panel__heading">
<span className="section-label">Begin here</span>
<h2 className="section-title">Must see</h2>
</div>
<div className="must-see-list">
             {city.mustSeeFirst.map((place, index) => (
<a
                 className={`must-see-item ${index < 2 ? "must-see-item--primary" : ""}`.trim()}
                 href={getMapsUrl(city.name, place.name)}
                 key={place.name}
                 rel="noreferrer"
                 target="_blank"
>
<div>
<h3 className="must-see-item__name">{place.name}</h3>
<p className="must-see-item__descriptor">{place.descriptor}</p>
</div>
<span className="must-see-item__hint">Open in Maps ↗</span>
</a>
             ))}
</div>
</section>
<section className="content-panel">
<div className="content-panel__heading">
<span className="section-label">Keep going</span>
<h2 className="section-title">More places</h2>
</div>
<ul className="place-list">
             {city.places.map((place) => (
<li className="place-list__item" key={place.name}>
<span className="place-list__name">{place.name}</span>
<span className="place-list__descriptor">{place.descriptor}</span>
</li>
             ))}
</ul>
</section>
</div>
<div className="city-column">
<section className="content-panel">
<div className="content-panel__heading">
<span className="section-label">Taste the city</span>
<h2 className="section-title">Food</h2>
</div>
<div className="food-group">
<h3 className="food-group__title">Signature dishes</h3>
<ul className="food-list">
               {city.signatureDishes.map((dish) => (
<li className="food-list__item" key={dish.name}>
<span className="food-list__emoji">{dish.emoji}</span>
<span className="food-list__name">{dish.name}</span>
</li>
               ))}
</ul>
</div>
<div className="food-group">
<h3 className="food-group__title">Worth ordering next</h3>
<ul className="food-list">
               {city.moreToEat.map((dish) => (
<li className="food-list__item" key={dish.name}>
<span className="food-list__emoji">{dish.emoji}</span>
<span className="food-list__name">{dish.name}</span>
</li>
               ))}
</ul>
</div>
<div className="food-group">
<h3 className="food-group__title">Where the rhythm fits</h3>
<ul className="where-to-eat-list">
               {city.whereToEat.map((item) => (
<li className="where-to-eat-list__item" key={item}>
                   {item}
</li>
               ))}
</ul>
</div>
</section>
</div>
</div>
</section>
</main>
</>
