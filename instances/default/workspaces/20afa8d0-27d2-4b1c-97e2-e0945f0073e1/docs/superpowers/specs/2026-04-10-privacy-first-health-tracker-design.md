# Privacy-First Health Tracker — Design Spec

> Version 1.0 | 2026-04-10 | Maya Chen, CTO

## Overview

Single-file HTML health trackers sold on Etsy. Each variant targets a specific condition (PCOS, migraine, chronic pain) with pre-loaded symptoms, triggers, medications, and a tailored color theme. Customer downloads one HTML file, opens in any browser. Data never leaves their device.

## Architecture

### Build System

- **Input**: `src/` (shared HTML/CSS/JS modules) + `configs/<variant>.json` (condition-specific data)
- **Output**: Single self-contained HTML file per variant in `dist/`
- **Tooling**: Node.js `build.js` script — reads config, injects into template, outputs single file
- **No bundlers, no npm runtime dependencies**

### Variant Config Schema (`configs/<variant>.json`)

```json
{
  "variant": "pcos",
  "name": "PCOS Wellness Tracker",
  "tagline": "Track patterns. Own your data. No cloud required.",
  "theme": {
    "primary": "#8B6F8E",
    "primaryLight": "#B89FBA",
    "primaryDark": "#6A5269",
    "accent": "#C4956A",
    "background": "#FAF7F5",
    "surface": "#FFFFFF",
    "text": "#2D2A2E",
    "textSecondary": "#6B636B",
    "success": "#5A9E6F",
    "warning": "#C4956A",
    "error": "#C07070",
    "dark": {
      "background": "#1A1518",
      "surface": "#252022",
      "text": "#E8E4E8",
      "textSecondary": "#A09BA0"
    }
  },
  "symptoms": [
    "Bloating", "Cramps", "Acne", "Fatigue", "Mood swings",
    "Hair thinning", "Weight changes", "Brain fog",
    "Irregular periods", "Heavy bleeding", "Spotting",
    "Pelvic pain", "Headache", "Insomnia", "Anxiety",
    "Hot flashes", "Cravings", "Nausea"
  ],
  "triggers": [
    "Stress", "Poor sleep", "Sugar/carbs", "Dairy",
    "Skipped medication", "Dehydration", "Alcohol",
    "Intense exercise", "Sedentary day", "Weather change",
    "Hormonal cycle phase", "Caffeine"
  ],
  "medications": [
    "Metformin", "Spironolactone", "Birth control pill",
    "Letrozole", "Clomid", "Inositol", "Vitamin D",
    "Omega-3", "Berberine", "Progesterone", "Ovasitol"
  ],
  "mealOptions": ["Breakfast", "Lunch", "Dinner", "Snack"],
  "exerciseTypes": [
    "Walking", "Yoga", "Strength training", "Swimming",
    "Cycling", "HIIT", "Pilates", "Stretching", "Rest day"
  ],
  "cyclePhases": ["Menstrual", "Follicular", "Ovulatory", "Luteal"],
  "insightRules": [
    {
      "id": "sleep-symptom-correlation",
      "label": "Sleep and symptom patterns",
      "description": "Tracks whether poor sleep nights correlate with higher symptom days"
    },
    {
      "id": "trigger-frequency",
      "label": "Most common triggers",
      "description": "Ranks triggers by frequency over the selected period"
    },
    {
      "id": "cycle-symptom-map",
      "label": "Symptoms by cycle phase",
      "description": "Shows which symptoms cluster in each cycle phase"
    },
    {
      "id": "medication-adherence",
      "label": "Medication consistency",
      "description": "Tracks daily medication check-in rate"
    }
  ]
}
```

## Views (5 total)

### 1. Quick Log (Default View)

The daily entry form. One screen, fast input.

