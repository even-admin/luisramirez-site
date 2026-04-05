# Website Audit Fixes — Priority Order

**Repo:** `even-admin/luisramirez-site` (branch: main)
**Read WEBSITE-V3-FINAL.md for full context if needed.**

---

## CRITICAL FIXES (do all of these)

### 1. Replace device illustrations with real product images

The current SVG illustrations look generic and AI-generated. They undercut trust on a site about operational precision.

**Mac Mini:** Download the official Mac Mini product image from Apple. Use a clean, high-res photo on white/transparent background. Save to `images/mac-mini.png` (or .webp). If you can't download from Apple, find a real product photo from Unsplash (search "mac mini m4 product photo white background"). The image must look like the ACTUAL Mac Mini M4 — compact square aluminum box with rounded corners, NOT a flat rectangular box.

**MacBook Pro:** Same — real product image, not a line drawing. Search Unsplash for "macbook pro product photo white background" or use Apple's press image.

**Delete the SVG illustrations** and replace `<img>` tags with the real photos. Set proper dimensions, add `loading="lazy"`, and ensure they look sharp on retina (use 2x images if possible).

Update alt text from "technical illustration of Mac Mini" to just "Mac Mini M4" and "MacBook Pro".

### 2. Fix ALL missing Spanish accents

These are wrong:
- "Programacion y Transformacion Digital" → "Programación y Transformación Digital"
- "La Carrera de la IA es un Ciclo" → verify accents
- "Por Que Construimos Diferente" → "Por Qué Construimos Diferente"  
- "Como Construi Mi Sistema Operativo" → "Cómo Construí Mi Sistema Operativo"
- "El Territorio Cambio" → "El Territorio Cambió"

Fix every single Spanish accent in the entire index.html. Search for every Spanish word and verify accents.

### 3. Add tool icons/logos to Dev Stack and Client Ops

The plain text pills look flat. Add SVG icons for each tool. You can use simple-icons (https://simpleicons.org/) or lucide icons.

**Dev Stack** — group into categories with small headers:

Frontend:
- React (icon) · Next.js (icon) · Tailwind (icon) · shadcn/ui (fix casing from "shadcn" to "shadcn/ui")

Backend:
- Python (icon) · Supabase (icon) · PostgreSQL (icon)

Infra:
- GitHub (icon)

**Client Ops:**
- Cal.com (icon or calendar icon) · HubSpot (icon) · Google Workspace (icon or mail icon)

Use 20x20 or 24x24 inline SVG icons next to each name. Keep the pill style but add the icon before the text.

### 4. Make AI Layer, Dev Stack, and Client Ops visually consistent

Right now AI Layer uses letter badges in cards, Dev Stack uses plain pills, Client Ops uses plain pills. Three different visual systems.

**Fix:** Use the same card style for all three sections. Each tool gets:
- Icon/logo (small, inline)
- Name
- One-line role description (muted text)

The AI Layer cards (Perplexity, Claude, Paperclip) can stay larger since they're the primary tools. Dev Stack and Client Ops become a grid of smaller cards with the same border/radius/hover treatment.

**Fix Paperclip badge:** Currently shows "H" for "The HQ." Change to "P" with a note, or just use the word "Paperclip" without a letter badge to avoid confusion with Perplexity's "P".

### 5. Fix language consistency

The site hero/about are in English. The Writing section and Newsletter are in Spanish. This is jarring without context.

**Fix for Writing section:** Add a small muted line above the article list:
"I write in Spanish about AI, technology, and business."

**Fix for Newsletter section:** Change to bilingual or English:
"AI, technology, and business insights. No spam. Every two weeks."
OR keep Spanish but add: "(Newsletter in Spanish)" as a muted note.

### 6. Standardize location format

Currently three formats: "MER, MX" (hero), "Office, Merida" (Mac Mini), "Merida, Yucatan, Mexico" (footer).

**Fix:** Use "Mérida, MX" in the hero coordinates line. Use "Mérida" (with accent) everywhere else. Footer: "Mérida, Yucatán, México" (all proper accents).

---

## NICE-TO-HAVE IMPROVEMENTS (do if time allows)

### 7. Add proof to "Replaces X" claims

After each "Replaces: X engineers" line, add a small muted supporting detail:

- Mac Mini "Replaces: 1 DevOps engineer" → add: "24/7 uptime, zero infrastructure tickets"
- MacBook Pro "Replaces: 2 frontend developers" → add: "12-15 deploys/week with Claude Code"

This turns bold claims into grounded statements.

### 8. Expand Work cards slightly

Each work card currently has one sentence. Add one line of proof or outcome:

- EVEN: "Fractional CTO as a Service. Active retainers in healthcare and retail."
- fold.mx: "Technology and AI media. Covering LATAM's real tech impact."
- Dr. Ramírez: "Patient-centric digital ecosystem. Automated booking, follow-ups, and reviews."

### 9. Footer credit

Change "built with claude code" to something less prominent:
"Mérida, Yucatán, México" as the main footer text.
"Source on GitHub" as a small link (linking to the repo).
Remove or move "built with claude code" to a `<!-- comment -->` or a colophon.

### 10. Hero whitespace

The hero takes a full viewport with a lot of empty space above the name. Reduce top padding by ~20%. The clock and content should start at roughly 30vh from top, not 40-50vh.

---

## DO NOT CHANGE

- The GSAP animations and scroll behavior — they work
- The dark mode toggle — it works
- The coordinate lottery animation — it works  
- The live clock — it works
- The section label positioning — it works
- The overall structure and section order — it works
- base.css, CNAME, or any article HTML files

---

## Commit

`fix: audit pass — real images, accents, tool icons, language consistency, visual alignment`
