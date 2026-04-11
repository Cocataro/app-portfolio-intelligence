# Health Habit Tracker — Design Spec

> **Design methodology:** Etsy marketplace research first (what sells), real app UI patterns second (what works). The product must look like it belongs among Etsy best sellers from day one.

## Etsy Marketplace Research Findings

### What Sells in Health/Habit Trackers on Etsy

**Top-selling product patterns:**
- Habit tracker bundles with auto-updating dashboards (Google Sheets/Excel) are the top performers — 300+ page bundles with daily/weekly/monthly views plus visual progress summaries. Bundles outsell single-page trackers by a wide margin. Star Seller status is common among the top listings.
- Self-care tracker spreadsheets with automatic progress tracking — buyers want to check off habits and see a visual payoff immediately. The "check it off and watch it fill in" mechanic drives satisfaction and repeat use.
- Wellness planner hybrids that combine habit tracking with mood, sleep, water, and fitness logging. Breadth = perceived value. The all-in-one approach works for the general wellness buyer, but our angle is health-specific depth, not generic breadth.
- Minimalist and boho-styled printable bundles remain strong — but interactive spreadsheet dashboards with charts command premium pricing ($12-20 vs $3-8 for static PDFs).
- The 76K/mo habit tracker market is crowded with generic products. The sellers who stand out have a specific angle: ADHD habit trackers, fitness-specific trackers, or self-care-focused trackers. Health-condition-specific habit tracking is an underserved niche.

**Mockup presentation patterns that drive sales:**
- iPad flat-lay on a styled desk — the #1 mockup style for wellness products. Warm natural backgrounds: linen, light wood, a plant, a ceramic mug. The mockup IS the brand.
- Green/nature-toned product UIs pop against warm lifestyle backgrounds. The best wellness habit trackers use sage, moss, or warm green accents on neutral backgrounds — green = growth, health, nature.
- Multi-frame carousel: lifestyle mockup first, then product screens showing the heatmap/calendar filling up, then a branded feature-list slide. Top sellers use 5-7 listing images.
- "Progress visualization" as the hero image — sellers who show a filled-in heatmap, progress bars, or completion charts as their primary listing image outperform those who show empty templates.
- Clean sans-serif typography overlays on first image: "Health Habit Tracker — Interactive Dashboard" with feature callouts.

**What separates best sellers from the rest:**
- Cohesive green/natural brand identity across all listing images. One warm green accent, generous whitespace, consistent typography.
- The visual progress payoff — heatmaps, streaks, completion percentages. Buyers want to see the "full" state, not the empty state. The GitHub contribution graph aesthetic is aspirational.
- Product screenshots that are readable at thumbnail size — large, clear headings, color-coded habit categories, visible progress indicators.
- Interactive dashboards with auto-calculations are the premium tier — progress bars that fill, charts that update, completion rates that calculate. This is our exact product format.
- Condition-specific pre-loaded content (not just blank templates) signals expertise and saves buyer effort.

**Etsy color trends for habit/wellness products (2025-2026):**
- Sage green and warm green are the dominant accents in wellness habit trackers. Green = growth, renewal, health — it's the natural choice for this category.
- Warm cream/off-white backgrounds replacing pure white as the premium base. Natural warmth signals "designed with care."
- Earthy complements: warm tan, soft brown, muted gold as secondary accents. Think forest floor, not sports field.
- Top performers use a single green accent on neutral backgrounds. Never neon. Never saturated. Muted, warm, natural.

### Competing Interactive Dashboard Sellers (Cross-Category Learning)

**Self-care tracker spreadsheets (SavvyandThriving, top sellers):**
- 4.8-star average with thousands of reviews. Self-care checklists with auto-tracking dashboards. The "check it off" mechanic is addictive.
- Key lesson: daily completion rate displayed prominently = motivation without gamification. It's data, not a streak counter shaming you.

**Habit tracker bundles with 300+ pages:**
- Star Seller items with massive scope. Monthly, weekly, daily views plus goal-setting pages.
- Key lesson: multiple time-horizon views (daily check → weekly summary → monthly overview → yearly heatmap) create perceived value and justify premium pricing.

**Budget tracker dashboards (presentation reference):**
- These have the best visual presentation on Etsy. Bold accent on neutral background — high-contrast data visualizations on calm surfaces. Progress rings and sparklines for trends.
- Key lesson: the dashboard overview is always the hero image. The heatmap calendar filling up with green is our equivalent of a budget chart filling up.

