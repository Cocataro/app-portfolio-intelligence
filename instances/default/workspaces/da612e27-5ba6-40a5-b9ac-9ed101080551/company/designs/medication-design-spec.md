# Medication & Supplement Tracker — Design Spec

> **Design methodology:** Etsy marketplace research first (what sells), real app UI patterns second (what works). The product must look like it belongs among Etsy best sellers from day one.

## Etsy Marketplace Research Findings

### What Sells in Medication/Supplement Trackers on Etsy

**Top-selling product patterns:**
- Medication tracker spreadsheets with auto-updating adherence dashboards (Google Sheets/Excel) — top sellers combine daily dose logging with visual summaries showing compliance rates. Buyers want to see they're staying on track.
- Multi-tab bundles with daily/weekly/monthly views plus refill date tracking and expense summaries. Bundles outsell single-page logs by a wide margin.
- Supplement tracker templates that go beyond simple checklists — they include dosage, timing, how-I-feel notes, and correlation with symptoms. Specificity beats generic.
- "Medical binder" style products — comprehensive, organized, designed to hand to a pharmacist or doctor. Signals the product is serious and functional.

**Mockup presentation patterns that drive sales:**
- Laptop/iPad on a styled desk with clean, minimal props (coffee, reading glasses, a small plant). The medication audience is practical — no crystals or dried flowers. Think: organized home office.
- Clean, high-contrast color palettes dominate — most sellers default to clinical green/blue, but the highest-earning seller ($250k+) differentiated with "fun colors and graphs" on neutral backgrounds. Standing out from the green/blue sea is a competitive advantage.
- Product screenshots that are readable at thumbnail size — large column headers, obvious check marks, clearly visible charts.
- Dual-format offering (Excel + Google Sheets) is now table stakes. Our HTML interactive dashboard is a differentiator — it's even more interactive.
- Price sweet spot: $8-$15 for spreadsheets with dashboards. Static PDFs cluster at $2-5. Our interactive HTML product justifies premium pricing.

**What separates best sellers from the rest:**
- Adherence dashboard with auto-updating charts is the hero image. It looks functional, trustworthy, and worth the price at thumbnail size.
- Refill date tracking and reminders — this is the feature buyers mention most in reviews.
- Expense tracking for medications — practical value that justifies the price.
- Clean, organized layouts with consistent spacing. This audience values order and clarity above all else.
- Color-coded categories (prescription vs. supplement vs. vitamin) for at-a-glance scanning.

**Etsy color trends in medication/health category:**
- Green/blue dominates and has become generic — products blend together. Warm neutrals with a distinctive accent color stand out.
- The most successful sellers use restrained palettes: 2-3 colors max plus neutrals. Over-colored products look amateur in this category.
- Premium positioning requires clean whites with purposeful accent colors — never saturated or playful. This audience wants trustworthy, not trendy.

### Competing Interactive Dashboard Sellers (Cross-Category Learning)

**Budget tracker dashboards (closest analog):**
- Clean data tables with colored header rows, alternating row tints, and summary cards at the top. The medication tracker can borrow this pattern directly.
- Progress bars and donut charts for adherence rates look impressive in listing screenshots.
- Bold, clear typography in data cells — this audience needs to read values quickly.

**2 Magpies Creative (wedding planners):**
- Dashboard-as-hero-image strategy works across categories. The medication adherence dashboard should be the first listing image.
- Grid layout with colored category indicators gives an immediate sense of organization.

## Mood Board Description

A clean, organized space that feels like a trusted pharmacist's recommendation — not a hospital system, not a generic spreadsheet. Think: a well-lit kitchen counter where someone has their weekly pill organizer, a glass of water, and a sense of calm control over their health routine.

The interface is clear above all else. Every label is readable. Every button is obvious. Every piece of information is where you'd expect it to be. The color palette is warm and trustworthy — a slate blue that's steady and reliable, paired with warm cream backgrounds that feel like home, not a clinic.

