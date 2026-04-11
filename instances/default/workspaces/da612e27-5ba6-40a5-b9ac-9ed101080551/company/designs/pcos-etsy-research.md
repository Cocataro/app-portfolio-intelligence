# PCOS Wellness Tracker — Etsy-Refined Design Spec

> Research-driven update combining Etsy marketplace analysis with health app UI best practices.
> Updated: 2026-04-11

---

## Research Summary

### What Sells on Etsy (Key Findings)

**Color trends in top-selling PCOS/health trackers:**
- Lavender and peach are the two dominant demand colors — top sellers offer named colorways in these
- PCOS awareness colors (teal `#00827F` and purple/lavender) carry emotional meaning for buyers
- Cream/off-white bases dominate — never pure white. Warm linen `#FFF8F0` range
- Sage green is a strong secondary accent across wellness products
- Dark mode is an emerging differentiator — sellers offering multiple themes (Pastel/Dark/Earthy/Serene) capture more buyers
- Generic "medical blue" reads cheap and clinical — instant skip for this audience

**What makes listings look premium vs cheap:**
- Premium: Populated dashboards with real-looking data, custom-colored charts, lifestyle device mockups, consistent color across all listing images
- Cheap: Empty templates, default spreadsheet styling, plain white backgrounds, 1-2 photos, generic clip art
- The single highest-ROI visual upgrade: showing the product full of realistic sample data, not empty

**Pricing signals:**
- $8–15 is the sweet spot for interactive Google Sheets health trackers
- $12–18 with premium visuals outperforms $5 budget listings
- Low prices ($3-4) signal low quality in this category

**Critical market insight:**
- Most health trackers on Etsy default to "wellness green" — our warm purple/mauve palette is a genuine differentiator in search thumbnails
- Condition-specific naming (PCOS, PMDD, endometriosis) drastically outperforms generic "health tracker"
- "Share with your doctor" is the most powerful feature callout

### What Works as UI (Health App Analysis)

**From Bearable (best-in-class symptom tracking):**
- 5-state button selectors for severity (none/mild/moderate/severe/unbearable) — NOT sliders. No fine motor precision required
- "Year in Pixels" heatmap — 365-day color-coded grid for instant pattern recognition
- Dark mode is first-class, not an afterthought
- Check-in targets "under 1 minute" — time-boxing cognitive effort

**From Clue (anti-pink period tracking):**
- Dark/neutral background field makes colored status indicators pop dramatically
- 3-color cycle system (red/gray/blue) — restraint over rainbow
- Icon-based toggles: tap to activate, full-color when active, muted when inactive
- Critical lesson: their 2022 redesign broke speed by adding multi-step logging. Never sacrifice speed for visual cleanliness

**From Flo (personalized cycle tracking):**
- Icon-based symptom logging with size+color shift for state (active = larger + saturated)
- Semantic widget system (Insights/History/Trends) creates clear information architecture
- 70-screen onboarding personalizes which symptoms appear — reduces daily friction
- Anti-pattern: home screen content bloat (articles competing with data)

**From Apple Health (data visualization):**
- Color-as-category system — every metric category has a distinct, consistent color
- Card-based summary with sparklines and latest values
- Activity rings (CSS conic-gradient achievable) for progress visualization
- Anti-pattern: data without narrative — lots of numbers, no "how was today?" synthesis

**From Flaredown (chronic illness tracking):**
- Single daily check-in model — one primary action, everything else downstream
- Critical failure: no "bad day" escape hatch. When you've added 30 symptoms and it's a severe pain day, the full check-in becomes a burden
- Lesson for us: ALWAYS provide a 1-tap "bad day" quick log option

---

## Mood Board Description

A warm, quiet space that feels like a supportive friend's journal — not a clinical dashboard, not a generic wellness template. Think: a Sunday morning with a cup of tea and a soft knit blanket. The interface breathes. It doesn't rush. Colors are muted and warm — dusty mauves, soft lavender, touches of rose — never bright or demanding. The typography is gentle but grounded. Every interaction says: "I understand you're tired, you're overwhelmed, and you don't need one more thing that feels like a chore."