## Mood Board Description

A fresh morning garden — green things growing, steady sunlight, the quiet satisfaction of tending something daily. Not a gym. Not a productivity app. This tracker is for people who know that taking their supplements, doing their stretches, and drinking enough water IS the hard work when you're managing a chronic condition.

The interface rewards consistency without punishing absence. The GitHub-style heatmap calendar is the emotional anchor: each green square is a small, visible proof that you showed up for yourself today. The warmth comes from natural greens and creamy backgrounds — not synthetic or sporty, but organic and grounded.

When shown in Etsy listing mockups, the product should look like something a naturopathic nutritionist would recommend — professional enough to take seriously, warm enough to feel personal. At thumbnail size, the green heatmap filling up should be immediately legible as "progress I can see."

## Color Palette

### Light Mode
- **Primary:** `#5B8C5A` — Moss Green (warm, natural green — growth without clinical associations. Reads as "health" on Etsy without being generic)
- **Primary Light:** `#8DB88C` — Soft Sage (hover states, selected items, heatmap mid-intensity, gentle highlights)
- **Primary Dark:** `#3D6B3C` — Deep Forest (active states, pressed buttons, heatmap high-intensity, strong emphasis)
- **Background:** `#F9F7F3` — Warm Cream (warm off-white — reads as premium in mockups, natural, not sterile)
- **Surface:** `#FFFFFF` — White (cards, modals, elevated surfaces)
- **Surface Alt:** `#F0EDE6` — Soft Sand (alternating rows, section breaks — gives visual rhythm like natural linen)
- **Border:** `#E0DBD2` — Warm Stone (card borders, dividers — warm gray, not cold)
- **Text Primary:** `#2A2D26` — Deep Bark (near-black with warm green undertone — feels intentional, organic)
- **Text Secondary:** `#5E6358` — Olive Gray (secondary text, labels, timestamps)
- **Text Muted:** `#95998F` — Lichen (placeholders, disabled text, muted labels)
- **Accent Warm:** `#C4944A` — Amber Gold (CTAs, important badges, streak highlights — warm complement to green)
- **Accent Rose:** `#B87070` — Dusty Rose (missed/incomplete indicators — gentle, not alarming)
- **Heatmap Empty:** `#EBE8E1` — Pale Sand (no activity — blends with surface, not punishing)
- **Heatmap Low:** `#C5DBC4` — Pale Mint (1-2 habits done — visible progress)
- **Heatmap Mid:** `#8DB88C` — Soft Sage (3-4 habits done — clear engagement)
- **Heatmap High:** `#5B8C5A` — Moss Green (most habits done — satisfying completion)
- **Heatmap Full:** `#3D6B3C` — Deep Forest (all habits done — the gold star square)

### Dark Mode
- **Primary:** `#8DB88C` — Soft Sage (elevated for dark-on-dark contrast)
- **Primary Light:** `#B0D4AF` — Pale Sage (hover, selected)
- **Primary Dark:** `#5B8C5A` — Moss Green (pressed, strong emphasis)
- **Background:** `#171A15` — Deep Forest-Black (warm green undertone, not cold gray-black)
- **Surface:** `#1E221C` — Dark Moss (cards, elevated surfaces)
- **Surface Alt:** `#262B24` — Muted Forest (section breaks)
- **Border:** `#363D34` — Dark Lichen
- **Text Primary:** `#E8EBE6` — Pale Sage White
- **Text Secondary:** `#A8AEA3` — Muted Olive
- **Text Muted:** `#6B7268` — Dark Lichen
- **Accent Warm:** `#D4A65E` — Light Amber
- **Accent Rose:** `#C88080` — Soft Rose
- **Heatmap Empty:** `#252A23` — Dark Earth (no activity)
- **Heatmap Low:** `#2E3F2D` — Dark Mint (faint progress)
- **Heatmap Mid:** `#3D6B3C` — Deep Forest (moderate)
- **Heatmap High:** `#5B8C5A` — Moss Green (strong)
- **Heatmap Full:** `#8DB88C` — Soft Sage (maximum — glows on dark background)

## Typography Notes

