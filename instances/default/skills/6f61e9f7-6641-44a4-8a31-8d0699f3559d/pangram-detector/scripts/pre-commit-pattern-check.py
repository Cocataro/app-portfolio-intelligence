#!/usr/bin/env python3
"""
pre-commit-pattern-check.py

Six-pattern AI-fingerprint detector for Crossroads Inn manuscripts (JAS-78).
Flags prose patterns correlated with Pangram FAIL based on JAS-58/60/63/72 cycle analysis.

Usage:
  python pre-commit-pattern-check.py path/to/chapter.md [path2.md ...]

Output: hit list with approximate paragraph and line numbers; exits non-zero if any hits.

Exit codes:
  0 — no hits
  1 — one or more patterns detected (Pangram risk)
  2 — usage/file error

Patterns:
  1. Parallel-template across vignettes (Rule 20) — 3+ consecutive paragraphs with the
     same opening word (when that word is a structural preposition/pronoun) AND the same
     capitalization structure on word 2. Catches "In [Town]..." × 3 runs and
     "She [action]..." × 3 paragraph openers.

  2. Same-subject sentence run (Rule 23) — 4+ consecutive sentences within a paragraph
     that all start with the same pronoun or character name. Catches mechanical
     subject-repetition catalogs. Does NOT flag intentional fragmented prose style.

  3. Literary-withholding bigrams — specific banned phrases from JAS-60 research:
     meta-commentary on inability to name/feel, vague-duration constructions,
     identity-collapse rhetoric. Deliberately narrow to avoid flagging normal prose.

  4. Emotional-aftermath interiority blocks — 200+ word span with no dialogue and no
     physical-action verbs. Use as a prompt for human review, not automatic rejection.

  5. Semantic-register catalogs (Rule 21) — 3+ consecutive short paragraphs that each
     contain an explicit transaction verb (sold, offered, paid, bought) together with
     either a named price (copper/silver/gold) or a commercial location marker (farrier,
     stall, shop, merchant). Catches the four-town armor-sale catalog (v9 FAIL) while
     correctly passing the collapsed "in other towns" summary (v9.2+LC PASS).

  6. Named-location vignette catalog (Rule 21 semantic ceiling) — 3+ consecutive short
     paragraphs that each reference a specific named location, regardless of whether
     explicit transaction verbs are present. Catches the v10.2 ceiling case where syntax
     variation broke P5 but the semantic catalog structure persisted. Correctly passes
     v9.2+LC where the middle section is collapsed into a generic "other towns" summary.

Failure modes P5 and P6 cannot detect (require human review):
  - Rule 22 (Expansion regression): expanding a compressed section that re-creates a
    previously-fixed catalog pattern. Requires git diff comparison, not text analysis.
  - Departure-scene rhythm if sentences span multiple paragraphs (caught by P1 if
    3+ consecutive "She..." paragraph openers, not caught if fewer than 3 paragraphs).

See references/failure-modes.md in the human-character-prose skill for full catalog.
"""

import re
import sys
from pathlib import Path
from typing import NamedTuple


# ──────────────────────────────────────────────────────────────────────────────
# Data types
# ──────────────────────────────────────────────────────────────────────────────

class Hit(NamedTuple):
    pattern_id: int
    pattern_name: str
    para_num: int       # 1-indexed paragraph where the hit starts
    line_num: int       # 1-indexed approximate line number in the file
    description: str
    snippet: str        # ≤120 chars of the triggering text


# ──────────────────────────────────────────────────────────────────────────────
# Text preprocessing
# ──────────────────────────────────────────────────────────────────────────────

def strip_frontmatter(text: str) -> str:
    """Remove leading YAML frontmatter block delimited by --- lines."""
    if not text.startswith("---"):
        return text
    parts = re.split(r"(?m)^---\s*$", text, maxsplit=2)
    return parts[2].lstrip("\n") if len(parts) >= 3 else text


SCENE_BREAK_RE = re.compile(r"^[*⁂\s]+$")