- **Date selector** (defaults to today, can navigate back)
- **Overall feeling**: 1-5 scale, emoji-based (no "good/bad" labels — use neutral descriptors: "rough", "okay", "steady", "good", "great")
- **Symptoms**: Multi-select chips from config. Severity per symptom (mild/moderate/severe). Custom symptom option.
- **Triggers**: Multi-select chips from config. Custom trigger option.
- **Medications**: Checkbox list from config. Taken/skipped toggle per med.
- **Meals**: Optional text fields per meal slot from config. No calorie counting.
- **Exercise**: Type from config + duration in minutes. Optional.
- **Cycle phase**: Single-select from config phases. Optional.
- **Sleep**: Hours (number input) + quality (1-5 scale).
- **Notes**: Free-text textarea. No character limit.
- **Save button**: Stores to localStorage keyed by date.
- Edit existing entries by navigating to that date.

### 2. Calendar View

Monthly calendar heatmap.

- Color-coded by overall feeling score (1-5 gradient using theme colors).
- Click any day to jump to Quick Log for that date.
- Dots/indicators for: symptoms logged, medication taken, exercise done.
- Month navigation (prev/next arrows).
- Legend showing color scale.

### 3. Charts View

Visual trends over configurable time ranges (7d, 30d, 90d, custom).

- **Symptom frequency bar chart**: Top 10 symptoms by occurrence count. Pure SVG bars.
- **Feeling trend line chart**: Daily feeling score over time. SVG polyline.
- **Trigger frequency**: Horizontal bar chart. SVG.
- **Sleep trend**: Line chart of hours + quality overlay.
- **Medication adherence**: Percentage bar per medication.
- All charts rendered as inline SVG — no canvas, no libraries.
- Responsive: charts scale to container width.
- Accessible: data tables available as screen-reader alternative to each chart.

### 4. Smart Insights View

Pattern detection computed client-side from localStorage data.

- **Correlation cards**: e.g., "You reported more fatigue on days after <6 hours sleep (8 of 12 times)"
- **Trigger ranking**: "Your top 3 triggers this month: Stress (9x), Poor sleep (7x), Sugar/carbs (5x)"
- **Cycle-symptom map** (if cycle data logged): "During luteal phase, you most often report: Bloating, Mood swings, Cravings"
- **Medication adherence summary**: "Metformin: taken 26/30 days (87%)"
- Minimum data threshold: Show "Log at least 7 days to see insights" placeholder until enough data exists.
- **No guilt language.** Never say "You missed..." or "You failed to...". Use neutral framing: "Logged 26 of 30 days" not "Missed 4 days".
- Insight rules driven by config `insightRules` array.

### 5. Reports View

Printable/exportable summary for sharing with healthcare provider.

- Date range selector.
- Generates a clean, printable report (CSS `@media print`).
- Sections: Summary stats, symptom frequency, medication adherence, cycle overview, feeling trend, notes highlights.
- **Print button**: triggers `window.print()`.
- **Export as text**: Copies a plain-text summary to clipboard.
- A4/Letter compatible layout.
- Medical disclaimer footer: "This report is for informational purposes only. It is not a medical diagnosis. Please consult your healthcare provider."

## Cross-Cutting Requirements

### Privacy & Storage

- **localStorage only**. Key structure: `healthtracker_<variant>_<YYYY-MM-DD>` for daily entries. `healthtracker_<variant>_settings` for user preferences.
- **Backup/Restore**: Export all data as JSON file download. Import from JSON file upload. Must round-trip perfectly.
- **Clear data**: Button in settings with double-confirmation ("Are you sure?" then "This cannot be undone").
- **Privacy footer on every view**: "Your data stays on this device. Nothing is sent anywhere."
- **Zero network requests**: No fonts, no CDNs, no analytics, no tracking pixels. Verified in DevTools Network tab.

### Accessibility (WCAG AA)

- Color contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text — in both light and dark modes.
- All interactive elements: minimum 44x44px touch targets.
- Full keyboard navigation: Tab through all controls, Enter to activate, Escape to close modals/dropdowns.
- ARIA labels on all icon-only buttons.
- Skip-to-content link.
- Screen reader: charts have accessible data table alternatives.
- Focus indicators visible in both themes.

