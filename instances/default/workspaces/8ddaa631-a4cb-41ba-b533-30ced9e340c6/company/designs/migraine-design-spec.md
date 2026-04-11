# Migraine & Headache Tracker — Design Spec

> **Design methodology:** Etsy marketplace research first (what sells), real app UI patterns second (what works). Dark mode is PRIMARY — this product is opened during migraine attacks when light hurts.

## Etsy Marketplace Research Findings

### What Sells in Migraine/Headache Trackers on Etsy

**Top-selling product patterns:**
- Printable PDFs dominate (10k+ reviews on top listings). Multi-page bundles with daily/monthly/yearly views plus doctor-visit summary sheets outsell single-page products by wide margins.
- Google Sheets dashboards with auto-calculating graphs and monthly comparisons are the premium tier — data-driven buyers want trend analysis, not just daily logging.
- GoodNotes/Notability 365-day hyperlinked journals (775+ pages, 13,000+ links) command the highest prices ($12-23).
- Editable Canva templates with multiple cover designs and commercial-use licensing are a growing tier.

**Color palettes that sell:**
- **Soft purple/lavender** is THE signature color for migraine trackers — aligns with migraine awareness ribbon color. Nearly universal across top sellers.
- Muted pastels (dusty blue, sage green, soft pink) appear alongside purple.
- Cool grey/monochrome "printer-friendly" versions offered as alternates.
- Warm tangerine/coral used as a differentiator by one top seller ("Chic Tangerine" theme).
- **Critical gap: No dark-themed migraine trackers exist on Etsy.** This is our opportunity — a dark product for a photosensitive audience fills a genuine market gap.

**Mockup presentation patterns:**
- Flat-lay paper mockups on clean desk surfaces (white or light wood) with pen, coffee, plant.
- iPad/tablet on desk with Apple Pencil for digital journal products.
- Multi-page spread (3-5 pages fanned/stacked) to show product scope — critical for buyer confidence.
- Feature callout slides (7-10 listing images): after hero mockup, infographic-style slides highlighting specific features.
- Filled-in example pages alongside blank pages to show how the tracker works in practice.

**What separates top sellers (3,500-10,000+ reviews):**
- Comprehensiveness: daily + monthly + yearly + medication log + doctor visit prep — all in one bundle.
- Doctor-visit integration: summary sheets designed to bring to appointments. Buyers explicitly praise this in reviews.
- Multiple size options (US Letter + A4 + A5) in one download.
- Multiple color themes (3+) in one listing multiply perceived value.
- Educational content: migraine introduction pages, infographic on 4 stages of migraine, management tips.

**Key features buyers care about (ranked by frequency):**
1. Pain severity scale (1-10 or visual)
2. Trigger identification (food, weather, stress, sleep, hormones, screen time, caffeine)
3. Symptom checklist (nausea, aura, light/sound sensitivity, visual disturbances)
4. Medication & supplement log (dose, time, effectiveness)
5. Duration tracking (start time, end time, total hours)
6. Pain location marking (head diagram)
7. Monthly/yearly overview calendar (traffic light system: green/yellow/red)
8. Weather correlation (barometric pressure, temperature, humidity)
9. Sleep tracking (hours, quality)
10. Doctor visit summary pages
11. Migraine phase tracking (prodrome, aura, headache, postdrome)
12. Menstrual cycle correlation

### Competing Interactive Dashboard Sellers (Cross-Category)

- Dashboard-as-hero-image strategy drives clicks — the product must look impressive and functional at thumbnail size.
- Progress bars with rounded ends, donut charts, and color-coded categories signal "premium interactive" vs "static PDF."
- Web-based tools (accessed via link) are emerging as premium — our HTML approach fits perfectly.
- The interactive dashboard justifies premium pricing ($15-25 vs $3-8 for static printables).

## Audience

Chronic migraine sufferers. They open this tracker DURING a migraine — when light hurts, thinking is hard, and every tap needs to count. Many have comorbid conditions (anxiety, depression, chronic fatigue). They've been dismissed by doctors. They need data to advocate for themselves.

**Who they are:**
- 75% female, ages 25-50
- Juggling work/family while managing invisible chronic illness
- Experienced with tracking (many have tried other apps and been frustrated)
- Light-sensitive (photophobia), sound-sensitive, cognitively impaired during attacks
- Want to see patterns, share data with doctors, feel in control of something

**When they use it:**
- During active attacks (dark mode, minimal interaction, large targets)
- Between attacks for logging and analysis (can tolerate more detail)
- Before doctor appointments (need clean summaries)