- **Font stack:** System fonts — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Clean and human. System stack renders well in screenshots and across devices.
- **Headings:** `font-weight: 600` (semibold). Letter-spacing: `-0.01em`. Headings must be large enough to read at Etsy thumbnail size. Warmer tone than General variant — this is encouraging, not clinical.
- **Body:** `font-weight: 400`, `line-height: 1.6`, `font-size: 15px` base (larger than typical 14px — fatigue-friendly for chronic condition users).
- **Labels/Captions:** `font-weight: 500`, `font-size: 12px`, `letter-spacing: 0.02em`. Use sentence case labels, not uppercase — this is a nurturing tool, not a command center.
- **Numbers/Data:** `font-variant-numeric: tabular-nums` for aligned columns. `font-weight: 600` for completion percentages and habit counts. Large summary numbers (28-32px) for dashboard completion rate — the hero metric.
- **Habit names:** `font-weight: 500`, `font-size: 14px`. Readable, scannable. These are the daily touchpoint — they must be comfortable to read quickly.
- **Emotional tone:** Encouraging but never pushy. "3 of 5 complete" not "You missed 2!" Sentence case everywhere.

## Component Style Notes

### Buttons
- **Primary:** `background: var(--primary)`, `color: white`, `border-radius: 10px`, `padding: 12px 24px`. Subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`. Hover: lighten 8%. Rounded and friendly.
- **Secondary:** `background: transparent`, `border: 1.5px solid var(--primary-light)`, `color: var(--primary)`.
- **Habit check button:** `width: 44px`, `height: 44px`, `border-radius: 10px`. Unchecked: `border: 2px solid var(--border)`, `background: var(--surface)`. Checked: `background: var(--primary)`, white checkmark, subtle scale animation. Large, satisfying tap targets.
- **Touch targets:** Minimum 44px height. Chronic condition users may have tremors, fatigue, or reduced dexterity.

### Cards
- `border-radius: 14px`. `border: 1px solid var(--border)`. `padding: 20px`. Max `box-shadow: 0 1px 4px rgba(0,0,0,0.04)`. Cards = natural paper, not plastic.
- **Habit category cards:** Left-border accent `border-left: 3px solid var(--category-color)` for at-a-glance scanning. Categories: Morning Routine, Supplements, Movement, Hydration, Evening Wind-Down, etc.
- **Dashboard cards:** Slightly larger padding (24px), subtle background tint using `var(--surface-alt)`. The heatmap and completion ring live here — hero elements for listing screenshots.
- **Daily log card:** Clean checklist layout. Each habit row: checkbox + habit name + optional note icon. No clutter.

### Heatmap Calendar (Key Visual — The Selling Point)
- **GitHub-style contribution graph** — 52 columns (weeks) × 7 rows (days). Each cell is a rounded square.
- Cell size: `14px × 14px` with `3px` gap. `border-radius: 3px`.
- Five intensity levels: empty → low → mid → high → full, using the heatmap color scale.
- Intensity = percentage of daily habits completed. Not binary — partial completion counts.
- Month labels above: `font-size: 11px`, `var(--text-muted)`. Day labels left: Mon/Wed/Fri only (reduce visual noise).
- **Hover tooltip:** "Mon, Mar 5 — 4/5 habits (80%)" — informative, not judgmental.
- **This is the hero image for Etsy listings.** A filled heatmap with natural green gradient is immediately aspirational and legible at thumbnail size.
- No empty/zero days highlighted in red or any alarming color. Empty = neutral sand. Absence is normal, not failure.

### Completion Ring (Dashboard Hero)
- Large circular progress ring: `120px` diameter on dashboard. `stroke-width: 10px`. Rounded stroke caps.
- Center: large number "78%" in `font-size: 32px`, `font-weight: 600`, `var(--primary-dark)`.
- Below: "this week" or "today" label in `var(--text-muted)`.
- Ring color: gradient from `var(--heatmap-low)` to `var(--heatmap-full)` based on fill.
- This pairs with the heatmap as the two dashboard hero elements.

### Habit Presets (Condition-Specific Differentiator)
- Pre-loaded habit sets per condition: PCOS Daily Habits, Migraine Prevention Habits, Chronic Pain Management, Fibro-Friendly Routine, Endo Self-Care.
- Preset selector: pill-shaped category buttons. `border-radius: 20px`, `padding: 8px 16px`. Selected: `background: var(--primary-light)`, `border: 1.5px solid var(--primary)`.
- Users can customize after selecting a preset — the preset is a starting point, not a cage.

### Inputs / Sliders
- Text inputs: `border-radius: 8px`, `border: 1.5px solid var(--border)`, `padding: 12px 16px`. Focus: `border-color: var(--primary)`, `box-shadow: 0 0 0 3px rgba(91,140,90,0.12)`.
- Habit toggles: large checkboxes, not sliders. Binary daily habits (done/not done) are simpler than severity scales. This tracker is about consistency, not measurement.

### Charts / Data Visualization
- **Heatmap is the primary chart.** It replaces line charts as the main visualization. Everything else is secondary.
- Weekly bar chart: horizontal bars showing daily completion count. `border-radius: 6px`. Green fill on cream background. Clean, simple.
- Category breakdown: small donut chart showing habit completion by category (Morning: 90%, Supplements: 75%, Movement: 60%). Color-coded by category accent.
- Trend sparkline: small (40x20px) in dashboard summary cards. Green line, no fill. Shows 30-day habit consistency trend.
- Grid lines: `var(--border)` at 40% opacity. Background, not foreground.

### Navigation
- Bottom tab bar: 5 tabs max. Active = `var(--primary)` icon + label. Inactive = `var(--text-muted)`.
- Active indicator: `3px` rounded dot beneath icon. Matches the organic feel.
- Suggested tabs: Today (daily checklist), Calendar (heatmap view), Insights (charts), Habits (manage/customize), Settings.

## Etsy Listing Design Notes

### How This Product Should Photograph
- The heatmap calendar is the hero listing image. Show it on a tablet mockup with a filled green heatmap against a warm natural background — light wood desk, small potted plant, ceramic mug of green tea.
- Use 5-7 listing images: (1) Hero heatmap dashboard on device, (2) Daily checklist view showing ease of use, (3) Condition-specific habit presets, (4) Insights/charts view, (5) Calendar heatmap close-up showing green squares filling in, (6) Dark mode shot, (7) "What's included" branded summary slide.
- Maintain cohesive visual identity: warm green + cream palette, natural props, clean sans-serif overlay text.
- **Show the product FULL, not empty.** A heatmap with 80%+ green squares is aspirational and beautiful. An empty heatmap is meaningless.
- Natural props only: plants, wood, linen, ceramic, tea. No tech accessories, no clinical items. This is a wellness tool that lives in your morning routine.

### Pricing Positioning
- Interactive HTML dashboard with heatmap + auto-charts → premium tier ($14.99-19.99)
- Position against generic habit tracker printables ($3-8) by emphasizing: health-specific presets, interactive heatmap, auto-calculating insights, works on any device, no app needed.
- The condition-specific angle justifies premium: "Built for people managing chronic conditions — not just another generic habit tracker."

## Reference Apps/Sites

### Etsy Sellers (What Sells)
1. **SavvyandThriving self-care tracker spreadsheets** — 4.8 stars, thousands of reviews, consistent Star Seller. Take: the daily checklist mechanic with auto-updating completion dashboards, the "check it off and watch it fill in" satisfaction loop, clean green-on-neutral presentation.
2. **Habit tracker bundle sellers (300+ page bundles)** — Star Seller items with massive scope and premium pricing. Take: the multi-view approach (daily → weekly → monthly → yearly), the perception of value through comprehensiveness, how time-horizon stacking justifies premium pricing.
3. **Budget tracker dashboard sellers** — The gold standard for visual data presentation on Etsy. Take: bold accent on neutral background, progress rings as hero images, how a dashboard "hero shot" communicates product value at thumbnail scale.

### Real Apps (What Works as UI)
4. **Finch** — Self-care habit tracker with gentle, nurturing UI. No penalties for missing days. Take: the "no guilt" philosophy, warm and encouraging tone, nature-growth aesthetic (your habits help something grow), the way it makes daily tasks feel like care rather than obligation.
5. **Streaks** — Minimal, beautiful habit tracking with circular progress indicators. Take: the clean circle-filling mechanic, how visual completion feels rewarding, 78 color themes showing how a single accent color defines the whole experience.
6. **GitHub Contribution Graph** — The original heatmap calendar. Take: the exact grid layout (52 weeks × 7 days), intensity-based color scale, how a year of activity becomes a single glanceable visual, the aspirational "fill it up" motivation.
7. **Bearable** — Best-in-class symptom tracking with habit correlation. Take: the way it connects habits to health outcomes ("on days you walked, pain was 20% lower"), making habit data meaningful rather than just decorative.

## Stable Diffusion Prompts

### Hero Mockup (Primary Listing Image)
```
Overhead flat lay of an iPad displaying a health habit tracker dashboard with green heatmap calendar and completion ring on warm cream UI, on a natural light wood desk, small potted succulent, ceramic mug of green tea, linen napkin, morning window light casting soft shadows, warm green and cream color palette, lifestyle product photography, soft depth of field, clean editorial style, Canon EOS R5, 50mm lens, no text overlays, Etsy listing style product photo, premium digital product mockup, natural and organic feel
```

### Lifestyle Scene (Secondary Listing Image)
```
Woman's hands holding a tablet showing a daily health habit checklist with green checkmarks and soft sage accents, sitting at a kitchen table by a sunny window, morning light, wearing a cream linen shirt, small herb pot on windowsill, wooden cutting board nearby, cup of herbal tea steaming, natural light wood surface, fresh and hopeful domestic setting, shot from slightly above, shallow depth of field, warm natural color temperature, lifestyle photography for Etsy digital product listing, photorealistic, no face visible
```

### Mobile Mockup Background (Device Mockup Scene)
```
Minimal styled flat lay background for digital product mockup, natural light linen fabric in warm cream, small potted rosemary plant in upper corner, wooden coaster with ceramic cup, dried sage bundle loosely placed, warm morning light from top left, generous negative space in center for device placement, overhead product photography, clean editorial Etsy listing aesthetic, warm natural green and cream tones, soft organic shadows, 4K resolution
```

## Anti-Patterns (What to Avoid)

### Color
- **No neon or saturated green.** Lime green, Kelly green, and "sports app" green are wrong. Muted, warm, natural greens only — moss, sage, forest.
- **No clinical blue.** Blue = hospital = not our brand. Green is our territory.
- **No gradient overload.** The heatmap intensity scale IS the gradient. Everything else is flat color.
- **No pure white backgrounds.** `#F9F7F3` minimum. Pure white reads as "template" not "designed."
- **No red for missed days.** Red = failure = guilt. Empty days are neutral sand color. Absence is normal.