### Dark Mode

- Respects `prefers-color-scheme: dark` by default.
- Manual toggle in header (persisted in localStorage).
- All views, charts, and print styles work in both modes.
- Print always uses light theme regardless of screen preference.

### Responsive Design

- Mobile-first. Works 320px to 1440px+.
- Touch-friendly inputs on mobile.
- Print layout is desktop-width regardless of screen size.

### File Size

- Final HTML file must be under 250KB.
- All CSS and JS inline. No external files.
- SVG charts generated at runtime, not embedded statically.

## UI Components

### Navigation

- Bottom tab bar on mobile (5 icons: Log, Calendar, Charts, Insights, Reports).
- Sidebar on desktop (>768px).
- Active tab highlighted with theme primary color.

### Settings Panel

- Accessible via gear icon in header.
- Options: Dark mode toggle, backup data, restore data, clear all data.
- Add custom symptoms, triggers, medications.

### Color Palette (PCOS variant)

- Primary: Dusty Mauve (#8B6F8E) — warm, empowering, non-clinical.
- Accent: Muted Terracotta (#C4956A) — approachable warmth, not clinical peach.
- Background: Warm Linen (#FAF7F5) — softer than stark white.
- Feeling scale: 1=muted rose, 2=muted terracotta, 3=warm gray, 4=soft sage, 5=soft green.
- Dark mode: Deep Plum-Black (#1A1518) — warm undertones throughout, not cold navy.
- Anti-patterns: No bright pink (patronizing), no clinical blue (trauma-associated), no gamification.

## Build Pipeline (`ship.js`)

Node.js script that orchestrates the full ship process:

1. **Build**: Run `build.js` for specified variant. Output to `dist/<variant>.html`.
2. **Mockup**: Use Puppeteer to screenshot key views (Quick Log, Calendar, Charts) at desktop and mobile sizes. Output to `dist/mockups/`.
3. **PDF Instructions**: Generate a 1-page PDF with: "How to use your tracker", "How to back up your data", "FAQ". Puppeteer PDF from an HTML template.
4. **Listing copy**: Generate Etsy listing description from config metadata. Output to `dist/listing-<variant>.txt`.
5. **Deploy**: `vercel deploy --prod` the `dist/` folder for preview/demo site.

## File Structure

```
project-root/
  build.js              # Build script — assembles single-file HTML
  ship.js               # Full pipeline: build + mockups + PDF + listing + deploy
  configs/
    pcos.json           # PCOS variant config
    migraine.json       # (future)
    chronic-pain.json   # (future)
  src/
    template.html       # Base HTML template with placeholders
    styles.css          # All styles (inlined during build)
    app.js              # All application logic (inlined during build)
    components/
      quick-log.js      # Quick Log view logic
      calendar.js       # Calendar view logic
      charts.js         # Charts view logic (SVG generation)
      insights.js       # Smart Insights logic
      reports.js        # Reports view logic
      settings.js       # Settings panel logic
      navigation.js     # Tab bar / sidebar navigation
      storage.js        # localStorage abstraction + backup/restore
      theme.js          # Dark mode + theme application
  dist/                 # Build output (gitignored)
    pcos.html
    mockups/
    listing-pcos.txt
  docs/
    superpowers/
      specs/
        2026-04-10-privacy-first-health-tracker-design.md  # This file
```

## Quality Gates (Acceptance Criteria)

1. File size under 250KB
2. Zero network requests in DevTools Network tab
3. Dark mode works and respects `prefers-color-scheme`
4. All buttons/inputs >= 44px touch targets
5. Keyboard navigation works (tab, enter, escape)
6. Print report renders cleanly on A4/Letter
7. Backup/restore round-trips perfectly (export then import produces identical data)
8. No guilt language anywhere in the UI
9. Privacy footer visible on every view
10. All SVG charts have accessible data table alternatives
11. WCAG AA color contrast in both light and dark modes
