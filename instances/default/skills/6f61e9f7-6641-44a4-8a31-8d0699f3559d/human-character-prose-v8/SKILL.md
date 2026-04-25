---
name: human-character-prose
version: 9
description: Complete reference manual for writing prose and building characters that read as human-authored fiction. Two references — (1) write-human prose guide covering surface tells, deep tells, dialogue, POV, character, scene construction, rhythm, time, humor, and prose music; (2) character-psychology manual covering wound/public-self/private-self/blind-spot/self-deception architecture, behavior patterns, relationships, trauma/grief/shame/love/loneliness/anger dynamics, and Crossroads-Inn-specific character work. Used by Daniel for drafting, Eleanor for dev-edit, Thomas for line-copy QA, Margaret for EIC ratification. Paired with `pangram-detector` for ship-ready gating. v8 adds four Pangram-validated protocol rules from JAS-60 comparative benchmark research. v9 adds four catalog/structural failure-mode rules (20-23) from JAS-60/63/72 cycle analysis, plus references/failure-modes.md cataloging 7 concrete failure patterns with commit-level evidence.
---

# Human-Character-Prose

Everything needed to draft, edit, and ratify human-feeling prose for *The Crossroads Inn*. Split into two references — use both.

## When to use

- **Daniel** — read both references before drafting any chapter. Apply the condensed protocol in your `AGENTS.md`; look up specific patterns in the references when a situation needs judgment.
- **Eleanor (Dev Editor)** — use the character-psychology manual as your framework for dev-edit letters. Surface character-logic problems by reference to wound / public-vs-private-self / blind-spot.
- **Thomas (Line/Copy Editor)** — use the write-human prose guide's Part One (surface tells) + Part Seven (rhythm) as your line-edit checklist. Part Thirteen's 20-step Quick Reference Scan runs after your pass.
- **Margaret (EIC)** — use both as your ratification framework. Ship-ready requires: detector passes (per `pangram-detector`), character logic holds (per character-psychology manual), prose reads human (per write-human prose guide).

## What this replaces + what it doesn't

**Replaces / supersedes:**
- Cozy-specific craft rules in `cozy-craft-library` and `cozy-fantasy-rubric` — residual after the 2026-04-24 Heartland Fantasy repositioning. Those skills retain utility for world-building norms but their voice rules defer to this skill.
- Informal craft language in `_SHARED.md` — if this skill's language contradicts `_SHARED.md`, this skill wins for prose-level decisions.

**Does NOT replace:**
- `pangram-detector` — statistical-register detector, different axis. Good craft does not guarantee good detector score. AI-Assisted target is the detector gate; this skill is the craft gate.
- `ai-fingerprint-audit` — internal 10-dimension rubric Thomas uses during line-copy. Overlaps with this skill's Part One but stays separate.
- `pangram-beating-research` — Aria's research loop. Different owner, different purpose.
- `scene-composition` — outline-to-scene-brief. Upstream of drafting, not replaced.

## Two references

### 1. [references/write-human.md](references/write-human.md)
The prose manual. Thirteen parts covering surface tells (fix on sight), deep tells (require a different understanding), dialogue, POV, character, scene construction, rhythm, time, physical world, humor, what-prose-knows-that-characters-don't, the Daniel Standard, and a 20-step Quick Reference Scan.

Read before every draft. Apply condensed protocol. Use for judgment calls.

### 2. [references/character-psychology.md](references/character-psychology.md)
The character manual. Eight parts covering architecture of a real person (wound / public-self / private-self / flaw-they-cannot-see / self-deception / fear-not-want / avoiding-what-they-need / repeating-patterns / specific-cowardice / inexplicable-actions / unkindness-to-loved-ones / slow-change), how people relate (history / power dynamics / projection / indirect communication / testing / incomplete-forgiveness), specific psychology (trauma / grief / shame / love / loneliness / anger / decisions-under-pressure), and Crossroads Inn specifics (the inn as psychological space / found-family-is-earned / Briar / Veylan / secondary characters).

Read before writing any character's third appearance. Complete the APPENDIX profile template per character before the third scene.

## Condensed protocol (top 15 for Daniel's AGENTS.md)

Daniel's `AGENTS.md` carries these 15 rules as the pre-loaded working protocol. The full references are for lookup when a situation needs more than a rule.

