# Chronic Pain & Fibromyalgia Tracker — Design Spec

> **Design methodology:** Etsy marketplace research first (what sells), real app UI patterns second (what works). This variant is for people who are exhausted. Every design decision must pass the test: "Does this work on a bad pain day?"

## Etsy Marketplace Research Findings

### What Sells in Chronic Pain/Fibromyalgia Trackers on Etsy

**Top-selling product patterns:**
- Comprehensive symptom tracker bundles dominate — daily/weekly/monthly views plus medication logs, appointment prep sheets, and trigger analysis. Bundles with 25+ pages consistently outperform single-page trackers.
- Fillable PDF trackers with multi-dimensional pain logging (location, intensity, type, duration) are the core product. Google Sheets dashboards with auto-calculations are the premium tier.
- "Medical binder" positioning is powerful — products designed to bring to doctor appointments get highlighted in reviews. Chronic pain patients fight to be believed; organized data is ammunition.
- Chronic illness tracker journals (GoodNotes/Notability compatible) with hyperlinked navigation command higher prices ($10-20).
- Products by occupational therapists and chronic illness patients themselves carry authenticity — "made by someone who gets it" is a selling point.

**Color palettes that sell in this niche:**
- **Warm neutrals dominate.** Cream, tan, soft brown, muted sage — the chronic illness planner market leans heavily into "cozy" not "clinical." This is the anti-hospital aesthetic.
- Muted earth tones (terracotta, warm clay, olive) appear across top sellers. These signal "handmade," "natural," "gentle" — exactly what this audience wants.
- Soft sage green as an accent is nearly universal — it reads as "wellness" without being clinical.
- Dusty rose/blush as a secondary warm accent appears in many feminine-leaning products.
- **Critical observation: No interactive digital dashboards exist for chronic pain on Etsy.** The category is dominated by static printables and spreadsheets. An interactive HTML tracker is a genuine gap.

**Mockup presentation patterns:**
- Warm lifestyle flat-lays: tablet/phone on a textured surface (chunky knit blanket, linen, warm wood) with comfort items — tea, candles, soft fabrics, a heating pad nearby.
- "Spoonie aesthetic" is real: cozy, warm, soft, lived-in. Not aspirational wellness — actual daily-life-with-pain comfort.
- Filled-in example pages are critical — chronic pain buyers need to see the tracker handling complex, multi-location, variable-severity pain. Empty states signal "this won't handle my situation."
- Feature callout slides with clean sans-serif overlay text explaining each tracking capability.
- Multiple device mockups showing phone + tablet to signal "use it from bed, the couch, anywhere."

**What separates top sellers (high review counts):**
- Multi-dimensional pain logging: not just "rate 1-10" but location + type (burning, aching, stabbing, throbbing) + duration + what helps.
- Trigger correlation: food diary, sleep, weather, activity level, stress — buyers want to find patterns.
- Medication tracking with effectiveness ratings — "does this actually help?" data over time.
- Functional capacity logging: what you could/couldn't do today. For disability documentation and self-understanding.
- Flare tracking: when flares start/end, severity arcs, recovery patterns.
- Doctor visit preparation: summary sheets, medication lists, symptom timelines.

**Key features buyers demand (ranked by review frequency):**
1. Pain intensity scale (1-10 or descriptive)
2. Pain location mapping (multiple simultaneous locations)
3. Pain type descriptors (aching, burning, stabbing, throbbing, tingling, stiffness)
4. Medication & supplement log (name, dose, time, effectiveness)
5. Sleep quality & hours tracking
6. Fatigue/energy level (separate from pain — fibro patients insist on this distinction)
7. Trigger identification (food, weather, activity, stress, hormones)
8. Functional capacity / activity level
9. Mood tracking (pain-mood correlation is critical data)
10. Flare duration and pattern tracking
11. Doctor visit summary / medical binder pages
12. Weather & barometric pressure correlation