This product is designed for reading glasses and shaky hands. For someone managing 8 medications who needs to know at a glance: did I take my morning pills? When does my prescription need refilling? The design never makes them feel old or incapable — it makes them feel organized and in control.

## Color Palette

### Light Mode
- **Primary:** `#4A6F8A` — Steady Slate Blue (trustworthy, calm blue with warm gray undertone — medical credibility without clinical coldness)
- **Primary Light:** `#7A9DB8` — Soft Sky (hover states, selected items, gentle highlights)
- **Primary Dark:** `#345570` — Deep Harbor (active states, pressed buttons, strong emphasis)
- **Background:** `#FAF8F5` — Warm Ivory (warm white — reads as premium, reduces eye strain for extended reading)
- **Surface:** `#FFFFFF` — White (cards, modals, elevated surfaces — maximum contrast for readability)
- **Surface Alt:** `#F0EDE8` — Soft Oat (alternating rows, section breaks — gives visual rhythm without distraction)
- **Border:** `#DDD8D0` — Warm Sand (card borders, dividers — warm, not cold gray)
- **Text Primary:** `#1E2A32` — Deep Ink (near-black with blue undertone — maximum readability)
- **Text Secondary:** `#5A6B78` — Slate Gray (secondary text, labels, timestamps)
- **Text Muted:** `#8E9BA5` — Soft Steel (placeholders, disabled text)
- **Accent Warm:** `#C4865A` — Warm Amber (CTAs, important badges — warm complement to slate blue, stands out without shouting)
- **Accent Success:** `#5E9E6B` — Steady Green (taken/complete states, adherence indicators — reliable green, not neon)
- **Accent Alert:** `#C47A5A` — Soft Terracotta (refill reminders, low-stock warnings — visible but not alarming)
- **Adherence High:** `#5E9E6B` — Steady Green (90%+ adherence)
- **Adherence Mid:** `#C4865A` — Warm Amber (60-89% adherence)
- **Adherence Low:** `#B85A5A` — Muted Brick (below 60% — concern, not panic)

### Dark Mode
- **Primary:** `#7A9DB8` — Soft Sky (elevated for dark-on-dark contrast)
- **Primary Light:** `#A3C1D4` — Pale Harbor (hover, selected)
- **Primary Dark:** `#4A6F8A` — Steady Slate Blue (pressed, strong emphasis)
- **Background:** `#141A1E` — Deep Navy-Black (cool undertone, not pure black — easier on eyes)
- **Surface:** `#1E2830` — Dark Slate (cards, elevated surfaces)
- **Surface Alt:** `#263038` — Muted Steel (section breaks)
- **Border:** `#354048` — Cool Dark Gray
- **Text Primary:** `#E8ECF0` — Pale Ice White
- **Text Secondary:** `#A0B0BC` — Soft Steel
- **Text Muted:** `#6E7E8A` — Muted Slate
- **Accent Warm:** `#D4A07A` — Light Amber
- **Accent Success:** `#70B87E` — Soft Green
- **Accent Alert:** `#D49070` — Light Terracotta
- **Adherence High:** `#70B87E` — Soft Green
- **Adherence Mid:** `#D4A07A` — Light Amber
- **Adherence Low:** `#C87070` — Soft Brick

## Typography Notes

- **Font stack:** System fonts — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Clean, reliable, renders well across devices.
- **Headings:** `font-weight: 700` (bold — this audience needs strong visual hierarchy). Letter-spacing: `-0.01em`. Size: 20px+ for section headings — must be readable with reading glasses.
- **Body:** `font-weight: 400`, `line-height: 1.7` (extra generous for readability), `font-size: 16px` base (larger than typical — accessibility-first for older demographic).
- **Labels/Captions:** `font-weight: 600`, `font-size: 13px`, `letter-spacing: 0.02em`. Always pair with adequate spacing.
- **Numbers/Data:** `font-variant-numeric: tabular-nums` for aligned columns. `font-weight: 700` for dosage numbers and adherence percentages — these must be instantly scannable.
- **Medication names:** `font-weight: 600`, `font-size: 16px` minimum. The medication name is the most important piece of text on any card.
- **Emotional tone:** Clear, direct language. "Take" not "administer." "Refill needed" not "prescription renewal required." Plain English.