1. **Ban named feelings.** No "sadness," "fear," "joy" as nouns. Render the body.
2. **Fear > desire as motivator.** For every significant decision, identify what the character is afraid of. That fear drives the behavior.
3. **One named emotion maximum per scene.** If you must name one, pick the most important.
4. **Character-specific verbs, not safe ones.** "Bolted," "clipped across" — not "walked quickly."
5. **One adjective per noun.** Two means the noun is wrong. Find a better noun.
6. **First detail of any space is the unexpected one.** Not the establishing shot.
7. **Enter scene 2 beats late. Exit 2 beats early.**
8. **Once per chapter: a character does something they cannot fully explain.** Don't caption it.
9. **Once per chapter: a character is wrong about their own emotional state.** Don't correct it.
10. **Once per chapter: a character is unkind to someone they love.** Not fully wrong, not fully right.
11. **Specific cowardice.** Every primary character has one thing they cannot make themselves do.
12. **The thing unresolved at scene end.** Don't close emotional loops cleanly.
13. **Subtext is the point.** What's not being said is the real scene.
14. **Body before mind.** In revelation or dread, the body responds one beat before conscious understanding.
15. **Primary emotion under anger.** When a character is angry, name the underlying fear/grief/shame/hurt. Render the anger; let the reader feel the primary emotion.

These 15 are compression. Read the full references when a scene needs more than rule-following.

## v8 Protocol Additions — JAS-60 Benchmark Research (commit 7bec7c1)

**Added 2026-04-25. Source: Aria Patel's comparative analysis of 4 benchmark books (B&B, Cerulean Sea, L&L, IW) against our Prologue v7 failing window. Pangram confirmed fraction_ai = 0.000 on all benchmark passages using these patterns. Our v7 failing window scored fraction_ai = 1.000 in isolation.**

**Research files:** `crossroads-manuscripts/research/comparative-analysis/q1-armor-sale-equivalents.md`, `q2-benchmark-catalog-audit.md`, `q3-scale-test.md`, `synthesis.md`

**Why these rules exist:** The zero-inference register is correct in its prohibitions. But in practice it drifted toward *literary withholding* — meta-commenting on the inability to name things rather than naming them. Pangram detects literary withholding as an AI fingerprint. Human authors (Baldree, Klune, Cogman) are **prosaic** in emotional beats: they name the specific dog at the specific address. They note that the maul is missing. They don't withhold — they specify, then move on. The Q3 split test confirmed this is structural (localized to elapsed-time and emotional-aftermath beats), not a scale/accumulation problem.

---

**Rule 16 — Literary withholding banned.**

Meta-commentary on inability to name or describe is an AI fingerprint. Delete it; replace with the specific thing.

- `"she couldn't have said what they were"` → name what they were, or cut the sentence
- `"towns that blurred together"` → name one town; cut the generalization
- `"the quiet went on for a long time"` → cut; stop at the last footstep
- `"She was not listening. She was."` → cut; write what she was doing with her body

**Rule 17 — Uninterrupted catalogs banned.**

Physical-detail sequences of 4+ sentences without an interrupt are an AI pattern. Catalogs are not banned — uninterrupted catalogs are. After 3–4 descriptive sentences, insert one of: (a) a character physical action, (b) a sound or smell intruding from outside the visual sequence, (c) a dialogue fragment (even one word), or (d) an unexpected observation that breaks subject continuity. 13 of 15 catalog instances in benchmark books use this structure.

**Rule 18 — Emotional-aftermath scenes require sensory mixing.**

Any emotional-aftermath scene (grief, confusion, being alone) exceeding 150 words must contain at least 3 sensory modes. If a scene is touch-dominant, add one sound-specific sentence and one smell-specific sentence. Single-mode sensory sequences are an AI pattern.

**Rule 19 — Name elapsed time via specific detail, not summary.**

Elapsed time stated directly is correct (`"Six months"` is fine). What follows must be filled with specific named things — one town, one named event, one specific object — not generalizing summaries. `"towns that blurred together"` is the AI-default for "this happened repeatedly." Replace with specificity; let the reader infer repetition.

---

## v9 Protocol Additions — JAS-60/63/72 Structural Failure Modes (commit TBD)

**Added 2026-04-25. Source:** Aria Patel's analysis of v9/v10 Prologue failure cycle. All four rules address structural catalog patterns that persist even after rule-16-19 prose improvements. Failure modes documented with commit-level evidence in `references/failure-modes.md`. Pre-commit detection in `pangram-detector/scripts/pre-commit-pattern-check.py` (P1/P2/P5/P6).

---

**Rule 20 — Parallel syntactic template banned across vignettes.**

3+ consecutive paragraphs sharing the same grammatical opening template are an AI structural fingerprint. This includes pronoun-driven paragraph runs ("She..." × 3) AND location-template runs ("In [Town]..." × 3).

- Vary the syntactic position of the location or action across consecutive paragraphs
- If you write two "She..." paragraphs in a row, ensure the third opens differently
- Check with `pre-commit-pattern-check.py` P1 before Pangram submission