### Competing Interactive Dashboard Sellers (Cross-Category)

- Dashboard-as-hero-image strategy drives Etsy clicks — the product must look impressive and clearly functional at thumbnail size.
- Interactive tools with auto-calculating summaries justify premium pricing ($15-25 vs $3-8 for static printables).
- Web-based tools accessed via link are the emerging premium tier — our HTML approach is a natural fit.
- Progress bars, trend charts, and color-coded severity calendars signal "this is worth more than a PDF."

## Audience

People living with chronic pain conditions — fibromyalgia, EDS (Ehlers-Danlos Syndrome), CRPS, rheumatoid arthritis, chronic fatigue syndrome, and overlapping conditions. Most have multiple diagnoses. All are exhausted.

**Who they are:**
- Predominantly female, ages 25-55, though chronic pain affects all demographics
- Managing invisible illness — they look fine on the outside while hurting on the inside
- Experienced medical gaslighting — many have been told "it's in your head" or "just lose weight"
- Dealing with brain fog, fatigue, and cognitive impairment as daily companions
- Financially stressed — chronic illness is expensive, and many have reduced work capacity
- Community-oriented — "spoonies" have strong mutual support networks
- Data-driven out of necessity — they track to prove their pain is real, to find patterns, to advocate for care

**When they use it:**
- During flares (high pain, low energy — needs to be effortless)
- End of day logging (tired, want to capture the day before forgetting — brain fog)
- Before doctor appointments (need organized summaries — this is the money feature)
- During good periods for pattern analysis (can tolerate more complex views)

## Mood

A weighted blanket on a cool evening. Warm mug in both hands. The room is soft — warm light, natural textures, nothing sharp or cold. The interface feels like it was designed by someone who understands that some days, just opening an app is an achievement. It doesn't ask too much. It doesn't judge the bad days. It holds the data gently and gives it back when you need it.

This is not a fitness tracker. This is not a wellness optimizer. This is a companion for people who are tired of being told to try harder. It simply asks: "How are you today?" and believes the answer.

The product must feel handmade, warm, grounded — like clay pottery, not stainless steel. Like a craft market, not a pharmacy.

## Color Palette

### Light Mode (Default)

Warm earth tones. Think sun-baked clay, dried herbs, warm sand, soft wool. Every color is desaturated and warm — nothing cold, nothing clinical, nothing that screams "health app."

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg-primary` | `#F7F3EE` | Warm sand. Like unbleached paper. |
| Surface | `--color-bg-secondary` | `#EFEBE4` | Warm cream. Cards, panels. |
| Surface raised | `--color-bg-tertiary` | `#E7E2DA` | Modals, hover states. Soft parchment. |
| Border | `--color-border` | `#D8D1C7` | Warm taupe separators. |
| Border accent | `--color-border-accent` | `#C4BBB0` | Active/focus states. |
| Text primary | `--color-text-primary` | `#3B352E` | Deep warm brown. Not black — earthy. |
| Text secondary | `--color-text-secondary` | `#7A7267` | Warm stone gray. Labels, captions. |
| Text muted | `--color-text-muted` | `#A69E93` | Warm beige-gray. Placeholders. |
| Accent primary | `--color-accent` | `#9E7B6B` | Muted terracotta/clay. The signature color. Warm, grounded, earthy. |
| Accent hover | `--color-accent-hover` | `#8B6A5B` | Deeper clay on hover. |
| Accent subtle | `--color-accent-subtle` | `#F0E8E3` | Warm blush tint for selected states. |
| Secondary accent | `--color-secondary` | `#7A9478` | Muted sage green. Success, "good day," relief. |
| Secondary subtle | `--color-secondary-subtle` | `#E8EFE7` | Sage tint backgrounds. |
| Severity low | `--color-severity-low` | `#7A9478` | Pain 1-3. Sage green — manageable. |
| Severity medium | `--color-severity-med` | `#C4A86B` | Pain 4-6. Warm amber — moderate. |
| Severity high | `--color-severity-high` | `#B87D6B` | Pain 7-9. Dusty terracotta — significant. |
| Severity critical | `--color-severity-crit` | `#A85D5D` | Pain 10. Muted rose-brick — severe but not alarming. |
| Energy low | `--color-energy-low` | `#B87D6B` | Low energy/high fatigue. |
| Energy medium | `--color-energy-med` | `#C4A86B` | Moderate energy. |
| Energy high | `--color-energy-high` | `#7A9478` | Good energy day (rare and worth noting). |
| Chart line | `--color-chart-line` | `#9E7B6B` | Primary data line. Terracotta. |
| Chart fill | `--color-chart-fill` | `rgba(158, 123, 107, 0.10)` | Area fill. |
| Chart line alt | `--color-chart-line-alt` | `#7A9478` | Secondary data line. Sage. |
| Success | `--color-success` | `#7A9478` | Positive states. |
| Warning | `--color-warning` | `#C4A86B` | Caution. |
| Error | `--color-error` | `#A85D5D` | Errors. Muted, not alarming. |

