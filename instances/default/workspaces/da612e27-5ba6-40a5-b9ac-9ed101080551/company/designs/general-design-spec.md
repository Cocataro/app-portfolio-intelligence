# General Symptom Tracker — Design Spec

> **Design methodology:** Etsy marketplace research first (what sells), real app UI patterns second (what works). The product must look like it belongs among Etsy best sellers from day one.

## Etsy Marketplace Research Findings

### What Sells in General Health/Wellness Trackers on Etsy

**Top-selling product patterns:**
- Health tracker spreadsheets with auto-calculating dashboards (Google Sheets/Excel) — buyers want logging that turns into visual summaries. Interactive dashboards justify $15-25 pricing vs $5-8 for static printables.
- "Medical binder" bundles with daily/weekly/monthly views plus a dashboard overview. Comprehensive bundles outsell single-view products. The "bring to your doctor" angle signals serious utility.
- Wellness planner templates that combine symptom tracking with mood, sleep, meals, and habits. Breadth = perceived value for a general audience.
- Habit tracker + health journal hybrids — the general wellness buyer wants an all-in-one tool, not a condition-specific product.

**Mockup presentation patterns that drive sales:**
- iPad on marble or linen flat lay — the #1 mockup style. Clean desk, one plant, a coffee mug. Gender-neutral styling.
- MacBook screen at slight angle — for spreadsheet products. Shows complexity without clutter.
- Multi-frame carousel: lifestyle mockup first, then product screens, then branded feature-list slide. Top sellers use 5-7 listing images.
- Detail zoom shots showing auto-calculations and charts populating — the "wow, it does that?" moment.
- Cool-toned or true neutral backgrounds — no warm pink/mauve props. Think concrete, marble, light wood, white linen.

**What separates best sellers from the rest:**
- Consistent 2-3 color palette across every listing image and the product itself. One accent color, generous whitespace, cohesive brand identity.
- Product screenshots readable at thumbnail size — large headings, clear color-coded sections, visible chart elements.
- The dashboard "hero shot" — progress rings, summary cards, clean charts. This IS the selling moment for interactive products.
- Rounded corners on all UI elements, soft shadows, intentional spacing. Never sharp-grid-only layouts.
- Branded feature summary slide with clean sans-serif type — signals professional, not amateur.

**Etsy color trends for universal/general products (2025-2026):**
- Sage green is the dominant accent in wellness digital products — gender-neutral, calming, "health" without clinical.
- Warm cream/beige backgrounds replacing pure white as the premium base.
- For GENERAL (non-condition-specific) products: slate blue, muted teal, or sage green as primary accent. Cool tones signal professionalism and universality.
- Top performers use neutral foundations with ONE strong accent. Never rainbow. Never 5+ colors.

### Competing Interactive Dashboard Sellers (Cross-Category Learning)

**Budget tracker spreadsheets (the mockup gold standard):**
- These have the best presentation on Etsy. Bold accent on neutral background — high-contrast data visualizations on calm surfaces. Progress rings over bar charts. Sparklines for trends.
- Key lesson: the dashboard overview is always the hero image. It communicates "this product does something impressive" at thumbnail scale.

**Meal planner / habit tracker templates:**
- Clean category-coded sections with consistent icon language. Universal appeal through functional design, not decoration.
- Feature-list slides with checkmarks and short benefit statements convert browsers to buyers.

## Mood Board Description

A clean, well-lit workspace that feels like a tool designed by someone who actually uses it. Not clinical, not decorative — functional and considered. Think: a modern notebook with a purpose. The interface is organized, breathable, and immediately understandable to anyone regardless of what they're tracking.

The product must photograph as "premium digital tool" not "free template." When shown in Etsy listing mockups, the neutral palette works against any lifestyle background — marble, wood, concrete, linen — without clashing or looking gendered. At thumbnail size, the UI reads as "organized, professional, worth the price."

This is the variant that says: whatever you're going through, this tool takes your data seriously. No assumptions about your condition. No pink. No blue. Just clarity.

## Color Palette