On Etsy, this product should look like it was made BY someone who manages PCOS, FOR someone who manages PCOS. Not a developer side project. Not a generic health template with "PCOS" slapped on. The warm purple/mauve palette stands out in a sea of sage-green wellness products — it's our visual signature.

---

## Color Palette

### Light Mode
- **Primary:** `#8B6F8E` — Dusty Mauve (grounded purple, warm undertone, connects to PCOS awareness purple)
- **Primary Light:** `#B89FBA` — Soft Lavender (hover states, selected items, gentle highlights)
- **Primary Dark:** `#6B4F6E` — Deep Plum (active states, pressed buttons, strong emphasis)
- **Background:** `#FAF7F5` — Warm Linen (not pure white — has warmth, reduces eye strain. Matches Etsy best-seller warm-white trend)
- **Surface:** `#FFFFFF` — White (cards, modals, elevated surfaces)
- **Surface Alt:** `#F3EDE8` — Soft Parchment (alternating rows, section breaks)
- **Border:** `#E5DDD6` — Warm Gray (card borders, dividers — warm, not cold)
- **Text Primary:** `#2E2631` — Deep Aubergine (near-black with purple undertone)
- **Text Secondary:** `#6E6175` — Muted Plum (labels, timestamps)
- **Text Muted:** `#9E8FA5` — Dusty Lilac (placeholders, disabled text)
- **Accent Warm:** `#C8907E` — Soft Terracotta (sparingly — CTAs, important badges)
- **Success:** `#7A9E7E` — Sage (positive states, "good day" indicators)
- **Severity None:** `#B89FBA` — Soft Lavender
- **Severity Mild:** `#D4A88C` — Warm Sand
- **Severity Moderate:** `#C8907E` — Soft Terracotta
- **Severity High:** `#A85D5D` — Muted Rose-Red (visible but not alarming)
- **Severity Extreme:** `#8B3A3A` — Deep Brick (unbearable — rare, serious)

### Dark Mode
- **Primary:** `#B89FBA` — Soft Lavender (elevated for contrast on dark backgrounds)
- **Primary Light:** `#D4C1D6` — Pale Lavender
- **Primary Dark:** `#8B6F8E` — Dusty Mauve
- **Background:** `#1A1518` — Deep Plum-Black (warm undertone, not pure black)
- **Surface:** `#252029` — Dark Mauve (cards, elevated surfaces)
- **Surface Alt:** `#302A33` — Muted Plum (section breaks)
- **Border:** `#3D3541` — Warm Dark Gray
- **Text Primary:** `#EDE6F0` — Pale Lilac White
- **Text Secondary:** `#B0A3B8` — Dusty Lavender
- **Text Muted:** `#7A6E82` — Muted Plum
- **Accent Warm:** `#D4A08E` — Light Terracotta
- **Success:** `#8FB893` — Soft Sage
- **Severity None:** `#9B87A0` — Muted Lavender
- **Severity Mild:** `#C8A890` — Warm Sand Light
- **Severity Moderate:** `#D4A08E` — Light Terracotta
- **Severity High:** `#C47474` — Soft Brick
- **Severity Extreme:** `#D45555` — Warm Red (higher contrast for dark backgrounds)

### Why This Palette Works for Etsy

1. **Stands out in search** — most health trackers on Etsy use sage green or clinical blue. Warm purple/mauve is visually distinctive in thumbnail grids
2. **PCOS awareness connection** — purple/teal are PCOS awareness colors. Buyers feel an emotional connection to products that "get" their condition
3. **Warm, not clinical** — cream base + warm accents signal "wellness journal," not "hospital form"
4. **Anti-pink** — avoids the patronizing bright pink that plagues women's health products (Clue's design philosophy validated this)
5. **Theme-ready** — the palette system supports dark mode as a first-class option, matching the multi-theme trend among top Etsy sellers

---

## Typography Notes

- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — system fonts. Clean, human, zero load time
- **Headings:** `font-weight: 600` (semibold, not bold). `letter-spacing: -0.01em` (tighter for warmth)
- **Body:** `font-weight: 400`, `line-height: 1.6`, `font-size: 15px` base (larger than typical 14px — easier on tired eyes/brain fog)
- **Labels/Captions:** `font-weight: 500`, `font-size: 12px`, `letter-spacing: 0.02em`. Uppercase sparingly — section headers only, never buttons
- **Numbers/Data:** `font-variant-numeric: tabular-nums`. Pain scores at `font-weight: 600`
- **Tone:** Sentence case everywhere. No ALL CAPS for emotional content. This is a journal, not a dashboard

---

## Component Style Notes

### Severity Input (Bearable Pattern — NOT Sliders)

Based on Bearable's validated approach, use **5-state button selectors** instead of sliders:
- States: None / Mild / Moderate / Severe / Unbearable
- Implementation: Radio button groups styled as pill buttons via CSS `:checked` + sibling combinators
- Unselected: `background: var(--surface-alt)`, `border: 1.5px solid var(--border)`, `border-radius: 20px`
- Selected: `background: var(--severity-color)` at 15% opacity, `border-color: var(--severity-color)`, slight scale: `transform: scale(1.05)`
- No fine motor precision required — critical for fatigued/brain-fogged users
- Transition: `transition: background-color 200ms ease, transform 150ms ease`

### Quick Log / Bad Day Escape Hatch

Learning from Flaredown's failure — always provide a fast-path:
- Sticky "Quick Log" button that submits a minimal check-in (overall severity + one note)
- On high-pain days, users shouldn't have to scroll through 15 symptom categories
- Visual: subdued but always accessible. Not a hero element, but never hidden

### Buttons
- **Primary:** `background: var(--primary)`, `color: white`, `border-radius: 10px`, `padding: 12px 24px`. Subtle shadow: `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`. Hover: lighten 8%
- **Secondary:** `background: transparent`, `border: 1.5px solid var(--primary-light)`, `color: var(--primary)`. Hover: `background: var(--primary-light)` at 15% opacity
- **Touch targets:** 44px minimum height. Non-negotiable for this audience

### Cards
- `border-radius: 14px`. `border: 1px solid var(--border)`. `padding: 20px`
- Shadow hierarchy (3 levels, Apple Health pattern):
  - Level 0 (inline): no shadow
  - Level 1 (cards): `box-shadow: 0 1px 4px rgba(0,0,0,0.04)`
  - Level 2 (modals): `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`
- Symptom cards: `border-left: 3px solid var(--severity-color)` for at-a-glance scanning
- Cards should feel like paper, not plastic

### Symptom/Mood Selection (Flo Pattern)
- Icon-based toggles or pill-shaped toggles in a flowing wrap layout
- Active: full-color, slightly larger. Inactive: muted, slightly smaller
- Size shift communicates state without requiring color vision
- `border-radius: 20px`, `padding: 8px 16px`
- Flowing wrap layout, not rigid grid — feels organic

### Charts / Data Visualization
- Line charts: `stroke-width: 2.5px`, rounded line joins. Fill area at 8-12% opacity
- Bar charts: `border-radius: 6px 6px 0 0` on tops. Use severity palette, not random colors
- Grid lines: `var(--border)` at 40% opacity — never prominent
- **Year in Pixels** (Bearable pattern): CSS Grid with cells color-coded by severity. Achievable with data attributes and CSS custom properties. No JS needed for static renders
- **Progress rings** (Apple Health pattern): CSS `conic-gradient` for circular indicators
- Always show charts with populated, realistic sample data in mockups — never empty axes

### Spacing Scale
- 8px base, multiples of 8 (8, 16, 24, 32, 40, 48)
- Consistent spacing is the #1 differentiator between "built by a developer" and "designed" — per cross-category Etsy research

---

## Reference Apps/Sites

