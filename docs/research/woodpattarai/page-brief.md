# Woodwrights reference storefront

- Local routes: `/` and `/woodpattarai` → homepage; `/collections/*` → collection pages; `/pages/*` → store information pages; `/blogs/journal` → journal; `/policies/*` → policy pages; `/account/login` → account placeholder.
- Baseline: Woodwrights, copied before any requested brand or lamp customization.
- Scope: homepage, primary navigation and nested Shop menu, collection destinations, linked information pages, and local route behavior.

## Evidence

- `source-screenshots/source-desktop.png` — reference at 1440 × 1000, first viewport.
- `source-screenshots/source-mobile.png` — reference at 390 × 844, first viewport with the newsletter prompt visible.
- The hero uses one desktop image and a separate mobile crop; its section is 130dvh and its caption stays pinned for the first viewport.

## Page order

1. Full bleed hero with Woodpattarai text wordmark, centered caption, announcement strip, navigation, and delayed newsletter prompt.
2. Collection introduction and “Browse by Space” links beside a portrait upholstery image.
3. “Our approach” with four selectable stories and matching photography.
4. Ebb Bar Stool feature.
5. Oliver Modular Sofa feature and three preset cards.
6. Muted looping workshop/showroom film.
7. Auckland showroom feature and site footer.

## Interactions

- Announcement can be dismissed.
- Shop opens a desktop mega menu; the mobile menu expands the same category groups.
- Shop navigation includes By Type, By Room, featured collections, all seating and table links, and bedroom/storage categories. All links stay on local routes.
- Search and cart open panels. The cart shows an empty state and room collection links.
- Selecting one of the four approach rows updates its copy and photo; arrow keys move between rows.
- Newsletter prompt appears after a short delay, can be dismissed for the session, and both signup forms show a confirmation state.

## Local asset map

Assets and reference filenames are stored under `public/sites/woodpattarai/`:

- `hero-desktop.webp` ← `WW_ObjectsofCraft_005a.png`
- `hero-mobile.webp` ← `WW_ObjectsofCraft_006_22fb60dd-15db-40c1-a0d4-156951c552f2.png`
- `spaces.webp` ← `WW_ObjectsofCraft_003_3f6e1873-9951-4be3-85ef-7c9c692b5a08.png`
- `approach-*.webp` ← the four images used by the source approach carousel
- `approach-warmth.webp` is reused for the Ebb Bar Stool feature
- `oliver-preset-*.webp` ← the three Oliver Sofa preset images
- `collection-feature.webp` ← `WW_ObjectsofCraft_004_68c6a142-8ff4-40a2-805b-8c28e1f5846b.png`
- `showroom-*.webp`, `room-*.webp` ← showroom and collection photography
- `Plantin.woff2` and `MonumentGrotesk.woff2` ← site fonts
- `showroom-film.mp4` ← muted 1080p looping homepage video

## Notes

The source reference is `https://woodwrights.co.nz/`. The homepage photography, fonts, showroom film, and menu destinations have local copies. The route map covers the storefront links. Full product inventory imagery and several destination-page sections still need source-specific capture before this can be called a complete visual clone; apply the requested WOOD PATTARAI brand name across the site. Keep the lamp interaction as a later customization.