## Mood

A dimmed room at 2 AM. The phone screen is the only light, and it doesn't hurt. The interface is dark and still — like a quiet companion that asks simple questions and remembers everything. No urgency. No brightness. No demands. Just: "What hurts? How much? What helped?" and silence.

This is not a wellness app. This is a survival tool wrapped in calm.

## Color Palette

### Dark Mode (PRIMARY — Default)

This is NOT an afterthought dark mode. This is the primary design. The light mode is the alternate.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg-primary` | `#141518` | Main canvas. Not pure black — avoids halation. |
| Surface | `--color-bg-secondary` | `#1C1D22` | Cards, panels, elevated surfaces. |
| Surface raised | `--color-bg-tertiary` | `#25262C` | Modals, dropdowns, hover states. |
| Border | `--color-border` | `#2E3038` | Subtle separators. Nearly invisible. |
| Border accent | `--color-border-accent` | `#3D3F4A` | Active states, focused inputs. |
| Text primary | `--color-text-primary` | `#D4D5DB` | Body text. Not pure white — reduces glare. |
| Text secondary | `--color-text-secondary` | `#8B8D98` | Labels, captions, metadata. |
| Text muted | `--color-text-muted` | `#5C5E6A` | Placeholders, disabled states. |
| Accent primary | `--color-accent` | `#6B9E7D` | Muted sage green. Scientifically least aggravating wavelength for migraine (Harvard research, ~525nm). |
| Accent hover | `--color-accent-hover` | `#7DB38E` | Interactive hover. |
| Accent subtle | `--color-accent-subtle` | `#1A2B21` | Green tint backgrounds for selected chips. |
| Purple | `--color-purple` | `#9B8EC4` | Migraine awareness color. Used for branding, not UI chrome. |
| Purple subtle | `--color-purple-subtle` | `#1F1C2B` | Purple-tinted card backgrounds. |
| Severity low | `--color-severity-low` | `#6B9E7D` | Pain 1-3. Sage green. |
| Severity medium | `--color-severity-med` | `#C4A86B` | Pain 4-6. Muted amber. |
| Severity high | `--color-severity-high` | `#C47B6B` | Pain 7-9. Dusty terracotta. |
| Severity critical | `--color-severity-crit` | `#B85C5C` | Pain 10. Muted red. Not bright — still calm. |
| Chart line | `--color-chart-line` | `#6B9E7D` | Primary data line. |
| Chart fill | `--color-chart-fill` | `rgba(107, 158, 125, 0.12)` | Area fill under chart lines. |
| Success | `--color-success` | `#5C9E6B` | Positive states. |
| Warning | `--color-warning` | `#C4A86B` | Caution states. |
| Error | `--color-error` | `#B85C5C` | Error states. Not alarming. |

### Light Mode (Alternate)

For between-attack use, doctor appointment sharing, and users who prefer light interfaces.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg-primary` | `#F5F4F2` | Warm off-white. Not pure white. |
| Surface | `--color-bg-secondary` | `#ECEAE7` | Cards, panels. Warm cream. |
| Surface raised | `--color-bg-tertiary` | `#E3E1DD` | Elevated surfaces. |
| Border | `--color-border` | `#D5D2CC` | Warm gray separators. |
| Border accent | `--color-border-accent` | `#B8B4AD` | Active/focused states. |
| Text primary | `--color-text-primary` | `#2C2D30` | Near-black body text. |
| Text secondary | `--color-text-secondary` | `#6B6D75` | Labels, captions. |
| Text muted | `--color-text-muted` | `#9B9DA5` | Placeholders. |
| Accent primary | `--color-accent` | `#4A7A5C` | Deeper sage green. |
| Accent hover | `--color-accent-hover` | `#3D6A4E` | Interactive hover. |
| Accent subtle | `--color-accent-subtle` | `#E8F0EB` | Green tint backgrounds. |
| Purple | `--color-purple` | `#7B6EA8` | Deeper purple for light backgrounds. |
| Purple subtle | `--color-purple-subtle` | `#EEEAF5` | Purple tint backgrounds. |
| Severity low | `--color-severity-low` | `#4A7A5C` | Pain 1-3. |
| Severity medium | `--color-severity-med` | `#A88A4A` | Pain 4-6. |
| Severity high | `--color-severity-high` | `#A8634A` | Pain 7-9. |
| Severity critical | `--color-severity-crit` | `#994A4A` | Pain 10. |
| Chart line | `--color-chart-line` | `#4A7A5C` | Primary data line. |
| Chart fill | `--color-chart-fill` | `rgba(74, 122, 92, 0.10)` | Area fill under chart lines. |