### Dark Mode

Warm and enveloping — like a dimmed room with warm lamplight. Not cold gray, not blue-black. Deep brown-charcoal with warm undertones. For evening logging and flare days when screens are painful.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg-primary` | `#1A1714` | Deep warm charcoal-brown. Like dark wood. |
| Surface | `--color-bg-secondary` | `#23201C` | Warm dark surface. Cards, panels. |
| Surface raised | `--color-bg-tertiary` | `#2D2924` | Elevated surfaces. |
| Border | `--color-border` | `#3A352F` | Warm dark separators. |
| Border accent | `--color-border-accent` | `#4A443D` | Active/focus states. |
| Text primary | `--color-text-primary` | `#DDD6CC` | Warm parchment white. Not pure — soft. |
| Text secondary | `--color-text-secondary` | `#9B9388` | Warm stone. Labels, captions. |
| Text muted | `--color-text-muted` | `#6B6359` | Warm muted. Placeholders. |
| Accent primary | `--color-accent` | `#C49A88` | Lighter clay/terracotta for dark backgrounds. |
| Accent hover | `--color-accent-hover` | `#D4AA98` | Warmer on hover. |
| Accent subtle | `--color-accent-subtle` | `#2A2320` | Dark warm tint for selected chips. |
| Secondary accent | `--color-secondary` | `#8FB893` | Soft sage. Slightly lifted for dark bg. |
| Secondary subtle | `--color-secondary-subtle` | `#1F2720` | Dark sage tint. |
| Severity low | `--color-severity-low` | `#8FB893` | Pain 1-3. |
| Severity medium | `--color-severity-med` | `#D4B87A` | Pain 4-6. |
| Severity high | `--color-severity-high` | `#C8907A` | Pain 7-9. |
| Severity critical | `--color-severity-crit` | `#C47474` | Pain 10. |
| Energy low | `--color-energy-low` | `#C8907A` | Low energy. |
| Energy medium | `--color-energy-med` | `#D4B87A` | Moderate. |
| Energy high | `--color-energy-high` | `#8FB893` | Good day. |
| Chart line | `--color-chart-line` | `#C49A88` | Primary data. |
| Chart fill | `--color-chart-fill` | `rgba(196, 154, 136, 0.12)` | Area fill. |
| Chart line alt | `--color-chart-line-alt` | `#8FB893` | Secondary data. |
| Success | `--color-success` | `#8FB893` | Positive. |
| Warning | `--color-warning` | `#D4B87A` | Caution. |
| Error | `--color-error` | `#C47474` | Error. Still calm. |

## Typography

