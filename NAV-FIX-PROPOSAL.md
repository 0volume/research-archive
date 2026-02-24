# Navigation Fix Proposal

**Date:** 2026-02-24  
**Workspace:** `/root/.openclaw/workspace-research-agent/`

---

## Executive Summary

After analyzing both the LIVE sites and local code, I've identified the root causes of the navigation issues. The clickable stats tiles **DO work** - but there are UX/UI problems that make them appear broken.

---

## What IS Working ✅

### Archive (index.html)
1. **Stats tiles ARE clickable** - `onclick="showSection('research'); return true;"` is present
2. **showSection() function exists and works** - properly toggles `.section.active` classes
3. **Data loads successfully** from GitHub:
   - `data/research.json` - ✅ loads
   - `data/thoughts.json` - ✅ loads (4 entries)
   - `data/pitches.json` - ✅ loads (5 entries)
4. **Sidebar navigation links** - work via hash handling
5. **Complexity filters** - work correctly
6. **Search** - works correctly

### Wiki (wiki/index.html)
1. **Stats tiles** in sidebar - show animated counts from topics.json
2. **Topic cards** - clickable, navigate to `?topic={slug}`
3. **Search & filters** - work correctly

---

## What ISN'T Working ❌

### Issue 1: Clickable Stats Tiles - UX Problem

**Why they appear broken:**
1. **Visual feedback missing** - No hover effect or cursor change on stat boxes
2. **The href="#" conflicts** - Both `href="#research"` AND `onclick` exist, causing potential hash conflicts
3. **No active state indication** - User can't tell which section is active from the stats tiles

**Root cause in code:**
```html
<a href="#research" class="stat-box clickable" onclick="showSection('research'); return true;">
```

The `return true` helps but the hash still gets added to URL.

### Issue 2: Multiple Navigation Methods (Confusion)

**Current navigation approaches:**
| Method | Location | Status |
|--------|----------|--------|
| Stats tiles | Sidebar | Works but unclear |
| Navigation links | Sidebar NAV section | Works |
| Hash links | Various | Works |
| Filter buttons | Research section | Works |
| URL params | Wiki | Works |

**Problem:** Too many ways to navigate without clear hierarchy.

### Issue 3: Data Silos

- **Archive** loads from: `data/research.json`, `data/thoughts.json`, `data/pitches.json`
- **Wiki** loads from: `wiki/data/topics.json`

These are separate data sources. A pitch in `pitches.json` doesn't link to a topic in `topics.json`.

---

## Specific Fixes Needed

### Fix 1: Make Stats Tiles Clearly Interactive

**File:** `/root/.openclaw/workspace-research-agent/index.html`

**Add CSS hover effect:**
```css
.stat-box.clickable:hover {
  cursor: pointer;
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--neon-cyan);
}
```

**Fix the onclick to prevent hash entirely:**
```html
<a href="javascript:void(0)" class="stat-box clickable" onclick="showSection('research');">
```

### Fix 2: Unify Navigation - Keep Only 2 Methods

**Keep:**
1. **Sidebar NAVIGATION section** - Primary nav (Research | Thoughts | Pitches)
2. **Filter buttons** - Within sections

**Remove/Deprecate:**
- Stats tiles as navigation (make them purely informational)
- Multiple hash link handlers

### Fix 3: Add Visual Active State to Sidebar Nav

**File:** `/root/.openclaw/workspace-research-agent/css/shared.css`

Add:
```css
.key-finding-tag.active {
  background: var(--neon-cyan);
  color: var(--bg-dark);
}
```

And update JS to add `active` class when section changes.

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Fix stats tile href, add active state to sidebar nav |
| `css/shared.css` | Add hover states, active states for navigation |
| `wiki/index.html` | (Optional) Similar fixes for wiki sidebar |

---

## Data Translation Note

The archive and wiki use different data sources. This is BY DESIGN:
- **Archive** = Research entries, Thoughts, Pitches (operational data)
- **Wiki** = Topics with papers (research synthesis)

No changes needed here - they serve different purposes. However, consider adding links from pitches to wiki topics in future.

---

## Recommended Priority

1. **HIGH:** Fix stats tile UX (prevent hash, add hover)
2. **HIGH:** Add active state to sidebar navigation
3. **MEDIUM:** Remove duplicate navigation handlers
4. **LOW:** CSS polish for consistency