Historical evidence: v9 `4ae7bbe` FAIL (P1 + P5); v9.1 `c25eda5` cleared P1 only.

**Rule 21 — Semantic-register catalog ceiling: collapse, don't vary syntax.**

When a section has 3+ named-location vignettes in sequence (e.g., separate short paragraphs for Thornwall, Bracken, Ashford, Millhaven), varying the syntactic opener is insufficient. The semantic catalog structure — separate paragraphs, each about a named-location transaction — triggers Pangram regardless of syntax.

The correct fix is structural: **collapse** the catalog into a single summary paragraph using a generic reference ("in other towns"), then give ONE named example in full. Do NOT try to fix by rewording each opener.

- P5 (`check_semantic_catalog`) catches explicit transaction-verb catalogs
- P6 (`check_named_location_catalog`) catches the semantic ceiling case — 3+ consecutive short paragraphs each naming a specific location, even without explicit transaction verbs

Historical evidence: v10.1 `79f4040` FAIL at fraction_ai 0.128 despite Bracken syntax fix; v10.2 `c4d7229` FAIL at fraction_ai 0.128 despite all-four-opener variation.

**Rule 22 — Expansion regression: run the script before re-expanding compressed prose.**

When you expand a section that previously failed Pangram and was then compressed to pass (e.g., collapsing four vignettes into a summary paragraph), re-expanding it risks re-creating the catalog pattern. The expanded text may look fine in isolation but fail because the structure was reintroduced.

- Before expanding any compressed section that previously scored as a Pangram window, run `pre-commit-pattern-check.py` on the new version
- If P5 or P6 fires in the expanded section, the expansion has regressed regardless of how the syntax differs from the original failure

Historical evidence: v9.2+LC `a3c5f9d` PASS at 0.000 Human; v10 `36eb938` FAIL at 0.133 Mixed after Bracken/Ashford expansion.

**Rule 23 — Departure-scene rhythm parallelism: vary subject and structure.**

3+ consecutive short same-subject sentences in the departure/transition beat — "She packed the saddlebag. She paid the innkeeper. She rode through the gate." — register as LLM action-list prose even without a catalog marker.

- Break the run with: a sensory intrusion, an unexpected object detail, a physical friction beat (something doesn't work as expected), or a dialogue fragment
- Check for 3+ consecutive "She..." paragraph openers (caught by P1) and 4+ consecutive "She..." sentence openers within a paragraph (caught by P2)

Historical evidence: v9.1 `c25eda5` cleared armor-catalog but departure scene remained; v9.2 `668ba9a` fixed saddlebag/innkeeper/gate → PASS at 0.000 Human.

---

## 8 inputs required (currently pending)

Both references defer to series-specific inputs that Daniel needs but can't generate himself. Board has delegated these to Margaret + Eleanor + Thomas on JAS-{next}. Until delivered, Daniel applies generic craft; series-specific work ratchets up once inputs land:

1. **Series image vocabulary** — recurring images, thresholds, objects, sensory details specific to Crossroads Inn (Margaret)
2. **"Jason" voice fingerprint** — 3-5 pages of annotated house-voice examples from existing ship-ready prose (Margaret)
3. **Character verbal tics** — one per primary character (Eleanor + Margaret)
4. **Character perceptual filters** — what each POV is trained by history to notice (Eleanor)
5. **Character blind spots** — what each primary character cannot see about themselves (Eleanor)
6. **Off-page character lives** — one ongoing off-page thread per recurring secondary (Eleanor + Margaret)
7. **Chapter emotional-context notes** — 1-3 sentence temperature note before each chapter (Margaret)
8. **Object history list** — 5-10 recurring objects, their histories (Margaret + Thomas)

Board approves each input as drafted. No pen-holding required from Board — these are distillation tasks from existing prose + canonical character bible.

## Standard (the test, not the checklist)

From the write-human guide Part Twelve + character manual Part Seven. Copied verbatim below because it's the north star:

**Chapter passes when:**
- Eleanor marks at least one line in pencil — a sentence that reached for something beyond the clean landing
- Margaret puts it down for a moment — not because something bad happened, because something landed
- Readers stay up past when they should have stopped
- One detail pays off the reader didn't see coming
- The character continues to exist in the reader's mind after the last page

**Chapter fails when:**
- Nothing was worth marking in pencil
- Every emotional loop closed
- No character did anything inexplicable
- The reader closed the book and the character stopped existing

The 15 condensed rules are the floor. The v8 rules (16–19) are the detector gate. The standard is the ceiling. The work is everything between.