```css
/* System font stack — no loading, native feel, fast */
--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-family-mono: 'SF Mono', 'Cascadia Mono', 'Consolas', monospace;

/* Sizes — generous for brain fog and fatigue */
--font-size-xs: 0.75rem;    /* 12px — timestamps, fine print only */
--font-size-sm: 0.8125rem;  /* 13px — metadata, captions */
--font-size-base: 0.9375rem; /* 15px — body text, larger for fog readability */
--font-size-lg: 1.125rem;   /* 18px — section headers, card titles */
--font-size-xl: 1.375rem;   /* 22px — page titles */
--font-size-2xl: 1.75rem;   /* 28px — hero numbers */

/* Weights — minimum 400. Thin text disappears in brain fog. */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Line heights — extra generous. Dense text = unreadable on bad days. */
--line-height-tight: 1.3;
--line-height-normal: 1.65;
--line-height-relaxed: 1.85;

/* Letter spacing */
--letter-spacing-normal: 0.01em;
--letter-spacing-wide: 0.03em;   /* Small labels and metadata */
```

**Typography rules:**
- Body text at 15px minimum. Brain fog + fatigue = larger text or it doesn't get read.
- Never use font-weight below 400. Light text is invisible when you're squinting through pain.
- Sentence case everywhere. This is a journal, not a medical form.
- All caps ONLY for tiny section labels (xs size, wide letter-spacing). Never for headings.
- Generous line-height (1.65 for body) so text doesn't blur into blocks.
- Monospace for numbers, scores, timestamps — aids quick scanning when cognition is low.
- Heading letter-spacing: `-0.01em`. Slightly tighter for warmth.

## Component Notes

### Pain Severity Selector (5-State Button Pattern)
- Five large buttons in a horizontal row, minimum 48px tap targets (52px preferred).
- Labels: "None", "Mild", "Moderate", "Severe", "Extreme" — descriptive words, not numbers. Chronic pain patients think in words, not scales.
- Each button colored from the severity gradient (sage → amber → terracotta → brick).
- Selected state: filled background with severity color, subtle inner shadow. Unselected: outline only with `--color-border-accent`.
- Below the row: optional free-text note field ("What does it feel like?") — collapsed by default, tap to expand.
- No smiley faces. No emoji. Words and colors only.

### Pain Type Chips
- Pill-shaped chips for pain descriptors: Aching, Burning, Stabbing, Throbbing, Tingling, Stiffness, Pressure, Shooting, Cramping.
- Multi-select — chronic pain is rarely one type.
- Unselected: outline border, secondary text color.
- Selected: filled with `--color-accent-subtle`, border in `--color-accent`, checkmark prepended.
- "Add custom" chip at end — single text field, not a modal. Chronic pain invents new descriptors.

### Energy/Fatigue Tracker (Separate from Pain)
- Fibromyalgia and chronic fatigue patients INSIST fatigue is not a subset of pain. Respect this.
- Five-state selector: "Crashed", "Very Low", "Low", "Okay", "Good" — reversed from pain (low = bad here).
- Color gradient uses energy tokens (terracotta for crashed → amber → sage for good).
- Positioned prominently — this is as important as pain level for this audience.

### Quick Log Card
- The core interaction for flare days — when everything hurts and you barely have energy to open the app.
- Maximum 3 tappable inputs visible: Pain level, Energy level, "What hurts?" (body region quick-select).
- Everything is tap-to-select. Zero typing required for a basic log.
- "More details" expandable section for: pain type, triggers, medication, mood, sleep quality.
- Background: `--color-bg-secondary` with 14px border-radius.
- Padding: 20px minimum. Touch targets never adjacent without 8px+ gap.
- Subtle left border accent in `--color-accent` (3px) for visual warmth.

### Body Region Quick-Select
- NOT a detailed body map (too complex for flare days). Instead: a simplified grid of body regions.
- Regions: Head, Neck, Shoulders, Upper Back, Lower Back, Arms, Hands, Chest, Abdomen, Hips, Upper Legs, Lower Legs, Feet, "Everywhere."
- Multi-select chips grouped logically. "Everywhere" is a single tap — because some days, it really is everywhere.
- Selected regions can individually have severity if the user wants granularity (progressive disclosure).