1. **Bearable** — 5-state symptom selectors (not sliders), Year in Pixels heatmap, dark mode as first-class. Take: the severity input pattern, the way data feels empowering, the sub-1-minute check-in target
2. **Clue** — Anti-pink design philosophy, dark neutral backgrounds that make colored indicators pop, 3-color restraint. Take: the mature color approach, data-first not scrapbook, never infantilize
3. **Flo** — Icon-based symptom logging with size+color state shifts, semantic widgets (Insights/History/Trends). Take: the personalized tracking categories, the icon grid input pattern
4. **Hey Morning (Etsy)** — Top-selling health tracker spreadsheets (2,600+ reviews, $17.50). Offers Pastel/Dark/Earthy/Serene themes. Take: the multi-theme approach, the feature depth, the pricing confidence
5. **FRGLMAMA (Etsy)** — Clean, functional printable symptom trackers (9,900+ reviews, 96,500+ sales). Minimal color, ink-friendly. Take: the proof that clinical minimalism sells at volume when execution is clean

---

## Stable Diffusion Prompts

### Hero Mockup (Etsy Listing Image 1)
Optimized for Etsy thumbnail visibility — must read at small size, show populated data, communicate value in 1-2 seconds.

```
Overhead flat lay, iPad Pro displaying a health tracking dashboard with populated charts and soft purple accent colors, warm afternoon light filtering through sheer curtains, light wood desk surface, small ceramic mug of chamomile tea, dried lavender sprigs, a minimal leather-bound journal, cream linen cloth underneath, dusty mauve and warm cream color palette, lifestyle product photography, shallow depth of field, the screen shows colorful bar charts and symptom data, Canon EOS R5, 35mm lens, natural light, editorial style, photorealistic, 4K, no text overlays
```

### Lifestyle Scene (Etsy Listing Image 2)
Shows the product "in context" — a real person's life, not a sterile studio shot.

```
A woman's hands holding a tablet at a cozy window seat nook, morning light streaming in, wearing a soft oatmeal-colored cardigan, the tablet screen displays a minimal wellness tracker with soft lavender and cream interface showing symptom severity buttons and a small line chart, a potted trailing plant on the windowsill, warm wood shelf with a candle and small books visible in background, a ceramic mug of herbal tea on a round side table, knitted throw blanket over legs, peaceful domestic setting, shot from slightly above and behind, shallow depth of field, warm color temperature 5500K, lifestyle photography, photorealistic, no face visible, intimate comfortable moment, soft natural shadows
```

### Product Mockup Background (Etsy Listing Images 3-7)
Clean background for overlaying actual product screenshots with feature callouts.

```
Minimal flat lay background texture for digital product mockup, soft cream linen fabric with subtle natural wrinkles, a single dried eucalyptus branch placed in lower left corner, small ceramic dish with rose quartz stones in upper right, thin dusty mauve ribbon loosely coiled near edge, warm directional lighting from upper left creating soft shadows, large negative space in center for screen placement, overhead product photography, clean editorial style, muted warm tones matching dusty mauve and cream palette, 4K texture background, no harsh contrasts, no busy patterns, subtle depth
```

### Dark Mode Variant Scene
For listings showing dark mode capability — differentiator in the market.

```
Evening desk scene, laptop displaying a dark-themed health dashboard with soft lavender accent charts on deep plum-black background, single warm desk lamp casting amber glow, dark wood desk surface, a ceramic mug, small potted succulent, minimal and calm atmosphere, the screen is the brightest element showing populated symptom charts with warm purple data points, low-key lifestyle photography, shallow depth of field, photorealistic, moody warm lighting, no text on screen, Canon 50mm f/1.4
```

### Device Comparison / Multi-Device (Shows cross-platform)
```
Clean overhead flat lay of three devices on light marble surface: a laptop, tablet, and smartphone, all displaying the same health tracker interface with dusty mauve accent colors and populated charts, each screen shows a different view of the app, warm natural lighting, minimal styling with a single lavender sprig and small white ceramic bowl, editorial product photography, consistent warm cream and purple color palette across all screens, 4K, sharp focus on screens, photorealistic
```

---

## Etsy Listing Presentation Notes

Based on cross-category research of best-selling digital products:

