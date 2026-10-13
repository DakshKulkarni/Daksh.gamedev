# Daksh Kulkarni — cinematic game & XR portfolio

A complete redesign using a custom Three.js portal scene, GSAP ScrollTrigger choreography with a CSS sticky gallery, and Lenis smooth scrolling. Content reflects the supplied October 2026 resume. It preserves the original project links and uses optimized copies of the original screenshots.

## Preview

Run `npm run dev`, then open http://127.0.0.1:4173. No dependency installation is necessary; libraries and fonts are hosted locally. Serve over HTTP so the Three.js ES modules can load.

## Validate and deploy

Run `npm run check` and `npm run build`. Upload the **contents** of `dist/` into Hostinger's `public_html/` directory for `dakshkulkarni.in`. `index.html` must sit directly in `public_html`, alongside `assets/`, `vendor/`, `style.css`, `App.js`, and `scene.js`.

The site is static and needs no Node server or dependency installation on Hostinger. Commit the source files and updated resume; `dist/` and `output/` are generated and ignored by Git. The updated downloadable resume is `assets/daksh-kulkarni-resume.pdf`.

For a ZIP upload, extract `output/daksh-portfolio-hostinger.zip` directly into `public_html/`. This working copy does not change the live website until you upload it.

The existing `netlify.toml` remains available for Netlify deployments.

## Editing

- `index.html`: main page content and screenshots
- `style.css`: design, responsive layouts, and motion fallbacks
- `App.js`: project details, navigation, filters, accessibility, and scroll choreography
- `scene.js`: original procedural portal, terrain, particles, and camera movement
- `assets/daksh-kulkarni-resume.pdf`: current resume download

Desktop users get a CSS sticky, scroll-driven project gallery when the viewport has enough height. Phones, tablets, and short desktop windows use a project grid. The hero uses a CSS sticky portal journey on larger viewports: scrolling centers the portal, moves the camera through it, and advances into projects. Smaller windows and reduced-motion preferences use a normal hero. The design uses ink blue, acid yellow, cobalt, and white, with 18–20px body copy and concise project descriptions. The motion switch saves the visitor's preference, and the site respects `prefers-reduced-motion`. WebGL has a CSS fallback. All content remains accessible if animation libraries fail to load.