### Flare Timeline
- A horizontal timeline showing the current flare's arc — when it started, current severity, duration.
- Simple visual: a colored bar that grows, with severity-colored segments.
- "Start flare" and "End flare" buttons — large, clear, one-tap.
- Between flares: shows days since last flare. Not as a "streak" (no gamification) — as information.

### Calendar Overview
- Monthly grid with date cells color-coded by pain severity.
- Pain-free days: default background. Pain days: filled with severity color at 25% opacity.
- Flare days: stronger severity fill with a subtle bottom border in `--color-accent`.
- Current day: warm accent border ring.
- Tapping a day shows a compact summary — severity, energy, key symptoms. Not a navigation event.
- Dual-track visual: pain severity as fill color, energy level as a small dot in the corner of each cell.

### Charts & Reports
- Trend lines for pain and energy over time. Dual-axis when both are shown — terracotta for pain, sage for energy.
- Chart line: `--color-chart-line` (terracotta). Secondary: `--color-chart-line-alt` (sage). Fill at 10-12% opacity.
- Minimal grid. Axis labels in `--color-text-muted`. Horizontal reference lines only.
- Trigger correlation view: which tracked factors correlate with higher/lower pain. Bar chart format.
- Doctor visit summary: clean, printable layout. Date range, flare count, average severity, top triggers, medication effectiveness, functional capacity trends. Designed to screenshot or print.
- All charts must be clearly readable at Etsy listing thumbnail size — bold lines, high contrast data points.

### Medication Log
- Compact rows: medication name, dose, time, effectiveness.
- Effectiveness rating: 4-level toggle buttons — "No help", "Some relief", "Good relief", "Resolved."
- "Same as yesterday" one-tap for repeat dosing (common with chronic medication).
- Frequently used medications pinned to top.
- PRN (as-needed) vs. scheduled medication distinction.
- Supplement tracking alongside medications — chronic pain patients often track both.

### Mood Tracker
- Five-state selector: "Struggling", "Low", "Okay", "Good", "Great."
- Uses warm neutral colors — not the pain severity colors. Mood is separate data.
- Optional note: "What's on your mind?" — collapsed by default.

### Dark Mode Toggle
- Settings menu, defaults to "Follow system" (unlike Migraine which defaults dark).
- Options: "Follow system", "Always light", "Always dark."
- 200ms ease transition, no flash of white.

## Reference Apps (Specific Elements to Borrow)

### 1. Bearable
- **Take:** The customizable symptom categories with severity levels. The way everything is on one scrollable screen — no buried menus. The gentle, encouraging data visualization. The "track anything" flexibility. The way it handles brain fog by making tracking quick and tap-based. The privacy-first approach.
- **Don't take:** The general-purpose breadth — we need chronic pain specificity. The subscription gatekeeping of core features.

### 2. PainScale
- **Take:** The body map for pain location marking. The dual "personal insights" and "community insights" concept (we do personal only, but the framing is good). The doctor report generation — clean, printable, credible. The separation of pain log components (location, severity, type, triggers). The 800+ educational article approach to content.
- **Don't take:** The cluttered interface. The aggressive community/social features. The dated visual design.

### 3. FlareDown
- **Take:** The daily check-in system designed for habit formation. The significant customization of symptoms and tracked factors. The clean, minimal check-in that captures multiple dimensions quickly. The "real-time monitoring" visual snapshot of current status.
- **Don't take:** The gamification elements (streaks, badges). The inconsistent visual language.

### 4. CatchMyPain
- **Take:** The interactive body model with color-coded pain intensity drawing. The 5-color severity system (yellow to dark red) — simple and intuitive. The ability to rotate the body model for all locations. The mood and stress correlation tracking alongside pain.
- **Don't take:** The dated interface design. The social/community forum features. The Swiss-medical aesthetic that feels cold.