### Typography
- **No thin/light font weights.** Chronic condition users often have fatigue and brain fog. `font-weight: 400` minimum.
- **No tiny text.** Minimum 12px, prefer 14-15px for body. Must be readable in listing screenshots.
- **No ALL CAPS for habit names.** Sentence case everywhere. This is a nurturing daily companion, not a drill sergeant.

### Layout
- **No information overload on daily view.** Show today's habits as a simple checklist. 5-8 items max visible without scrolling. Progressive disclosure for detail.
- **No streak counters.** Streaks punish absence. Show completion percentage and heatmap instead — they celebrate presence without shaming absence.
- **No gamification.** No points, badges, levels, XP, leaderboards. Chronic illness is not a game. Taking your supplements IS the achievement.
- **No smiley face scales.** Infantilizing. The habit is binary: done or not done. Clean checkmarks.
- **No cramped layouts.** Generous padding and spacing. The product must breathe — and must screenshot well for Etsy listings.

### Interactions
- **No animations that can't be disabled.** Many chronic condition users have motion sensitivity.
- **No celebratory confetti/sounds.** A gentle checkmark animation is the ceiling. No fireworks for taking vitamins.
- **No social sharing prompts.** Health habits are private.
- **No guilt-based language.** Never "You missed 3 habits!" Always "3 of 5 complete today." Frame positively or neutrally, never negatively.

### Content
- **No toxic positivity.** No "wellness warrior," no "crush your goals!" The tone is quiet encouragement: "You showed up today. That counts."
- **No fitness-bro energy.** This is for people managing chronic conditions, not training for a marathon. Movement might mean "gentle 10-minute walk," not "leg day."
- **No diet culture.** Hydration tracking yes. Calorie counting no. "Ate a nourishing meal" not "stayed under 1500 cal."
- **No assumption of ability.** Pre-loaded habits must be achievable by someone having a bad symptom day. "Take medication" and "drink water" are habits. "1-hour gym session" is not.

### Etsy-Specific Anti-Patterns
- **No "developer side project" aesthetic.** If the heatmap looks like a raw GitHub profile, redesign. It needs to feel warm and designed, not technical.
- **No inconsistent spacing.** Etsy buyers judge quality by visual consistency — uneven padding screams amateur.
- **No empty-state screenshots in listings.** Always show the heatmap with 70-80% green fill. Empty heatmaps communicate nothing.
- **No generic "habit tracker" positioning.** We are a "Health Habit Tracker for Chronic Conditions." The specificity IS the selling point.
- **No more than 3 fonts or 5 colors in listing images.** Cohesive brand identity: green + cream + dark text. That's it.