### Light Mode
- **Primary:** `#4A7C8A` — Muted Teal (professional, health-adjacent without being clinical — top-performing neutral accent on Etsy)
- **Primary Light:** `#7AABB8` — Soft Teal (hover states, selected items, gentle highlights)
- **Primary Dark:** `#34606C` — Deep Teal (active states, pressed buttons, strong emphasis)
- **Background:** `#F4F5F7` — Cool Linen (cool-neutral off-white — reads as clean/modern in mockups, not warm/feminine)
- **Surface:** `#FFFFFF` — White (cards, modals, elevated surfaces)
- **Surface Alt:** `#ECEEF1` — Pale Slate (alternating rows, section breaks — gives visual rhythm in screenshots)
- **Border:** `#D8DBE0` — Cool Gray (card borders, dividers — neutral, not warm or cold)
- **Text Primary:** `#1C2024` — Near Black (clean, no color undertone — maximally universal)
- **Text Secondary:** `#5F6B76` — Slate Gray (secondary text, labels, timestamps)
- **Text Muted:** `#8F99A3` — Muted Slate (placeholders, disabled text)
- **Accent Green:** `#4CAF7D` — Health Green (success states, "good day" indicators, positive trends)
- **Accent Amber:** `#D4915E` — Warm Amber (warnings, attention needed, moderate values)
- **Severity Low:** `#7AABB8` — Soft Teal (mild symptoms — continuity with primary)
- **Severity Mid:** `#D4915E` — Warm Amber (moderate symptoms)
- **Severity High:** `#C45B5B` — Muted Red (severe — visible but not alarming)

### Dark Mode
- **Primary:** `#7AABB8` — Soft Teal (elevated for dark-on-dark contrast)
- **Primary Light:** `#9DC5CF` — Pale Teal (hover, selected)
- **Primary Dark:** `#4A7C8A` — Muted Teal (pressed, strong emphasis)
- **Background:** `#141618` — True Dark (cool, near-black — Apple Health-inspired)
- **Surface:** `#1E2124` — Dark Slate (cards, elevated surfaces)
- **Surface Alt:** `#262A2E` — Charcoal (section breaks)
- **Border:** `#34393E` — Dark Gray
- **Text Primary:** `#E8EAED` — Pale Cool White
- **Text Secondary:** `#9AA0A8` — Muted Slate
- **Text Muted:** `#636B74` — Dark Slate
- **Accent Green:** `#5CC08E` — Light Health Green
- **Accent Amber:** `#E0A574` — Light Amber
- **Severity Low:** `#6B9BA8` — Muted Teal
- **Severity Mid:** `#E0A574` — Light Amber
- **Severity High:** `#D47070` — Soft Coral

## Typography Notes

- **Font stack:** System fonts — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Clean, universal, renders well on every device and in screenshots.
- **Headings:** `font-weight: 600` (semibold). Letter-spacing: `-0.01em`. Headings must be large enough to read at Etsy thumbnail size. More structured than PCOS variant — this is a tool, not a journal.
- **Body:** `font-weight: 400`, `line-height: 1.6`, `font-size: 15px` base. Accessible for users with brain fog, fatigue, or vision issues.
- **Labels/Captions:** `font-weight: 500`, `font-size: 12px`, `letter-spacing: 0.02em`, `text-transform: uppercase` for section headers. More structured labeling than condition-specific variants — signals "professional tool."
- **Numbers/Data:** `font-variant-numeric: tabular-nums` for aligned columns. `font-weight: 600` for pain scores and key metrics. Large summary numbers (28-32px) for dashboard cards — the Apple Health pattern.
- **Emotional tone:** Sentence case for content, structured labels for navigation. This variant leans slightly more "organized tool" than "gentle journal."

## Component Style Notes