## Component Style Notes

### Buttons
- **Primary:** `background: var(--primary)`, `color: white`, `border-radius: 8px`, `padding: 14px 28px`. Subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`. Hover: darken 8%. Minimum height: 48px.
- **Secondary:** `background: transparent`, `border: 2px solid var(--primary)`, `color: var(--primary)`. Thicker border than PCOS variant — needs to be visible for older eyes.
- **"Take" button:** Large, prominent. `background: var(--accent-success)`, `color: white`, `border-radius: 10px`, `padding: 16px 32px`, `font-weight: 700`. This is the most-used interaction — make it unmissable.
- **Touch targets:** Minimum 48px height, 48px width. Generous spacing between buttons (12px minimum gap). Designed for shaky hands and imprecise taps.

### Cards
- `border-radius: 10px`. `border: 1px solid var(--border)`. `padding: 20px 24px`. `box-shadow: 0 1px 4px rgba(0,0,0,0.06)`. Clean and structured — like a well-organized form.
- **Medication cards:** Left-border accent `border-left: 4px solid var(--category-color)` for instant category recognition (prescription = primary, supplement = amber, vitamin = success green).
- **Dashboard cards:** Clear numerical headlines (adherence %, next refill date) in `font-size: 28px`, `font-weight: 700`. The number is the card.
- **Refill alert cards:** Subtle `background: rgba(196,122,90,0.08)` tint with left border `var(--accent-alert)`. Visible but not stressful.

### Inputs / Controls
- **Checkboxes:** Large — `24px` with `border: 2px solid var(--border)`, `border-radius: 4px`. Checked: `background: var(--accent-success)`, white checkmark. Must be easy to tap.
- **Dose selector:** Stepper buttons (+ / −) at `44px` square. Current value displayed large between them. No freeform typing for common doses.
- **Time picker:** Large, clear segments. Morning / Afternoon / Evening / Bedtime as pill-shaped buttons rather than exact times (unless user opts in).
- **Text inputs:** `border-radius: 6px`, `border: 2px solid var(--border)`, `padding: 14px 16px`, `font-size: 16px`. Focus: `border-color: var(--primary)`, `box-shadow: 0 0 0 3px rgba(74,111,138,0.15)`.

### Charts / Data Visualization (Key for Etsy Listing Screenshots)
- **Adherence charts are the hero.** A clean donut chart showing "92% adherence this month" is the money shot for listings.
- **Weekly adherence bar chart:** 7 bars, rounded tops (`border-radius: 4px 4px 0 0`), color-coded by adherence level. Simple, instantly readable.
- **Monthly calendar view:** Grid of days, each cell color-tinted by adherence (green = all taken, amber = partial, empty = missed). This photographs beautifully.
- **Line charts:** `stroke-width: 3px`, rounded joins. Thicker than PCOS variant for visibility.
- **Color usage:** Adherence palette only (green/amber/brick). Every color has clear meaning.
- **Grid lines:** `var(--border)` at 30% opacity. Minimal — data is the focus.
- **Labels on charts:** `font-size: 14px`, `font-weight: 600`. Always visible, never hidden behind hover states.

### Navigation
- Bottom tab bar: 4 tabs max (fewer choices = easier for this audience). Active = `var(--primary)` icon + label. Inactive = `var(--text-muted)`.
- **Tab labels always visible.** Never icon-only. This audience needs words, not guesswork.
- Active indicator: `3px` rounded bar beneath icon.

### Medication Schedule Display
- **Time-based grouping:** Morning / Afternoon / Evening / Bedtime sections with clear headers. Each section shows medications due in that window.
- **Taken state:** Checkmark overlay, subtle green tint on card, slightly reduced opacity (0.85) — clearly done but still readable.
- **Missed state:** Small amber dot indicator. Never red X or alarming iconography.
- **Medication icon:** Simple colored circle with first letter of medication name. Category-coded color.

## Etsy Listing Design Notes

### How This Product Should Photograph
- The adherence dashboard is the hero listing image. Show it on a laptop mockup against a clean, organized desk scene.
- Use 5-7 listing images: (1) Hero dashboard on laptop, (2) Daily medication schedule view on tablet, (3) Adherence charts close-up, (4) Refill tracking view, (5) Adding a medication flow, (6) Dark mode shot, (7) "What's included" feature summary.
- Maintain a cohesive visual identity: warm ivory backgrounds, slate blue accents, clean sans-serif overlay text.
- Product screenshots must show realistic sample data — 6-8 medications with real-sounding names (Metformin, Vitamin D3, Omega-3, Levothyroxine). Buyers need to see their reality reflected.
- This audience values function over aesthetics in listing images. Show the product WORKING, not just looking pretty.

### Differentiation from Generic Trackers
- Our interactive HTML dashboard vs. static spreadsheets = premium positioning.
- Adherence visualization (charts, calendar, percentage) vs. simple checkbox lists.
- Refill date tracking with visual countdown vs. just a date field.
- Category coding (prescription vs. supplement vs. vitamin) vs. flat lists.

### Pricing Positioning
- Interactive HTML dashboard with auto-charts and adherence tracking → premium tier ($12.99-17.99)
- Position against static PDF logs ($2-5) and basic spreadsheets ($5-8) by emphasizing: interactive, visual adherence tracking, works on any device, no app needed, no subscription.

## Reference Apps/Sites

### Etsy Sellers (What Sells)
1. **Top medication tracker spreadsheet sellers** — Auto-updating dashboards with adherence percentages, refill trackers, and expense summaries. Take: the dashboard-as-hero strategy, practical feature emphasis, clean data tables with color-coded headers.
2. **Medical binder/planner sellers** — Comprehensive health organization products that position as "bring to your doctor." Take: the serious, trustworthy positioning; the organized-section approach.
3. **Budget tracker dashboard sellers** — Closest analog for interactive data dashboards on Etsy. Take: clean grid layouts, summary cards with big numbers, progress bars, donut charts for category breakdowns.

### Real Apps (What Works as UI)
4. **Medisafe** — Market leader in medication management. Clean, restrained palette. Take: the card-based medication display, time-grouped dose schedule, the "tap to take" interaction simplicity.
5. **MyTherapy** — Strong accessibility focus. Haptic feedback on actions. Take: the way every button has both icon AND text label, the confirmation feedback on marking doses, the care taken for older users.
6. **Round Health** — Beautiful minimal design. Soft pastels instead of aggressive colors. Take: the calm color approach to reminders (no red urgency), the simple circular progress indicators, the way it reduces anxiety about medication management.

## Stable Diffusion Prompts

### Hero Mockup (Primary Listing Image)
```
Overhead flat lay of a laptop displaying a clean medication tracking dashboard with slate blue and warm ivory UI, organized desk surface with a weekly pill organizer in soft blue, a glass of water, reading glasses folded neatly, warm morning light from the side, clean warm beige linen surface, lifestyle product photography, soft depth of field, editorial style, Canon EOS R5, 35mm lens, no text overlays, Etsy listing style product photo, premium digital product mockup, organized and trustworthy aesthetic
```

### Lifestyle Scene (Secondary Listing Image)
```
Older woman's hands using a tablet showing a medication schedule interface with soft blue and green accents, sitting at a clean kitchen table, morning sunlight, ceramic coffee mug, small potted herb plant nearby, weekly pill organizer visible in background, warm neutral home setting, reading glasses on table, calm organized atmosphere, shot from slightly above, shallow depth of field, warm natural light, lifestyle photography for Etsy digital product listing, photorealistic, no face visible, mature and dignified
```

### Mobile Mockup Background (Device Mockup Scene)
```
Minimal styled flat lay background for digital product mockup, clean warm beige linen fabric with subtle texture, weekly pill organizer in soft blue tones in upper corner, a small ceramic plate with vitamin supplements, folded reading glasses, warm natural lighting from top left, generous negative space in center for device placement, overhead product photography, clean editorial Etsy listing aesthetic, warm neutral tones, organized and practical, soft natural shadows, 4K resolution
```

### Adherence Dashboard Close-up
```
Close-up photograph of a tablet screen showing a health adherence dashboard with donut charts and bar graphs in slate blue and green tones on white background, warm ambient lighting, slightly angled perspective, shallow depth of field with blurred warm background, editorial tech product photography, clean and professional, medical but approachable, Etsy listing detail image style
```

## Anti-Patterns (What to Avoid)

### Color
- **No clinical/hospital blue.** Our slate blue has warmth — never use pure cold blue (#0066CC type). This audience has spent enough time in hospitals.
- **No bright green for "healthy."** Muted, steady greens only. Neon green reads as cheap and untrustworthy.
- **No red for missed doses.** Amber/warm tones for warnings. Red triggers anxiety in people managing chronic conditions.
- **No gradient overload.** Flat, solid colors. This audience values clarity over style.
- **No pure white backgrounds.** `#FAF8F5` minimum. Pure white creates harsh contrast that strains older eyes.