### 5. Calm (non-pain reference)
- **Take:** The pacing. The breathing room. The way nothing feels urgent or demanding. The warm color palette. The interface that waits for you instead of pushing you. The dark mode that feels like a sanctuary. The way it treats struggling people with quiet dignity, not toxic positivity.
- **Don't take:** The meditation-app branding. The subscription-first model. The aspirational wellness aesthetic — we're grounded in reality.

## Stable Diffusion Prompts

### Hero Mockup (Primary Listing Image — Warm, Grounded)
```
Overhead flat lay of a smartphone displaying a warm-toned health tracking dashboard with terracotta and sage green accents, lying on a chunky cream knit blanket, small ceramic mug of herbal tea on a round wooden coaster, dried eucalyptus sprig, a worn leather journal with a pen, warm afternoon sunlight from a window creating soft shadows, everything in warm earth tones and natural textures, cozy domestic setting, warm color temperature, premium digital product mockup, editorial lifestyle photography for Etsy listing, Canon EOS R5, 35mm lens, shallow depth of field, no cold colors, no clinical elements
```

### Lifestyle Scene (Secondary Listing Image — Couch/Bed Use)
```
Woman's hands holding a phone showing a warm-toned chronic pain tracker interface with terracotta and muted sage accents, reclining on a cozy couch with a soft throw blanket in oatmeal and warm brown, heating pad visible nearby, cup of ginger tea on a side table, warm lamp light, living room with warm wood tones and soft textiles, evening atmosphere, intimate comfortable setting, shot from slightly above, no face visible, lifestyle product photography for Etsy digital product listing, warm earth tone palette throughout, photorealistic, gentle natural lighting
```

### Feature Showcase Background (Warm Texture Scene)
```
Minimal warm styled flat lay background for digital product mockup, natural linen fabric in warm oatmeal with visible weave texture, small terracotta ceramic dish with dried chamomile flowers in corner, raw wooden spoon, sprig of dried rosemary, single warm light source from upper left creating gentle shadows, generous negative space in center for device placement, warm earth tone product photography, handmade craft market aesthetic, overhead shot, Etsy listing style, no cold colors, no clinical whites, 4K resolution
```

## Etsy Listing Strategy

### Image Sequence (7-10 images)
1. **Hero:** Phone on cozy blanket showing warm-toned dashboard (SD prompt above). Clean sans-serif title overlay.
2. **Multi-device:** Phone + tablet showing different views. "Use from bed, the couch, anywhere."
3. **Feature: Quick Log** — close-up of the 3-tap Quick Log interface. Caption: "Log pain in under 30 seconds."
4. **Feature: Pain & Energy** — severity selector + energy tracker side by side. Caption: "Pain AND fatigue — because they're not the same thing."
5. **Feature: Body Regions** — the region quick-select with multiple areas highlighted. Caption: "Track where it hurts — even when it's everywhere."
6. **Feature: Flare Timeline** — the flare arc visualization. Caption: "See your flare patterns over time."
7. **Feature: Doctor Summary** — clean printable report view. Caption: "Walk into your appointment with proof."
8. **Feature: Calendar** — monthly view with dual pain/energy coding. Caption: "Your month at a glance."
9. **Light + Dark** — side by side. Caption: "Day or night. Good days or bad."
10. **What's Included** — clean infographic listing all features.

### Listing Differentiation
- Lead with "Designed for flare days" — the 30-second Quick Log that works when you can barely hold your phone.
- Emphasize fatigue as a first-class tracked metric, not a subset of pain — fibro patients will notice this.
- Doctor visit summary as the credibility anchor — "Walk into your appointment with data."
- "No gamification, no streaks, no guilt" — explicitly call this out. This audience has been burned by wellness apps.
- Position as interactive premium ($14.99-19.99) vs static printable PDFs ($3-8).
- The warm, handmade aesthetic differentiates from every clinical-looking tracker on the market.

## Anti-Patterns (What to Avoid)