### Buttons
- **Primary:** `background: var(--primary)`, `color: white`, `border-radius: 8px`, `padding: 12px 24px`. Subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`. Hover: lighten 8%. Slightly less rounded than PCOS variant — more professional.
- **Secondary:** `background: transparent`, `border: 1.5px solid var(--primary-light)`, `color: var(--primary)`.
- **Touch targets:** Minimum 44px height. Accessibility is non-negotiable across all variants.

### Cards
- `border-radius: 12px`. `border: 1px solid var(--border)`. `padding: 20px`. Max `box-shadow: 0 1px 4px rgba(0,0,0,0.04)`. Clean, structured, slightly tighter radius than PCOS (12 vs 14).
- **Summary cards:** Large metric number (28-32px, semibold) with inline sparkline or trend arrow. This is the Apple Health "summary card" pattern — the thumbnail money shot.
- **Category cards:** Left-border accent `border-left: 3px solid var(--category-color)` for scanning. Categories might include: Pain, Energy, Mood, Sleep, Digestion, etc.
- **Dashboard cards:** Slightly larger padding (24px), `var(--surface)` background with subtle border. Charts and progress rings live here.

### Inputs / Sliders
- Pain/symptom sliders: Rounded track `8px` height, thumb `20px`. Gradient from `--severity-low` → `--severity-mid` → `--severity-high`. Number displayed large above slider.
- Discrete severity selection: 5 or 10-point scale as tappable chips. `border-radius: 20px`, `padding: 8px 16px`. Selected: `background: var(--primary-light)`, `border: 1.5px solid var(--primary)`. One-tap input — fast for daily logging.
- Text inputs: `border-radius: 8px`, `border: 1.5px solid var(--border)`, `padding: 12px 16px`. Focus: `border-color: var(--primary)`, `box-shadow: 0 0 0 3px rgba(74,124,138,0.12)`.

### Charts / Data Visualization (Key for Etsy Listing Screenshots)
- **These are the selling point.** Charts must look impressive at thumbnail scale and professional at full size.
- Line charts: `stroke-width: 2.5px`, rounded joins. Area fill at 8% opacity of primary color. Clean, clinical precision without clinical coldness.
- Bar charts: `border-radius: 6px 6px 0 0`. Never sharp rectangles.
- Progress rings / donut charts: Use for overall wellness score, category breakdowns, completion metrics. These photograph beautifully and signal "interactive dashboard" in listings.
- Sparklines in summary cards: small (40x20px), inline with metric numbers. Teal line, no fill. Quick trend indication.
- Color usage: severity palette for symptom data, category-coded accents for different health areas. Every color means something.
- Grid lines: `var(--border)` at 40% opacity. Background, not foreground.

### Navigation
- Bottom tab bar: 5 tabs max. Active = `var(--primary)` icon + label. Inactive = `var(--text-muted)`.
- Active indicator: `2px` line beneath icon (slightly more structured than dot indicator — professional tool aesthetic).

### Category / Symptom Selection
- Pill-shaped toggles: `border-radius: 20px`, `padding: 8px 16px`. Selected: `background: var(--primary-light)`, `border: 1.5px solid var(--primary)`.
- Clean wrap layout with consistent spacing. Organized, not organic — this variant is the structured one.
- Category icons: line-style (not filled), consistent stroke width. Minimal, professional.

## Etsy Listing Design Notes

### How This Product Should Photograph
- The dashboard view is the hero listing image. Show it on an iPad mockup against a clean, neutral lifestyle background — marble, light wood, concrete desk.
- Use 5-7 listing images: (1) Hero dashboard on device, (2) Feature callouts with icons, (3) Quick Log view showing ease of input, (4) Charts/Insights view with trend data, (5) Calendar/timeline view, (6) Dark mode shot, (7) "What's included" branded summary slide.
- Maintain a cohesive visual identity: neutral background, teal accent, clean sans-serif overlay text. NO gendered props (no florals, crystals, candles). Think: coffee cup, clean desk, perhaps a stethoscope or water bottle for health context.
- Product screenshots must show realistic sample data across multiple health categories — not just one type of symptom. Show diversity of use cases.

### Pricing Positioning
- Interactive HTML dashboard with auto-charts → premium tier ($14.99-19.99)
- Position against static PDF trackers ($3-8) by emphasizing: interactive, auto-calculating, works on any device, no app needed, tracks ANY condition.
- The "universal" angle is a selling point: "One tracker for everything — no matter what you're managing."

## Reference Apps/Sites

### Etsy Sellers (What Sells)
1. **Budget tracker spreadsheet sellers** — The gold standard for interactive dashboard mockup presentation on Etsy. Take: dashboard-as-hero-image strategy, progress rings over bar charts, the way neutral colors communicate "professional tool" at thumbnail scale.
2. **Health tracker bundle sellers** — Comprehensive products with daily/weekly/monthly views plus visual dashboard. Take: the bundle mentality (multiple views = perceived value), structured navigation between views, the "medical binder" positioning for doctor visits.
3. **Habit tracker / wellness planner sellers** — Clean, gender-neutral templates with category-coded sections. Take: universal appeal through functional design, how a single accent color on neutral base reads as premium.

### Real Apps (What Works as UI)
4. **Apple Health** — The reference for neutral health UI. Take: cool gray surface (#F2F2F7), category-coded accent colors, large summary numbers with sparklines, card-based layout with generous whitespace.
5. **Bearable** — Best-in-class symptom correlation and data visualization. Take: severity expressed through saturation not hue shifts, the way data feels empowering, customizable categories that adapt to any condition.
6. **Daylio** — Elegant quick-input patterns. Take: the one-tap severity selection (5-point scale), speed of daily logging, how it makes tracking feel effortless rather than burdensome.
7. **Samsung Health** — Warm-neutral approach to universal health tracking. Take: slightly warmer grays than Apple, rounded softer UI elements, how it balances information density with readability.

## Stable Diffusion Prompts

### Hero Mockup (Primary Listing Image)
```
Overhead flat lay of an iPad displaying a clean health tracking dashboard with muted teal and slate gray UI on a light marble desk surface, white ceramic coffee mug, small potted succulent, silver pen, morning natural window light, cool neutral color palette, gender-neutral lifestyle product photography, soft depth of field, clean editorial style, Canon EOS R5, 50mm lens, no text overlays, Etsy listing style product photo, premium digital product mockup
```

### Lifestyle Scene (Secondary Listing Image)
```
Person's hands holding a tablet showing a minimal symptom tracking interface with teal accents on a clean modern desk, morning light, wearing a gray crewneck sweater, laptop partially visible in background, glass of water on desk, concrete desk accessory tray, cool natural daylight, shot from slightly above, shallow depth of field, neutral color temperature, lifestyle photography for Etsy digital product listing, photorealistic, no face visible, gender neutral
```

### Mobile Mockup Background (Device Mockup Scene)
```
Minimal styled flat lay background for digital product mockup, cool white marble surface with subtle gray veining, single eucalyptus sprig in upper right, small white ceramic dish, matte silver pen, cool natural lighting from top left, generous negative space in center for device placement, overhead product photography, clean editorial Etsy listing aesthetic, neutral cool tones, soft natural shadows, professional and gender neutral, 4K resolution
```

## Anti-Patterns (What to Avoid)

### Color
- **No gendered palettes.** No pink, no mauve, no soft purple as primary. This variant must feel universal. Teal/slate is the anchor.
- **No clinical blue.** Medical blue (#0066CC type) reads as hospital software. Our teal is warmer and more approachable.
- **No bright saturated colors.** Everything muted and desaturated. Saturation = cheap on Etsy.
- **No pure white backgrounds.** `#F4F5F7` minimum. Pure white reads as "template" not "designed."
- **No rainbow category coding.** Use a restrained palette — teal primary, green for positive, amber for caution, red for severe. Max 5-6 total colors in the UI.