## Typography

```css
/* System font stack — no external font loading. Fast, accessible, native feel. */
--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-family-mono: 'SF Mono', 'Cascadia Mono', 'Consolas', monospace;

/* Sizes — generous for cognitive fog and screen reading during attacks */
--font-size-xs: 0.75rem;    /* 12px — timestamps, fine print only */
--font-size-sm: 0.8125rem;  /* 13px — metadata, captions */
--font-size-base: 0.9375rem; /* 15px — body text, larger than typical for readability */
--font-size-lg: 1.125rem;   /* 18px — section headers, card titles */
--font-size-xl: 1.375rem;   /* 22px — page titles */
--font-size-2xl: 1.75rem;   /* 28px — hero numbers (pain level, streak count) */

/* Weights — never thin. Minimum 400 for body, 500 for emphasis. */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Line heights — generous spacing prevents text from blending in dark mode */
--line-height-tight: 1.3;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;

/* Letter spacing — slightly looser than default for dark backgrounds */
--letter-spacing-normal: 0.01em;
--letter-spacing-wide: 0.03em;   /* Used for small labels and metadata */
```

**Typography rules:**
- Never use font-weight below 400. Thin text breaks down on dark backgrounds.
- Body text is 15px, not the standard 14px. Cognitive fog demands larger text.
- All caps ONLY for tiny labels (xs size with wide letter-spacing). Never for headings or emotional content.
- Generous line-height (1.6 for body) prevents dense text blocks.
- Monospace font for numbers, timestamps, and data values — aids scanning.

## Component Notes

### Pain Severity Selector
- Large circular buttons in a horizontal row, 48px minimum tap target (52px preferred).
- Numbers 1-10, each with color from the severity gradient (low green → medium amber → high terracotta → critical muted red).
- Selected state: filled circle with subtle glow (box-shadow, not bright). Unselected: outline only.
- Below the row: a single descriptive word ("Mild", "Moderate", "Severe", "Unbearable") that updates with selection.
- No smiley faces. No emoji. Descriptive text only.

### Trigger/Symptom Chip Selector
- Pill-shaped chips in a wrapping flex layout. 8px gap minimum between chips.
- Unselected: border only (`--color-border-accent`), text in `--color-text-secondary`.
- Selected: filled background (`--color-accent-subtle`), border in `--color-accent`, text in `--color-accent`. Subtle checkmark icon prepended.
- Common triggers pre-populated, drag-to-reorder by personal frequency.
- "Add custom" chip at the end — opens a single text field, not a modal.
- Grouped by category with subtle section labels: "Environment", "Food & Drink", "Hormonal", "Stress", "Sleep".

### Quick Log Card
- The most critical component — used during active attacks.
- Maximum 3-4 tappable inputs visible at once. Progressive disclosure for details.
- Pain level selector (see above), duration preset buttons ("Just started", "30 min", "1 hr", "2+ hr"), one-tap medication log.
- No typing required. Everything is tap-to-select.
- Background slightly raised from canvas (`--color-bg-secondary`) with 12px border-radius.
- Padding: 20px minimum. Touch targets never adjacent without 8px+ gap.

### Calendar Overview
- Monthly grid with date cells color-coded by severity.
- No-migraine days: default background. Migraine days: filled with severity color at 30% opacity.
- Current day: accent border ring.
- Tapping a day shows a minimal summary tooltip, not a full-screen navigation.
- Traffic light system familiar to Etsy migraine tracker buyers (green/amber/red days).

### Charts & Reports
- Line charts for trends (pain frequency, severity over time). Minimal grid lines.
- Chart line color: `--color-chart-line` (sage green). Fill below: `--color-chart-fill` (12% opacity).
- Axis labels in `--color-text-muted`. No decorative grid — only horizontal reference lines at key values.
- Doctor visit summary view: clean, printable layout with date range, attack count, average severity, top triggers, medications used. Designed to screenshot or print.

### Medication Log
- Each medication as a compact row: name, dose, time, effectiveness rating (3-level: "No help", "Some relief", "Resolved").
- Effectiveness uses pill-shaped toggle buttons, not dropdowns.
- Frequently used medications pinned to top. One-tap "same as last time" for repeat doses.

### Dark Mode Toggle
- Toggle in settings, defaults to "dark" on first load (overrides system preference).
- Option: "Follow system", "Always dark", "Always light".
- Transition between modes: 200ms ease, no flash of white.

