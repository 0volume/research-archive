# Wiki & Archive Navigation Fix - Fresh Proposal
## Date: 2026-02-24

---

## Current State Assessment

### What's Working ✅
1. **Data files exist and load:** research.json, thoughts.json, pitches.json, topics.json
2. **Stats tiles have onclick handlers** - they do call `showSection()`
3. **Filter buttons work** - complexity filters in research section
4. **CSS hover effects exist** - `.stat-box.clickable:hover` is defined
5. **Wiki loads topics** - from wiki/data/topics.json

### What's Broken ❌

**Issue 1: Stats Tiles Not Appearing Clickable**
- The onclick works but visual feedback is weak
- Need to ensure cursor changes AND add active state after click

**Issue 2: Filter/Navigation Duplication**
- Sidebar has: Stats, NAVIGATION section (Research|Thoughts|Pitches), QUICK_LINKS
- Top has: Complexity filters (ALL|BEGINNER|INTERMEDIATE|ADVANCED)
- Multiple hash handlers exist - confusing UX

**Issue 3: Wiki Stats Show Zero (from user)**
- Looking at live site: "Total Topics: -" shows dash
- Likely timing issue - stats update after data loads but animation might hide it
- Need to ensure stats update before hiding loading state

---

## Proposed Fixes (Priority Order)

### 1. Make Stats Tiles Actually Work as Filter Links

**Current (broken UX):**
```html
<a href="#research" class="stat-box clickable" onclick="showSection('research'); return true;">
```

**Fix - Add filter parameter:**
```html
<a href="#research" class="stat-box clickable" data-filter="research" onclick="showSection('research'); filterByComplexity('research'); return true;">
```

Actually - the stats should link to FILTERED views, not just show sections:
- "4 thoughts" → filter to show only thoughts section (already done)
- "5 pitches" → filter to show only pitches section

The issue might be that `showSection()` only shows the section but doesn't update the active state in sidebar.

### 2. Consolidate Filters - Pick ONE System

**Keep:** Top complexity filters (BEGINNER/INTERMEDIATE/ADVANCED)
**Keep:** Sidebar NAVIGATION (Research|Thoughts|Pitches)  
**Remove:** QUICK_LINKS in sidebar (redundant)

**Add:** Active state highlighting for sidebar nav links

### 3. Fix Wiki Stats Loading

The wiki stats show "-" because:
1. Data loads async
2. Stats update function runs but might be called before data is ready

**Fix:** Ensure stats update happens in `renderHomepage()` AFTER data is set

---

## Implementation Plan

### Step 1: Fix index.html (Archive)
- [ ] Add `active` class to sidebar nav when section changes
- [ ] Remove QUICK_LINKS section (redundant)
- [ ] Add data-filter attribute to stats for clarity
- [ ] Test clicking stats navigates correctly

### Step 2: Fix wiki/index.html + wiki.js  
- [ ] Ensure stats count updates properly after data load
- [ ] Add active state to sidebar nav
- [ ] Make wiki stats tiles link to filtered views

### Step 3: Test & Push
- [ ] Verify live site works
- [ ] Push changes to GitHub

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add active state logic, remove QUICK_LINKS |
| `css/shared.css` | Add `.key-finding-tag.active` style |
| `wiki/js/wiki.js` | Fix stats update timing |
| `wiki/index.html` | Similar active state fixes |

---

## Success Criteria

1. ✅ Clicking stats tiles navigates to correct section with visual feedback
2. ✅ Only ONE navigation method works consistently (sidebar NAV)
3. ✅ Active section highlighted in sidebar
4. ✅ Wiki shows correct topic counts (not "-")