### Typography
- **No thin/light font weights.** Users may have brain fog, fatigue, vision issues. `font-weight: 400` minimum.
- **No tiny text.** Minimum 12px, prefer 14-15px for body. Must be readable in listing screenshots.
- **No decorative fonts.** System stack only. Script or display fonts would look template-y and unprofessional.

### Layout
- **No information overload on first screen.** Quick Log: 3-5 items max. Progressive disclosure for detail.
- **No gamification.** No streaks, points, badges. Tracking health is maintenance, not a game.
- **No condition-specific assumptions.** The UI must adapt to any health tracking need. No hardcoded "Period" or "Migraine" labels in the template — use generic category names that the user personalizes.
- **No cramped layouts.** 16-24px card padding, 8-12px element spacing. The product must breathe and screenshot well.

### Interactions
- **No animations that can't be disabled.** Many chronic illness users have motion sensitivity.
- **No celebratory animations.** No confetti, no sounds. Symptom tracking is daily maintenance.
- **No social sharing prompts.** Health data is private.

### Content
- **No toxic positivity.** No "wellness warrior," no "you got this!" The tool is neutral, respectful, supportive.
- **No medical advice framing.** This is a tracker, not a diagnostic tool. Language should be observational, not prescriptive.
- **No assumption about user's condition.** Generic category names, customizable labels, no pre-filled symptom lists that assume a specific diagnosis.

### Etsy-Specific Anti-Patterns
- **No "developer side project" aesthetic.** If it looks like a Bootstrap template, redesign. Every pixel must look intentional.
- **No inconsistent spacing.** Etsy buyers judge quality by visual consistency — uneven padding screams amateur.
- **No empty-state screenshots in listings.** Always show the product with realistic, diverse sample data (multiple symptom types).
- **No gendered lifestyle props in mockups.** No florals, crystals, candles, pink accessories. Keep props universal: coffee, water, pen, plant, laptop.
- **No more than 2-3 colors in mockup overlay text.** Branded slides use primary teal + dark text + white background. That's it.