### Typography
- **No thin/light font weights.** `font-weight: 400` minimum everywhere. Many users have reduced visual acuity.
- **No text smaller than 13px.** Body text at 16px. This is non-negotiable for the target demographic.
- **No fancy or decorative fonts.** System sans-serif only. Legibility is everything.
- **No low-contrast text.** WCAG AA minimum on all text. Prefer AAA for body copy.
- **No abbreviations without context.** "mg" is fine, but spell out medication names in full. Never truncate.

### Layout
- **No dense information screens.** Maximum 4-6 medications visible at once. Scroll for more. Never cram.
- **No small tap targets.** 48px minimum on everything interactive. Generous gaps between tappable elements.
- **No hidden navigation.** No hamburger menus. All primary actions visible at all times.
- **No gamification.** No streaks, points, or badges for adherence. Missing a dose is a health concern, not a game loss.
- **No hover-dependent interactions.** Many users are on tablets. Everything must work with tap only.

### Interactions
- **No auto-advancing carousels.** If content moves without user action, it's hostile to this audience.
- **No celebratory animations for taking medication.** A simple checkmark is sufficient. Medication is routine, not achievement.
- **No timed popups or dismissing alerts.** Important information must persist until the user actively acknowledges it.
- **No undo without confirmation.** If someone marks a dose as taken, don't let an accidental tap undo it without asking.

### Content
- **No infantilizing language.** "Great job!" for taking medication is patronizing. Neutral confirmation only.
- **No medical jargon.** "Take" not "administer." "Refill needed" not "prescription renewal required."
- **No assumptions about tech literacy.** Clear labels, obvious flows, no hidden gestures.
- **No weight or diet tracking integration.** This is a medication tracker. Stay focused.

### Etsy-Specific Anti-Patterns
- **No "developer side project" aesthetic.** Clean, intentional design in every screenshot.
- **No empty-state listing screenshots.** Always show realistic medication data (Metformin 500mg, Vitamin D3 2000IU, etc.).
- **No cluttered listing images.** 3-4 clear callouts per image max. This audience scans quickly.
- **No trendy/youth-oriented styling.** The design should feel mature, trustworthy, and practical — not Instagram-ready.
- **No blending in with the green/blue health tracker sea.** Our warm slate blue + amber accent palette is our differentiator. Protect it.