def split_paragraphs(text: str) -> list[tuple[int, str]]:
    """
    Split text into (line_num, paragraph_text) pairs.
    Blank-line-delimited; scene-break lines (⁂, * * *) are discarded.
    line_num is the 1-indexed line where the paragraph starts.
    """
    result = []
    lines = text.split("\n")
    current_lines: list[str] = []
    start_line = 1

    for i, line in enumerate(lines, start=1):
        blank_or_break = line.strip() == "" or SCENE_BREAK_RE.match(line)
        if blank_or_break:
            if current_lines:
                para = "\n".join(current_lines).strip()
                if para and not SCENE_BREAK_RE.match(para):
                    result.append((start_line, para))
                current_lines = []
            start_line = i + 1
        else:
            if not current_lines:
                start_line = i
            current_lines.append(line)

    if current_lines:
        para = "\n".join(current_lines).strip()
        if para and not SCENE_BREAK_RE.match(para):
            result.append((start_line, para))

    return result


def word_count(text: str) -> int:
    return len(text.split())


def split_sentences(text: str) -> list[str]:
    """Rough sentence splitter on . ! ? followed by space or end-of-string."""
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def snip(text: str, maxlen: int = 120) -> str:
    t = text.replace("\n", " ").strip()
    return t[:maxlen] + ("…" if len(t) > maxlen else "")


def _line_to_para(line_num: int, paras: list[tuple[int, str]]) -> int:
    """Return 1-indexed paragraph number for a given line number."""
    for i, (start, _) in enumerate(paras):
        next_start = paras[i + 1][0] if i + 1 < len(paras) else float("inf")
        if line_num < next_start:
            return i + 1
    return len(paras)


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 1 — Parallel-template across vignettes
# ──────────────────────────────────────────────────────────────────────────────
#
# Detect 3+ consecutive paragraphs whose opening word is a structural
# preposition/article AND whose second word has the same capitalization pattern.
# The "In [Town]..." catalog (e.g. In Thornwall / In Bracken / In Ashford) fires
# because: first_word="in" (structural) and second_word_is_proper=True in all three.
#
# Intentional repetition of sentence-level subjects (like "She packed... She paid...
# She walked...") is captured here if 3+ consecutive paragraphs share an opener.
# The threshold of 3 is calibrated so that 2-paragraph "She did X. She did Y."
# transitions don't fire.

_STRUCTURAL_OPENERS = frozenset({
    "in", "at", "by", "on", "through", "before", "after", "when", "and", "but",
    "she", "he", "they", "it", "the", "a", "an",
})


def _para_opener(para: str) -> tuple[str, bool]:
    """
    (first_word_lower, second_word_is_proper_noun)
    Proper noun heuristic: second token starts [A-Z][a-z]{1,} (not all-caps/abbrev).
    """
    tokens = para.split()
    first = tokens[0].lower().strip(".,;:!?\"'\u201c\u201d") if tokens else ""
    prop = False
    if len(tokens) >= 2:
        sec = tokens[1].strip(".,;:!?\"'\u201c\u201d")
        prop = bool(re.match(r"^[A-Z][a-z]{1,}", sec))
    return (first, prop)