## Reference Apps (Specific Elements to Borrow)

### 1. Migraine Buddy
- **Take:** The step-by-step attack logging flow — walks through pain location, intensity, symptoms, triggers, medications sequentially rather than showing everything at once. The head diagram for pain location marking. The "Just now" / "1h ago" time presets. The dark-leaning default aesthetic.
- **Don't take:** The illustrated mascot character. The social features. The subscription wall friction.

### 2. Bearable
- **Take:** The customizable symptom categories with severity levels (little/moderate/a lot). The color-coded mood scale. The way data feels empowering, not clinical. The "Use system theme" dark mode default.
- **Don't take:** The general-purpose breadth. We need migraine specificity.

### 3. N1-Headache
- **Take:** The dark-mode-first design philosophy — the entire visual identity built around dark interface. The "Trigger Map" and "Protector Map" visualizations showing what increases vs decreases risk. The daily diary under 5 minutes approach.
- **Don't take:** The complexity and inflexible mandatory questions. The crash-prone architecture.

### 4. Migraine Trail
- **Take:** The 10 built-in UI themes approach (multiple dark variants, not just one). The voice-first concept for zero-visual-effort logging. The barometric pressure forecasting integration.
- **Don't take:** The brand-new-app fragility. The AI-heavy marketing language.

### 5. Calm (non-migraine reference)
- **Take:** The pacing and breathing room in layouts. The way nothing feels urgent. The dark mode that feels like a sanctuary, not a dark theme slapped on. The way it never demands your attention — it waits.
- **Don't take:** The meditation-app aesthetic. We're a tool, not an experience.

## Stable Diffusion Prompts

### Hero Mockup (Primary Listing Image — Dark Theme Focus)
```
Overhead flat lay of a smartphone displaying a dark-themed health dashboard UI with sage green and muted purple accents on a dark charcoal linen tablecloth, dimmed room lighting, small ceramic cup of chamomile tea, dried lavender sprigs, dark leather notebook, dark wood desk surface visible at edges, moody ambient lighting from a single warm lamp, very low key photography, dark product flat lay, muted earth tones, the phone screen is the brightest element in frame, premium digital product mockup, editorial product photography, Canon EOS R5, 35mm lens, shallow depth of field, Etsy listing style
```

### Lifestyle Scene (Secondary Listing Image — Evening Use)
```
Woman's hands holding a phone showing a dark migraine tracking interface with green accents, lying in bed in a dimly lit room, soft warm lamplight on nightstand, weighted eye mask pushed up on forehead, glass of water on dark wood nightstand, cozy dark bedding in charcoal and deep blue, evening atmosphere, very low light photography, the phone screen provides soft glow, intimate quiet moment, shot from above at angle, photorealistic, lifestyle product photography for Etsy digital product listing, no bright elements, no face visible, muted tones
```

### Feature Showcase Background (Dark Desk Scene)
```
Minimal dark styled desk flat lay background for digital product mockup, dark charcoal linen fabric with subtle texture, small amber glass bottle of essential oil in corner, dark ceramic dish with dried lavender, dark leather journal edge visible, single soft warm light source from upper left creating gentle shadows, generous negative space in center for device placement, very dark moody product photography, premium Etsy listing aesthetic, dark earth tones, overhead shot, 4K resolution
```

### Multi-Device Mockup (Tablet + Phone)
```
Dark moody flat lay with iPad and iPhone both displaying a dark-themed health tracker dashboard, sage green UI accents visible on both screens, devices placed on dark slate surface, Apple Pencil beside iPad, small succulent plant in dark pot, everything in dark muted tones except the device screens which glow softly, minimal props, premium digital product display, editorial product photography, dark background, overhead shot, Etsy listing mockup style, photorealistic, no text overlays
```

### Doctor Visit Summary (Light Mode Print Shot)
```
Printed health report summary on white paper sitting on a clean light wood desk, the report shows a clean minimal design with sage green headers and data visualizations, a doctor's hand reaching for the paper, stethoscope partially visible at desk edge, clinical but warm setting, bright natural window light, the paper is the hero, professional medical context, clean editorial photography, shallow depth of field focused on the printed page, Etsy listing product photo showing printable feature
```

## Etsy Listing Strategy

