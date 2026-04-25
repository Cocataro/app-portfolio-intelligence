---
name: pangram-detector
version: 1.1.0
updated: 2026-04-25
---

# pangram-detector

Pre-commit static analysis for Crossroads Inn manuscript drafts. Detects AI-fingerprint prose patterns correlated with Pangram FAIL before the chapter is submitted to the live detector.

Built by Aria Patel (Research Engineer) from JAS-58/60/63/72/78 research cycle data.

---

## Usage

```bash
python3 scripts/pre-commit-pattern-check.py path/to/chapter.md [path2.md ...]
```

Run on any draft `.md` file before Pangram submission or before committing a chapter.

**Exit codes:**
- `0` — no hits, Pangram risk: low
- `1` — one or more pattern hits detected (review before Pangram submission)
- `2` — usage or file error

**Output:** structured hit list with approximate line numbers, pattern type, and a snippet of the triggering text.

---

## Patterns detected

| ID | Pattern | Rule | Threshold | Detection method |
|----|---------|------|-----------|-----------------|
| P1 | Parallel-template across vignettes | Rule 20 | 3+ consecutive paragraphs | First-word structural template match |
| P2 | Same-subject sentence run | Rule 23 | 4+ consecutive sentences | Same pronoun/character-name opener |
| P3 | Literary-withholding bigrams | Rule 16 | Any occurrence | Static phrase list + regex |
| P4 | Emotional-aftermath interiority block | Rule 18 | 200+ words, no dialogue/action | Word-count window scan |
| P5 | Semantic-register catalog | Rule 21 | 3+ consecutive vignettes | Transaction verb + price/location + named-location |
| P6 | Named-location vignette catalog | Rule 21 ceiling | 3+ consecutive paragraphs | Named proper-noun location per short paragraph |

---

## Rule 17 — detection limitation (Phase 1)

**Rule 17 (Uninterrupted catalogs):** physical-detail sequences of 4+ sentences without an interrupt (dialogue, action, sensory-shift) are an AI pattern.

**Phase 1 cannot reliably detect Rule 17.** Determining whether consecutive short sentences describe "the same topic" requires semantic understanding (topic modeling or embedding similarity), which is out of scope for Phase 1 static analysis.

**What the script catches that overlaps Rule 17:**
- P2 catches same-*subject* runs (4+ sentences starting with the same pronoun or name) — a subset of Rule 17 violations where the catalog is clearly subject-driven
- P4 catches extended interior-only blocks (200+ words, no dialogue/action) — a broader proxy that catches some long catalog sequences

**Workaround for Rule 17:** After writing any paragraph with 4+ short sentences (< 20 words each), manually verify that at least one sentence is: (a) dialogue, (b) a physical-action verb sentence, or (c) introduces a new sensory mode (smell, sound, texture). This cannot be automated at Phase 1.

**Phase 2 proposal:** Use sentence embedding similarity (cosine > 0.85 threshold across consecutive sentence pairs) to detect topic continuity. Deferred — requires runtime dependency.

---

## Rule 23 — threshold note

Rule 23 says "3+ consecutive same-subject sentences" register as LLM action-list prose. P2 fires at 4+ to reduce false positives on intentional short-sentence fragmented prose (e.g., `"Counted heartbeats. Three. Seven. Twelve."`). The 3+ case for paragraph openers is caught by P1.

If you see a 3-sentence same-subject run that isn't caught by P1, it requires manual review. Phase 1 threshold of 4 is calibrated against the false-positive cost; reducing to 3 caused false fires on v9.2+LC clean prose in testing.

---

## Validation history

| Commit | Version | Expected | Actual | Status |
|--------|---------|----------|--------|--------|
| `74f7d51` | Prologue v8 | FAIL (literary-withholding) | FAIL — P3 ×4, P1, P5 (7 hits) | ✓ |
| `a3c5f9d` | Prologue v9.2+LC | PASS | PASS (0 hits) | ✓ |
| `36eb938` | Prologue v10 | FAIL (parallel-template) | FAIL — P1, P6 (2 hits) | ✓ |
| `c4d7229` | Prologue v10.2 | FAIL (semantic-catalog) | FAIL — P6 (1 hit) | ✓ |

All 4 pass. Validated 2026-04-25 (JAS-84).

---

## Who runs it

- **Daniel (Series Writer):** run before every commit to `Drafts/Book-1/`. Hit = do not commit. Fix the pattern, then re-run.
- **Thomas (Line/Copy Editor):** run after line/copy pass as a final structural check before Pangram gate submission.

---

## References

- Failure mode catalog: `human-character-prose-v8/references/failure-modes.md`
- Skill rules: `human-character-prose-v8/SKILL.md` (Rules 16–23)
- Research: `crossroads-manuscripts/research/pangram-experiments/`