### Color
- **No clinical blue.** Blue = hospital = dismissive doctors = trauma for this audience. Zero blue in the palette.
- **No clinical white (#FFFFFF) backgrounds.** `#F7F3EE` minimum. Pure white reads as medical form, not comfort.
- **No pure black (#000000) in dark mode.** `#1A1714` with warm undertone. Pure black is cold.
- **No bright saturated colors anywhere.** Every color is muted and desaturated. Bright colors feel aggressive when you're in pain.
- **No cold gray.** All grays have warm undertones. Cold gray = clinical = institutional.
- **No gradient overload.** Severity gradients on selectors are functional. No decorative gradients. Flat colors.
- **No neon or high-saturation accents.** The terracotta accent is muted. The sage is muted. Everything is muted.

### Typography
- **No thin/light font weights.** Minimum 400. Brain fog + fatigue = heavy weights or invisible text.
- **No text smaller than 12px.** Cognitive impairment demands larger text. Prefer 15px body.
- **No ALL CAPS for headings or emotional content.** Sentence case only. ALL CAPS feels like shouting at someone in pain.
- **No tight line heights.** Minimum 1.5 for body. Dense text blocks are unreadable on bad days.
- **No decorative or script fonts.** System stack only. Decorative fonts fail under cognitive load.

### Layout
- **No information overload on first screen.** Quick Log: 3 inputs visible. Progressive disclosure for everything else.
- **No adjacent tap targets without 8px+ gap.** Pain patients have shaky hands, reduced grip strength, joint pain.
- **No horizontal scrolling.** Brain fog users lose context instantly.
- **No deep navigation hierarchies.** Maximum 2 taps to reach any feature from home.
- **No cramped layouts.** 20px minimum card padding. The product must breathe.
- **No complex multi-step flows.** If it takes more than 3 taps during a flare, it's too many.

### Interactions
- **No required typing for core logging.** Everything is tap-to-select with presets. Typing is optional for details.
- **No animations that can't be disabled.** Fibromyalgia medications can cause dizziness and motion sensitivity.
- **No celebratory effects.** No confetti, no sounds, no "Great job tracking today!" Logging pain is not an achievement.
- **No auto-play or sudden changes.** All transitions 200ms ease. No surprises.
- **No notification guilt.** Never "You haven't logged in 3 days!" The user was probably in a flare. Gentle optional reminders only.

### Content
- **No toxic positivity.** No "Stay strong!", "Pain is temporary!", "You've got this!" Chronic pain is NOT temporary for these users.
- **No gamification.** No streaks. No points. No badges. No leaderboards. Missing a day means you were suffering.
- **No "wellness warrior" language.** Chronic pain is not a battle to win. It's a condition to manage.
- **No weight tracking as a default metric.** Many chronic pain patients have complicated relationships with weight due to medications and reduced mobility.
- **No social sharing.** Health data is deeply private. No sharing prompts ever.
- **No medical advice or diagnosis.** "Your data shows..." not "You may have..." We are a mirror, not a doctor.
- **No minimizing language.** Never "discomfort" when the user said "pain." Respect the severity they report.
- **No "just push through" messaging.** Pacing is a legitimate pain management strategy. Rest is valid data.

### Etsy-Specific Anti-Patterns
- **No "developer side project" aesthetic.** If it looks like a Bootstrap theme with health labels, redesign. Every pixel must look handcrafted and intentional.
- **No inconsistent spacing.** Etsy buyers judge quality by visual consistency — uneven padding screams amateur.
- **No empty-state screenshots.** Always show realistic multi-location pain data, filled medication logs, completed flare timelines.
- **No cold/clinical listing photography.** The mockup scenes must feel warm and domestic — blankets, tea, warm light. Never white desks or sterile setups.
- **No more than 2-3 fonts.** System stack handles heading and body. Monospace for data only.
- **No generic wellness stock imagery.** Scenes should feel specific to chronic pain life — heating pads, cozy recliners, bed-accessible setups.
