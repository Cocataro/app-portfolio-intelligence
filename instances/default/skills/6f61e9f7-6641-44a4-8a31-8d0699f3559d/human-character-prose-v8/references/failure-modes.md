# Pangram Failure Modes — Crossroads Inn Prose

**Source:** JAS-58 / JAS-60 / JAS-63 / JAS-72 / JAS-78 research cycle, Aria Patel (Research Engineer).
**Version:** 1.0 — 2026-04-25.
**Detector reference:** `pre-commit-pattern-check.py` in `pangram-detector` skill catches patterns 1–6 below. Pattern 7 requires human review.

---

## FM-1 — Parallel syntactic template across vignettes

**What it is:** 3+ consecutive paragraphs share the same grammatical opening template — same first word (preposition, pronoun, or article) AND same capitalization pattern on the second word.

**Canonical example (v9 FAIL at fraction_ai 0.108):**
```
In Thornwall she sold the greaves to a farrier...
In Bracken she sold the gauntlets to a woman...
In Ashford, a guard held the pauldron...
```
All three open with `In [ProperNoun]`. Pangram reads this as a structural LLM template.

**Fix:** Vary the syntactic position of the location marker. "She sold the greaves in Thornwall, to a farrier..." breaks the template while keeping the information.

**Script detection:** P1 (`check_parallel_template`). Commit SHAs: `412a23a` (v9.1 fix — broke Bracken/Ashford syntax). Full clear at `668ba9a` (v9.2 — departure-scene fix).

---

## FM-2 — Same-subject sentence run

**What it is:** 4+ consecutive sentences within a paragraph that all begin with the same pronoun or character name (not articles or prepositions). The mechanical repetition of `She did X. She did Y. She did Z. She did W.` registers as LLM template generation.

**Canonical example (v9 disbanding scene):**
```
She turned away. (She) ... She did not watch them go. She listened...
```
Three consecutive paragraphs all opening with `She` (caught by P1 as cross-paragraph parallel template). Same-sentence versions at 4+ consecutive sentences trigger P2.

**Fix:** Vary sentence subjects. Use noun references (`The commander`, `Karn`), break with a dialogue fragment, or restructure as a mixed-subject paragraph.

**Script detection:** P2 (`check_same_subject_run`), threshold 4 sentences. Cross-paragraph version caught by P1. Note: intentional short-sentence fragmented prose style (`"Counted heartbeats. Three. Seven. Twelve."`) does NOT trigger P2 because subjects vary.

---

## FM-3 — Literary withholding

**What it is:** Meta-commentary on the narrator's (or character's) inability to name, feel, or describe something. Pangram reads this as an AI default: instead of naming the specific thing, the text comments on the withholding. Identified in Q1 of JAS-60 comparative benchmark analysis.

**Canonical examples (v7 failing window, fraction_ai = 1.000 in isolation):**
- `"she couldn't have said what they were"` — meta-inability-to-name
- `"towns that blurred together"` — elapsed-time vagueness
- `"the quiet went on for a long time"` — vague-duration placeholder
- `"She was not listening. She was."` — identity-collapse rhetoric

**Benchmark contrast:** B&B, Cerulean Sea, L&L, IW name the specific dog at the specific address, note that the maul is missing, give the specific house number. They do not withhold and comment on the withholding.

**Fix:** Replace with the specific thing, or cut entirely. `"towns that blurred together"` → name one town and cut the summary.

**Script detection:** P3 (`check_literary_withholding`). Banned phrases are deliberately narrow — false positives are worse than false negatives here. "Getting fanciful" is NOT banned (confirmed not a Pangram trigger at v9.2+LC which scored 0.000 Human).

---

## FM-4 — Emotional-aftermath interiority block

**What it is:** A 200+ word span with no dialogue and no physical-action verbs. Extended interiority — grief, confusion, interior processing — without any grounding in physical-world interaction reads as AI-register narration.

**Risk signal:** Not an automatic fail, but a human-review prompt. A hit in a passage that already has elevated `fraction_ai` is the actionable case. A hit in otherwise clean prose may be intentional.

**Fix:** After 150 words of interior reflection, add one of: (a) a character physical action, (b) a sensory intrusion from outside the scene, (c) a single-word dialogue fragment, (d) an unexpected observation that breaks the interiority.

**Script detection:** P4 (`check_interiority_block`). Exits 1 (same as other patterns) but label says "human review required."

---

## FM-5 — Semantic-register catalog (transaction verbs + price/location)

**What it is:** 3+ consecutive short paragraphs (≤90 words each) that each contain an explicit transaction verb (`sold`, `offered`, `paid`, `bought`) AND either a named price (`copper`, `silver`, `gold`) or a commercial-location noun (`farrier`, `stall`, `shop`, `merchant`).