### Image Sequence Strategy (Use All 10 Slots)
1. **Hero:** Populated dashboard in lifestyle device mockup (the hook — must pass the "blink test" on mobile)
2. **Lifestyle scene:** Product in-context, cozy real-life setting
3. **Tab/feature overview:** All views laid out with labels — communicates scope and depth
4. **Feature deep-dive 1:** Quick Log view with annotated callouts ("Log symptoms in under 60 seconds")
5. **Feature deep-dive 2:** Calendar view with populated data showing patterns
6. **Feature deep-dive 3:** Charts/insights view with callout ("See what triggers your worst days")
7. **Feature deep-dive 4:** Dark mode showcase (differentiator — most competitors don't offer this)
8. **"What's Included" infographic:** Clean branded slide listing all features with checkmarks
9. **Social proof / reviews:** Grid of 5-star review excerpts on branded background
10. **How it works:** 3-step visual (1. Open the file → 2. Log your day → 3. See your patterns)

### Listing Image Design Rules
- **Color consistency:** Every listing image uses the same dusty mauve + cream palette — backgrounds, text, borders. One cohesive visual package
- **Typography in images:** Clean sans-serif (Montserrat or similar), consistent across all slides. Benefit-driven headlines, not feature lists
- **Whitespace:** Generous padding around screenshots. Product never bleeds to edges
- **Drop shadows:** Subtle shadows under product screenshots for floating/elevated look
- **Populated data always:** Never show empty states. Fill every chart, every input, every calendar day with realistic PCOS-relevant sample data

### Premium Price Positioning ($12–18)
- At this price point, the visual must justify the cost before the description does
- Multi-theme support (light + dark) is a proven price-tier differentiator
- "Share with your doctor" framing elevates perceived value above template-tier products
- Feature depth (charts, insights, patterns, calendar) justifies premium pricing
- Bundle option: offer the PCOS tracker alongside a general symptom tracker for $18–22

---

## Anti-Patterns (What to Avoid)

### Color
- **No bright pink.** Patronizing for this audience. Muted mauves and dusty roses only
- **No clinical blue.** Blue = hospital = dismissive doctors = trauma. Stay warm
- **No "wellness green" as primary.** It's the default for every health product on Etsy — we'd disappear in search results. Sage green is fine as a secondary accent (success states)
- **No gradient overload.** One subtle gradient max (chart fill). Flat colors everywhere else
- **No pure white backgrounds.** Always `#FAF7F5` minimum. Pure white feels sterile and reads "template"

### Typography
- **No thin/light font weights.** Brain fog users need weight. Nothing below `font-weight: 400`
- **No tiny text.** 12px absolute minimum, 14-15px for body
- **No ALL CAPS for emotional content.** Sentence case for moods, symptoms, encouragement

### Layout
- **No information overload on first screen.** Quick Log shows 3-5 things max
- **No gamification.** No streaks, points, badges. Missing a day shouldn't feel like failure
- **No smiley face scales.** Infantilizing. Use descriptive words or clean numeric scales (Bearable's 5-state pattern)

### Interactions
- **No sliders for severity.** Tap-based 5-state selectors only (validated by Bearable). Sliders require fine motor precision that fatigued users don't have
- **No mandatory full check-ins.** Always provide the quick-log escape hatch (Flaredown's lesson)
- **No animations that can't be disabled.** Some PCOS medications cause motion sensitivity
- **No celebratory confetti/sounds.** Tracking symptoms is maintenance, not achievement

### Content
- **No "wellness warrior" language.** No toxic positivity
- **No weight-centric framing.** Track if user wants to, never make it the hero metric
- **No fertility assumptions.** Not every PCOS user is trying to conceive

### Etsy-Specific
- **No empty/template screenshots in listings.** The #1 thing that makes a listing look cheap
- **No default spreadsheet styling visible.** All charts must use custom colors matching the palette
- **No inconsistent visual style across listing images.** Every photo must feel like part of one designed set
- **No pricing under $8.** Signals low quality and attracts the wrong buyer