def check_parallel_template(paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    n = len(paras)
    i = 0
    while i < n:
        opener = _para_opener(paras[i][1])
        fw = opener[0]
        if fw not in _STRUCTURAL_OPENERS:
            i += 1
            continue
        j = i + 1
        while j < n and _para_opener(paras[j][1]) == opener:
            j += 1
        run_len = j - i
        if run_len >= 3:
            prop_tag = " [ProperNoun]" if opener[1] else ""
            hits.append(Hit(
                pattern_id=1,
                pattern_name="Parallel-template across vignettes",
                para_num=i + 1,
                line_num=paras[i][0],
                description=(
                    f"{run_len} consecutive paragraphs open with "
                    f"'{fw}{prop_tag}...' (paras {i+1}–{j})"
                ),
                snippet=snip(paras[i][1]),
            ))
            i = j
        else:
            i += 1
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 2 — Same-subject sentence run
# ──────────────────────────────────────────────────────────────────────────────
#
# Within a paragraph: 4+ consecutive sentences that ALL start with the same
# PRONOUN or PROPER NAME (not articles like "the/a/an", not prepositions).
# Targets mechanical subject-repetition catalogs:
#   "She sold X. She sold Y. She sold Z. She sold W." → fire
# Does NOT fire on intentional short-sentence prose style:
#   "The scar on his face. The thread was too thick. The needle borrowed." → no fire
#   "Counted heartbeats. Three. Seven. Twelve." → no fire (different starters)
#   "She put the pen down. Looked at it. Picked it up." → no fire (mixed starters)
#
# A dialogue sentence always interrupts a run.
# First-word must be a pronoun or capitalized proper name (≥4 chars) to trigger.
#
# LIMITATION: does not catch same-subject runs where the subject is implicit.
# Use Pattern 1 to catch cross-paragraph structural templates instead.

SAME_SUBJECT_RUN_MIN = 4

# Only these first-word types trigger Pattern 2.
# Articles (the, a, an), prepositions (in, at, by...), conjunctions are excluded
# because they are common intentional prose openers not linked to AI fingerprint.
_P2_TRIGGER_WORDS = frozenset({
    "she", "he", "they", "it", "we", "i",
    "briar", "karn", "veylan", "hale", "marten", "wren",  # character names
})

_DIALOGUE_MARK_RE = re.compile(r'["\u201c\u201d]')


def _sentence_first_word(s: str) -> str:
    tokens = s.split()
    return tokens[0].lower().strip(".,;:!?\"'\u201c\u201d") if tokens else ""


def check_same_subject_run(paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    for para_idx, (line_num, para) in enumerate(paras):
        sentences = split_sentences(para)
        n = len(sentences)
        i = 0
        while i < n:
            if _DIALOGUE_MARK_RE.search(sentences[i]):
                i += 1
                continue
            fw = _sentence_first_word(sentences[i])
            # Only trigger on pronouns / character names — not articles/prepositions
            if fw not in _P2_TRIGGER_WORDS:
                i += 1
                continue
            j = i + 1
            while j < n:
                if _DIALOGUE_MARK_RE.search(sentences[j]):
                    break
                if _sentence_first_word(sentences[j]) != fw:
                    break
                j += 1
            run_len = j - i
            if run_len >= SAME_SUBJECT_RUN_MIN:
                run_text = " ".join(sentences[i:j])
                hits.append(Hit(
                    pattern_id=2,
                    pattern_name="Same-subject sentence run",
                    para_num=para_idx + 1,
                    line_num=line_num,
                    description=(
                        f"{run_len} consecutive sentences opening with '{fw}' "
                        f"(pronoun/name repeat — no dialogue interrupt)"
                    ),
                    snippet=snip(run_text),
                ))
            i = j if j > i else i + 1
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 3 — Literary-withholding bigrams (JAS-60 banned phrases)
# ──────────────────────────────────────────────────────────────────────────────
#
# Only the specific constructions identified in JAS-58/60/63 cycle analysis as
# Pangram fingerprints. Deliberately narrow — false positives here are worse than
# false negatives because writers will distrust the tool.
#
# NOT included: "getting fanciful" (dialogue line present in v9.2+LC ship baseline
# which scores 0.000 Human — confirmed not a Pangram trigger).
# NOT included: generic "without [verb]ing" — this is normal English prepositional
# syntax. Only the specific cognitive-withholding form is flagged.

_BANNED_LITERAL = [
    ("she couldn't have said",    "meta-inability-to-name (cut; render the physical instead)"),
    ("she could not have said",   "meta-inability-to-name (cut; render the physical instead)"),
    ("couldn't have said what",   "meta-inability-to-name"),
    ("could not have said what",  "meta-inability-to-name"),
    ("the quiet went on",         "vague-duration phrase (name a specific sound or elapsed detail)"),
    ("blurred together",          "elapsed-time vagueness (name one specific town or event)"),
    ("towns that blurred",        "elapsed-time vagueness (name one specific town or event)"),
    ("for a long time",           "vague-duration phrase (specify: three days, until the fire died, etc.)"),
    ("and had no explanation",    "meta-observation undercuts the image — just cut the phrase"),
    ("questions she hadn't asked","meta-commentary on attention — cut; show where attention went"),
    ("questions she had not asked","meta-commentary on attention — cut; show where attention went"),
]

# Pattern-based: regex (case-insensitive)
_BANNED_PATTERNS = [
    # Identity-collapse rhetoric: "She was not X. She was."
    (
        r"\bshe was not [\w\s,]+\.\s+she was\b",
        "identity-collapse rhetoric ('She was not X. She was.') — cut; show physical action",
    ),
    # Cognitive withholding: "without knowing/feeling/noticing/understanding..."
    (
        r"\bwithout (knowing|feeling|noticing|understanding|realizing|recognizing|comprehending|seeing it|hearing it)\b",
        "cognitive-withholding construction — replace with specific physical/sensory detail",
    ),
    # "Not [noun]. [Name/pronoun] knew [noun]." — inference labeling
    (
        r"\bnot \w+\.?\s+(she|he|they|briar|karn|veylan)\s+knew\s+\w+",
        "inference labeling ('Not X. [Name] knew X.') — cut; trust the reader to infer",
    ),
]

_BANNED_LITERAL_RE = [
    (re.compile(re.escape(phrase), re.IGNORECASE), label)
    for phrase, label in _BANNED_LITERAL
]
_BANNED_PATTERN_RE = [
    (re.compile(pat, re.IGNORECASE), label)
    for pat, label in _BANNED_PATTERNS
]


def check_literary_withholding(raw_body: str, paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    lines = raw_body.split("\n")
    for line_idx, line in enumerate(lines, start=1):
        for rx, label in _BANNED_LITERAL_RE:
            if rx.search(line):
                hits.append(Hit(
                    pattern_id=3,
                    pattern_name="Literary-withholding bigram",
                    para_num=_line_to_para(line_idx, paras),
                    line_num=line_idx,
                    description=f"Banned phrase — {label}",
                    snippet=snip(line.strip()),
                ))
        for rx, label in _BANNED_PATTERN_RE:
            if rx.search(line):
                hits.append(Hit(
                    pattern_id=3,
                    pattern_name="Literary-withholding bigram",
                    para_num=_line_to_para(line_idx, paras),
                    line_num=line_idx,
                    description=f"Banned pattern — {label}",
                    snippet=snip(line.strip()),
                ))
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 4 — Emotional-aftermath interiority blocks
# ──────────────────────────────────────────────────────────────────────────────
#
# Flag 200+ word spans with no dialogue and no physical-action verbs.
# Pangram reads extended interiority blocks as AI-register narration.
#
# LIMITATION: some interior reflection is intentional and craft-correct. Use
# this as a human-review prompt. A single hit here does not require a rewrite;
# a hit in a passage that already failed Pangram is the actionable case.
#
# NOT a pass/fail gate on its own — flag and review.

INTERIORITY_BLOCK_WORDS = 200

# Physical verbs that break interiority (character interacts with world)
_PHYSICAL_RE = re.compile(
    r"\b(stepped|step|walked|walk|ran|run|bolted|grabbed|grab|pull|pulled|"
    r"push|pushed|lift|lifted|turn|turned|stood|sit|sat|rose|fell|drop|dropped|"
    r"threw|caught|struck|hit|knock|knocked|shook|shaken|drew|draw|raised|raise|"
    r"lowered|reached|reach|placed|place|set|laid|lay|open|opened|close|closed|"
    r"shut|slammed|press|pressed|lit|light|poured|drank|drink|ate|eat|picked|pick|"
    r"put|said|ask|asked|replied|answer|answered|called|shouted|whispered|nodded|"
    r"shrugged|looked|look|watched|watch|heard|hear|moved|move|carried|carry|"
    r"brought|bring|took|take)\b",
    re.IGNORECASE,
)

_DIALOGUE_RE = re.compile(r'["\u201c\u201d]')


def check_interiority_block(paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    n = len(paras)
    i = 0
    while i < n:
        _, para = paras[i]
        has_dialogue = bool(_DIALOGUE_RE.search(para))
        has_physical = bool(_PHYSICAL_RE.search(para))

        if has_dialogue or has_physical:
            i += 1
            continue

        # Interior paragraph — accumulate run
        block_start = i
        block_wc = word_count(para)
        j = i + 1
        while j < n:
            _, next_p = paras[j]
            if _DIALOGUE_RE.search(next_p) or _PHYSICAL_RE.search(next_p):
                break
            block_wc += word_count(next_p)
            j += 1

        if block_wc >= INTERIORITY_BLOCK_WORDS:
            block_text = " ".join(p for _, p in paras[block_start:j])
            hits.append(Hit(
                pattern_id=4,
                pattern_name="Emotional-aftermath interiority block",
                para_num=block_start + 1,
                line_num=paras[block_start][0],
                description=(
                    f"{block_wc}-word interior block (paras {block_start+1}–{j}) "
                    "with no dialogue and no physical-action verbs — human review required"
                ),
                snippet=snip(block_text),
            ))

        i = j if j > i else i + 1
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 5 — Semantic-register catalogs
# ──────────────────────────────────────────────────────────────────────────────
#
# Flag 3+ consecutive paragraphs that are each a "standalone transaction vignette":
#   - Short (≤ VIGNETTE_MAX_WC words)
#   - Contains an explicit transaction verb (sold, offered, paid, bought)
#   - Contains a named price (copper/silver/gold) OR a commercial location marker
#     (farrier, stall, shop, merchant)
#
# This catches the v9 four-town armor-sale catalog:
#   "In Thornwall she sold... Eight coppers."   → sold + coppers → YES
#   "In Bracken she sold... Three coppers."     → sold + coppers → YES
#   "The pauldrons went... He paid a silver."   → paid + silver  → YES
#   "She sold the breastplate... two silvers."  → sold + silvers → YES
#   → 4 consecutive → FAIL
#
# Correctly passes v9.2+LC where the Bracken/Ashford paragraphs are collapsed
# into "The gauntlets and pauldrons went in other towns. A woman at a market stall
# tried the left one...":
#   → no transaction verb (sold/offered/paid/bought) → NOT a vignette → run breaks
#
# KNOWN LIMITATION: does not catch the v10.2 ceiling case where vignettes have
# varied syntactic openers, implicit prices, and no explicit transaction verb
# in all paragraphs (e.g. "Four coppers." as a standalone sentence with no verb,
# or "bought it anyway" with no price stated). That failure mode requires human
# review; see the failure-modes section of human-character-prose skill.

VIGNETTE_MAX_WC = 90

_TRANSACTION_VERB_RE = re.compile(
    r"\b(sold?|sell|sells|offered?|offer|paid|pay|pays|bought|buy|buys)\b",
    re.IGNORECASE,
)

_PRICE_RE = re.compile(
    r"\b(copper|coppers|silver|silvers|gold|coin|coins)\b",
    re.IGNORECASE,
)

_COMMERCIAL_LOCATION_RE = re.compile(
    r"\b(farrier|stall|shop|merchant|trader|smithy|market)\b",
    re.IGNORECASE,
)

# A specific named location: case-insensitive "in/at/to" followed DIRECTLY by a
# capitalized proper-noun word (≥3 lowercase chars after the capital).
# Excludes: "in other towns" ("other" lowercase → no match)
# Includes: "In Thornwall" / "in Millhaven" / "In Bracken" / "to Ashford"
# Also matches "^[CapWord]." at paragraph start (e.g. "Ashford. A guard...")
_NAMED_LOC_RE = re.compile(
    r"(?:"
    r"\b(?:in|at|to)\b [A-Z][a-z]{2,}"   # "in Thornwall", "In Bracken" (word-bounded)
    r"|^[A-Z][a-z]{2,}[.,]"               # "Ashford." at paragraph start
    r")",
    re.MULTILINE | re.IGNORECASE,
)

# Exclude generic summary phrases from named-location detection:
# "in other X", "in many X", "in several X" etc. with lowercase quantifier.
_GENERIC_LOC_RE = re.compile(
    r"\bin (other|many|several|various|different|a few|some)\b",
    re.IGNORECASE,
)


def _is_transaction_vignette(para: str) -> bool:
    """
    A standalone commercial vignette paragraph:
    1. Short (≤ VIGNETTE_MAX_WC words)
    2. Has an explicit transaction verb (sold, offered, paid, bought)
    3. Has a price indicator OR commercial noun
    4. References a specific named location — excludes generic summary phrases
       like "in other towns" which break the vignette sequence

    The location requirement is what distinguishes individual-transaction paragraphs
    (v9's "In Thornwall she sold…", "In Bracken she sold…") from summary paragraphs
    (v9.2+LC's "The gauntlets and pauldrons went in other towns…").
    """
    if word_count(para) > VIGNETTE_MAX_WC:
        return False
    if not _TRANSACTION_VERB_RE.search(para):
        return False
    if not (_PRICE_RE.search(para) or _COMMERCIAL_LOCATION_RE.search(para)):
        return False
    # Must have a specific named location AND not be a generic summary
    if not _NAMED_LOC_RE.search(para):
        return False
    if _GENERIC_LOC_RE.search(para):
        return False
    return True


def check_semantic_catalog(paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    n = len(paras)
    i = 0
    while i < n:
        if _is_transaction_vignette(paras[i][1]):
            j = i + 1
            while j < n and _is_transaction_vignette(paras[j][1]):
                j += 1
            run_len = j - i
            if run_len >= 3:
                hits.append(Hit(
                    pattern_id=5,
                    pattern_name="Semantic-register catalog",
                    para_num=i + 1,
                    line_num=paras[i][0],
                    description=(
                        f"{run_len} consecutive transaction-vignette paragraphs "
                        f"(short + transaction verb + price/location) — paras {i+1}–{j}"
                    ),
                    snippet=snip(paras[i][1]),
                ))
            i = j if j > i else i + 1
        else:
            i += 1
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Pattern 6 — Named-location vignette catalog (Rule 21 semantic ceiling)
# ──────────────────────────────────────────────────────────────────────────────
#
# Catches the v10.2 failure mode: 3+ consecutive short paragraphs each referencing
# a specific named location (proper noun after in/at, or paragraph-starting proper
# noun like "Ashford. A guard..."), even when explicit transaction verbs are absent.
#
# P5 missed v10.2 because the vignettes used varied syntactic openers and some
# lacked explicit "sold/paid/bought/offered" verbs. But the SEMANTIC structure —
# four separate short paragraphs each about a distinct named-location transaction —
# remained, and Pangram continued to flag the section at fraction_ai 0.128.
#
# Why this passes v9.2+LC:
#   The middle section is collapsed: "The gauntlets and pauldrons went in other
#   towns." — "other towns" is a generic summary (caught by _GENERIC_LOC_RE).
#   Only Thornwall and Millhaven remain as named-location vignettes, separated by
#   the generic-summary paragraph that breaks the consecutive run. Run length = 1.
#
# Historical test results (verified after P6 added):
#   v9       → FAIL (P1 + P5 + P6: armor-sale catalog vignettes)
#   v9.1     → FAIL (P5 + P6: armor catalog still present; disbanding fixed)
#   v9.2+LC  → PASS (run breaks on "other towns" summary paragraph)
#   v10      → FAIL (P1 + P6: catalog persists despite different openers)
#   v10.1    → FAIL (P6: 3 remaining named-loc vignettes still consecutive)
#   v10.2    → FAIL (P6: 4 named-loc vignettes; all openers varied, no P5 trigger)
#
# NOTE on _NAMED_LOC_RE: the existing _NAMED_LOC_RE uses re.IGNORECASE, which
# makes [A-Z] match any letter — causing false positives when used alone (without
# the transaction-verb filter of P5). P6 uses _NAMED_LOC_PROPER_RE instead: a
# case-sensitive version where [A-Z] strictly requires an uppercase first letter.

# Case-sensitive named-location regex for P6.
# Uses inline flag (?i:...) on the prepositions only so "In/in/AT/at/To/to" all
# match, while [A-Z] remains case-sensitive (requires actual uppercase letter).
_NAMED_LOC_PROPER_RE = re.compile(
    r"(?:"
    r"(?i:in|at|to)\s+([A-Z][a-z]{2,})"  # "in Thornwall", "In Bracken", "at Ashford"
    r"|^([A-Z][a-z]{2,})[.,]"              # "Ashford." / "Thornwall," at paragraph start
    r")",
    re.MULTILINE,  # NO global IGNORECASE — preserves [A-Z] uppercase requirement
)


def _is_named_location_vignette(para: str) -> bool:
    """
    A short paragraph (≤ VIGNETTE_MAX_WC words) that references a specific named
    location — a proper noun directly after a preposition (in/at/to), or a proper
    noun at paragraph start followed by punctuation (e.g. "Ashford. A guard...").
    Generic summaries ("in other towns") are excluded.
    Used to detect the semantic catalog structure regardless of syntactic variation.
    """
    if word_count(para) > VIGNETTE_MAX_WC:
        return False
    if not _NAMED_LOC_PROPER_RE.search(para):
        return False
    if _GENERIC_LOC_RE.search(para):
        return False
    return True


def check_named_location_catalog(paras: list[tuple[int, str]]) -> list[Hit]:
    hits = []
    n = len(paras)
    i = 0
    while i < n:
        if _is_named_location_vignette(paras[i][1]):
            j = i + 1
            while j < n and _is_named_location_vignette(paras[j][1]):
                j += 1
            run_len = j - i
            if run_len >= 3:
                hits.append(Hit(
                    pattern_id=6,
                    pattern_name="Named-location vignette catalog",
                    para_num=i + 1,
                    line_num=paras[i][0],
                    description=(
                        f"{run_len} consecutive short named-location paragraphs "
                        f"(paras {i+1}–{j}) — semantic catalog structure regardless "
                        f"of syntactic variation. Collapse into summary or add "
                        f"non-location-specific paragraphs between vignettes."
                    ),
                    snippet=snip(paras[i][1]),
                ))
            i = j if j > i else i + 1
        else:
            i += 1
    return hits


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def run_checks(path: Path) -> list[Hit]:
    raw = path.read_text(encoding="utf-8")
    body = strip_frontmatter(raw)
    paras = split_paragraphs(body)

    all_hits: list[Hit] = []
    all_hits += check_parallel_template(paras)
    all_hits += check_same_subject_run(paras)
    all_hits += check_literary_withholding(body, paras)
    all_hits += check_interiority_block(paras)
    all_hits += check_semantic_catalog(paras)
    all_hits += check_named_location_catalog(paras)

    return sorted(all_hits, key=lambda h: (h.line_num, h.pattern_id))


def main() -> int:
    args = sys.argv[1:]
    if not args:
        sys.stderr.write(__doc__ + "\n")
        return 2

    paths = [Path(a) for a in args]
    missing = [p for p in paths if not p.is_file()]
    if missing:
        for p in missing:
            sys.stderr.write(f"ERROR: file not found: {p}\n")
        return 2

    total_hits = 0
    for path in paths:
        hits = run_checks(path)
        total_hits += len(hits)

        if not hits:
            print(f"PASS {path.name} — no pattern hits")
            continue

        print(f"FAIL {path.name} — {len(hits)} hit(s):")
        for h in hits:
            print(
                f"  [P{h.pattern_id}] line~{h.line_num} para {h.para_num}: "
                f"{h.pattern_name}"
            )
            print(f"    {h.description}")
            print(f"    >>> {h.snippet}")
        print()

    if total_hits > 0:
        print(
            f"Total: {total_hits} hit(s) across {len(paths)} file(s). "
            f"Review before Pangram submission."
        )
        return 1

    print(f"Total: 0 hits across {len(paths)} file(s). Pangram risk: low.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