### Image Sequence (7-10 images)
1. **Hero:** Dark-themed phone mockup on moody desk (SD prompt above). Product title overlay in clean sans-serif.
2. **Multi-device:** iPad + phone showing different views (dark mode).
3. **Feature: Quick Log** — close-up of the Quick Log interface with callout labels.
4. **Feature: Pain Scale** — the severity selector with color gradient, caption: "Track pain intensity at a glance."
5. **Feature: Monthly Calendar** — color-coded month view, caption: "See your migraine patterns emerge."
6. **Feature: Doctor Summary** — light mode print view, caption: "Share clear reports with your doctor."
7. **Feature: Triggers & Insights** — trigger chip selector and trend chart.
8. **Dark vs Light** — side-by-side showing both modes, caption: "Dark mode default — designed for light sensitivity."
9. **What's Included** — clean infographic listing all features.
10. **Testimonial/Social proof** — "Designed for people who track during attacks" messaging.

### Listing Differentiation
- Lead with "Dark Mode Default" — no other Etsy migraine tracker does this.
- Emphasize "Designed for use DURING a migraine" — the interactive, tap-only interface.
- Doctor visit summary as key feature — buyers love this across the category.
- "Scientifically-informed color choices" — the green accent isn't random.
- Position as premium interactive tool vs. static printable PDFs ($3-8).

## Anti-Patterns (What to Avoid)

### Color
- **No pure black (#000000) backgrounds.** Causes halation — bright text bleeds into pure black. Use `#141518` minimum.
- **No pure white (#FFFFFF) text.** Glaring on dark backgrounds. Use `#D4D5DB` — soft, not sharp.
- **No bright/saturated accent colors.** Every accent is muted and desaturated. Bright colors trigger photophobia.
- **No blue-heavy palette.** Blue light generates the largest neural signals in migraine sufferers' retinas (Harvard research). Blue is the enemy.
- **No red for "bad" or "danger."** Muted terracotta for severity, never fire-engine red. Alarming colors are hostile.
- **No gradient overload.** One subtle gradient max (chart area fill). Flat colors everywhere else.
- **No pure white backgrounds in light mode.** `#F5F4F2` minimum. Pure white screams "template."

### Typography
- **No thin/light font weights.** Thin text breaks down on dark backgrounds and during cognitive fog. Minimum weight 400.
- **No text smaller than 12px.** Cognitive fog + photophobia = larger text or nothing.
- **No ALL CAPS for headings or emotional content.** Sentence case only. Small labels with wide spacing only for metadata.
- **No tight line heights.** Dense text blocks blend into mush on dark backgrounds. Minimum 1.5 line-height for body.

### Layout
- **No information overload on first screen.** Quick Log shows 3-4 inputs maximum. Progressive disclosure for everything else.
- **No adjacent tap targets without 8px+ gap.** People in pain have impaired motor control.
- **No full-screen modals for simple selections.** Inline expansion or bottom sheets only.
- **No horizontal scrolling.** Cognitive fog users lose context.
- **No cramped layouts.** 20px minimum card padding. The product must breathe — and must screenshot well for Etsy listings.

### Interactions
- **No typing required for core logging.** Everything is tap-to-select with presets. Typing is optional for custom entries.
- **No animations that can't be disabled.** Vestibular sensitivity is common with migraines.
- **No celebratory confetti/sounds/haptics.** Tracking a migraine is not an achievement. Neutral acknowledgment only.
- **No auto-brightness or sudden screen changes.** Transitions are 200ms ease, never abrupt.
- **No notification harassment.** Optional, gentle reminders only. Never "You haven't logged today!"

### Content
- **No toxic positivity.** No "Stay strong!" or "You've got this!" Migraines are not a mindset problem.
- **No gamification.** No streaks, points, badges, or achievement systems. Missing a day means you were in pain.
- **No social sharing prompts.** Health data is deeply private.
- **No medical advice or diagnosis language.** "Your data shows..." not "You may have..."
- **No minimizing language.** Never "headache" when the user said "migraine." Respect the distinction.

### Etsy-Specific Anti-Patterns
- **No "developer side project" aesthetic.** If it looks like a Bootstrap dark theme, redesign. Every pixel must look intentional.
- **No inconsistent spacing or alignment.** Etsy buyers judge quality by visual consistency.
- **No empty-state screenshots in listings.** Always show realistic sample data — filled-in days, real-looking trigger selections.
- **No more than 2-3 fonts.** System stack handles both heading and body. Monospace for data values only.
- **No light-mode-only listing images.** The dark mode IS the product. Lead with dark.
- **No generic stock photo mockups.** The scene must feel specific to migraine sufferers — dim lighting, comfort items, evening/nighttime settings.