**Canonical example (v9 armor-sale catalog, fraction_ai flagged at 1.000 in the window):**
```
In Thornwall she sold the greaves...  Eight coppers.
In Bracken she sold the gauntlets... Three coppers.
The pauldrons went... He paid a silver.
She sold the breastplate... two silvers.
```

**Correctly passes v9.2+LC:** The Bracken/Ashford vignettes were collapsed: `"The gauntlets and pauldrons went in other towns. A woman at a market stall tried the left gauntlet..."` — no explicit transaction verb → not a catalog vignette → run breaks.

**Script detection:** P5 (`check_semantic_catalog`). Known limitation: does NOT catch the FM-6 ceiling case.

---

## FM-6 — Named-location vignette catalog (semantic-register ceiling)

**What it is:** 3+ consecutive short paragraphs (≤90 words each) that each reference a specific named location — a proper noun directly after a preposition (`in Thornwall`, `at Ashford`) or a proper noun at paragraph start followed by punctuation (`Ashford. A guard...`). Transaction verbs may or may not be present. The SEMANTIC structure of separate named-location vignettes is the trigger, not the specific syntax.

**Why FM-5 misses this:** FM-5 requires explicit transaction verbs in all paragraphs. After v10.2's syntactic fixes (all four vignettes using different openers), some paragraphs no longer had explicit `sold/paid/offered/bought` — but the four-named-location-vignette structure persisted and Pangram continued to score Mixed at fraction_ai 0.128.

**Canonical example (v10.2 FAIL at fraction_ai 0.128):**
```
She sold the greaves in Thornwall, to a farrier...      ← "in Thornwall"
The left gauntlet went in Bracken. A woman...           ← "in Bracken"
Ashford. A guard held a pauldron...                     ← "Ashford." at start
```
Three consecutive short named-location paragraphs → P6 fires.

**Correctly passes v9.2+LC:** The middle section is `"The gauntlets and pauldrons went in other towns."` — "other towns" is a generic summary, not a named location. Only Thornwall and Millhaven remain as named-location paragraphs, separated by the generic paragraph. Run of 1 → no fire.

**Fix:** Collapse vignettes into a single summary paragraph using a generic location reference (`"in other towns"`), then give one named example in full. Do NOT attempt to fix syntactic openers — the semantic structure is the trigger.

**Script detection:** P6 (`check_named_location_catalog`). Added JAS-78.

---

## FM-7 — Expansion regression

**What it is:** A previously-fixed catalog pattern re-emerges when compressed prose is expanded. When v9.2+LC collapsed four armor-sale vignettes into "in other towns" summary prose, the Pangram score cleared to 0.000. When v10 expanded the Bracken/Ashford vignettes back into standalone paragraphs (even with new beats), the catalog signature returned.

**Why it can't be auto-detected:** Expansion regression is a property of the diff relative to a known-passing baseline, not a property of the text in isolation. The expanded v10 text doesn't "look wrong" on its own — it only fails because the vignette structure was reintroduced.

**Workaround:** Before expanding any compressed section that previously scored as a Pangram window, run `pre-commit-pattern-check.py` on the new version. If P5 or P6 fires in the expanded section, the expansion has regressed.

**Script detection:** NOT automatically detected. Human review required. Run the script after any expansion of a previously-compressed catalog section.

---

## Pattern detection matrix

| Failure mode | Pattern ID | Script detection | Gate |
|---|---|---|---|
| FM-1: Parallel syntactic template | P1 | Automatic | Hard fail (exit 1) |
| FM-2: Same-subject sentence run | P2 | Automatic (≥4 sentences) | Hard fail |
| FM-3: Literary withholding | P3 | Automatic (narrow banned list) | Hard fail |
| FM-4: Emotional-aftermath interiority | P4 | Automatic (≥200 words) | Review prompt |
| FM-5: Semantic-register catalog | P5 | Automatic | Hard fail |
| FM-6: Named-location vignette catalog | P6 | Automatic | Hard fail |
| FM-7: Expansion regression | — | Not detectable | Human review |

---

## Historical commit reference

| Version | Commit | Pangram score | Script result |
|---|---|---|---|
| Prologue v9 | `4ae7bbe` | 0.108 Mixed (FAIL) | FAIL (P1+P5) |
| Prologue v9.1 | `c25eda5` | 0.088 Human† (BLOCKED) | FAIL (P5) |
| Prologue v9.2 | `668ba9a` | 0.000 Human (PASS) | PASS |
| Prologue v9.2+LC | `a3c5f9d` | 0.000 Human (PASS) | PASS |
| Prologue v10 | `36eb938` | 0.133 Mixed (FAIL) | FAIL (P1+P6) |
| Prologue v10.1 | `79f4040` | 0.128 Mixed (FAIL) | FAIL (P6) |
| Prologue v10.2 | `c4d7229` | 0.128 Mixed (FAIL) | FAIL (P6) |

† v9.1 scored Human at the overall level but still had one high-confidence AI window; gate blocked pending departure-scene fix.

All commits are in `crossroads-manuscripts` repository.
