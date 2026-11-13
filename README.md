# ThirtySixStudio — Clone (unofficial)

An unofficial, portfolio-grade recreation of [thirtysixstudio.com](https://thirtysixstudio.com/) — built by Shreekrishna Chinta as a design/engineering exercise. Not affiliated with Thirtysixstudio B.V. All original design, copy, and assets are theirs.

## Stack

- React 18 + Vite 6
- Tailwind CSS v4 (`@import "tailwindcss"` + `@tailwindcss/vite`)
- GSAP + @gsap/react (char/word reveals, marquee, grow-flash transitions)
- Lenis smooth scroll
- Self-contained canvas pepper frame animation (frames hotlink the original studio's CDN — see note)

## Run

```bash
npm install
npm run dev
```

Build with `npm run build`, preview with `npm run preview`.

## Known limitations

- The contact form posts to a relative `sendform.php` (same target as the original site); this repo ships no backend, so submissions will fail gracefully with an error message and a mailto fallback.
- Pepper animation frame URLs (`src/canvasImages.js`) still point at the studio's live CDN. This is borrowed bandwidth and may break or be blocked at any time. Replace with your own renders or local assets for production use.
- No audio: the original's ambient tracks/SFX are proprietary; the custom cursor and silent motion carry the experience.
