# FRESH-NAV-FIX.md - Navigation & Filter Fixes

## Issues Found

### 1. Missing Filter System for Thoughts/Pitches Sections

**Problem:** The complexity filter buttons (`//complexity`) only exist in the **Research** section. When users navigate to Thoughts or Pitches sections via stats tiles, there is **no equivalent filter UI** available.

**Current state:**
- Research section: Has filter buttons (ALL, BEGINNER, INTERMEDIATE, ADVANCED, ENTERPRISE)
- Thoughts section: NO filters
- Pitches section: NO filters

**Expected:** Users clicking "4 thoughts" or "5 pitches" stats tiles should see filter options in those sections too.

### 2. Wiki Stats Tiles - Potential Race Condition

**Problem:** Wiki stats tiles use `onclick="wikiApp && wikiApp.showSection('section')"`. If JavaScript fails to load or `wikiApp` initialization is delayed, the click may not work.

**Suggested fix:** Add fallback `href="#section"` as primary link, keep onclick as enhancement.

## Proposed Fixes

### Fix 1: Add Filter Row to Thoughts/Pitches Sections

Add this HTML after the `archive-meta` div in `#thoughts` and `#pitches` sections:

```html
<div class="filters-row">
    <div class="filter-group">
        <span class="filter-label">//status</span>
        <button class="cyber-filter-btn active" data-filter="all">ALL</button>
        <button class="cyber-filter-btn" data-filter="research">RESEARCH</button>
        <button class="cyber-filter-btn" data-filter="pending">PENDING</button>
        <button class="cyber-filter-btn" data-filter="implemented">IMPLEMENTED</button>
    </div>
</div>
```

Then update `renderThoughts()` and `renderPitches()` to add status classes to entry cards.

### Fix 2: Improve Wiki Stats Tile Reliability

Change wiki stats tiles from:
```html
<a href="#research" class="stat-box clickable" onclick="wikiApp && wikiApp.showSection('research'); return true;">
```

To:
```html
<a href="#research" class="stat-box clickable" onclick="wikiApp && wikiApp.showSection('research');">
```

(Remove `return true;` to allow fallback href to work if JS fails)

## Priority

1. **HIGH** - Add filters to Thoughts/Pitches (user expectation mismatch)
2. **LOW** - Wiki stats tile reliability (works in most cases currently)
