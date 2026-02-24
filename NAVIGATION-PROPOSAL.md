# NAVIGATION & DATA PROPOSAL
## Research Archive & Wiki Fixes

**Date:** 2026-02-24  
**Status:** DRAFT - Ready for Implementation  
**Priority:** HIGH

---

## EXECUTIVE SUMMARY

After analyzing the live sites and source code, I've identified **4 core issues** causing the "DECRYPTING_DATA" stuck state and navigation failures. All GitHub raw URLs are accessible (verified), so the issue is in the fetch implementation and navigation architecture.

---

## ISSUE #1: DATA LOADING FAILURE

### Root Cause
The JavaScript fetch is failing silently in the browser context. Possible causes:
1. **Timing issue**: The loading animation shows before JS executes, but fetch may timeout or fail before replacing content
2. **No fallback**: If GitHub raw fails, there's no embedded data backup
3. **Error visibility**: Errors are logged to console but not shown in UI

### Evidence
- `web_fetch` successfully retrieves all JSON files from GitHub raw (200 OK)
- CORS headers verified: `access-control-allow-origin: *`
- But browser shows stuck "DECRYPTING_DATA" animation

### PROPOSED FIX

**Option A: Add Timeout + Better Error Handling**
```javascript
// In wiki/js/wiki.js - replace fetchWithTimeout
async function loadWithTimeout(url, timeout = 8000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    // Show error in UI instead of silently failing
    return { error: error.message, fallback: true };
  }
}
```

**Option B: Embed Data as JavaScript (RECOMMENDED)**
Instead of fetching from GitHub raw, embed the data directly in the HTML as a JavaScript variable:

```html
<!-- In index.html head or before script -->
<script>
  window.EMBEDDED_DATA = {
    research: { /* content from research.json */ },
    thoughts: [ /* content from thoughts.json */ ],
    pitches: [ /* content from pitches.json */ ]
  };
</script>
```

This eliminates:
- Network dependency
- CORS issues  
- Loading delays
- GitHub rate limits

**For Implementation:** Use Option B for archive (index.html) - embed the 4 small JSON files directly. For wiki, embed topics.json.

---

## ISSUE #2: STATS TILES NOT CLICKABLE

### Current State
```html
<!-- Sidebar stats - just display, no links -->
<div class="stat-box">
  <div class="stat-number" id="stat-thoughts">-</div>
  <div class="stat-label">Thoughts</div>
</div>
```

### PROPOSED FIX
Convert stat boxes to anchor links that navigate to filtered sections:

```html
<!-- In archive/index.html - Replace stat boxes -->
<a href="#thoughts" class="stat-box" onclick="showSection('thoughts'); return true;">
  <div class="stat-number" id="stat-thoughts">-</div>
  <div class="stat-label">Thoughts</div>
</a>

<a href="#pitches" class="stat-box" onclick="showSection('pitches'); return true;">
  <div class="stat-number" id="stat-pitches">-</div>
  <div class="stat-label">Pitches</div>
</a>
```

Or better - use JavaScript to make them interactive:

```javascript
// Add to archive index.html script
document.querySelectorAll('.stat-box').forEach(box => {
  const label = box.querySelector('.stat-label').textContent.toLowerCase();
  if (label.includes('thought')) {
    box.style.cursor = 'pointer';
    box.addEventListener('click', () => showSection('thoughts'));
  } else if (label.includes('pitch')) {
    box.style.cursor = 'pointer';
    box.addEventListener('click', () => showSection('pitches'));
  }
});
```

---

## ISSUE #3: FILTER INCONSISTENCY

### Current Problems
1. **Sidebar** has `QUICK_LINKS` with tags (beginner, intermediate, advanced)
2. **Top filters** have complexity buttons (ALL, BEGINNER, INTERMEDIATE, ADVANCED)  
3. **Both exist but work differently** - confusing UX

### PROPOSED SOLUTION: UNIFIED FILTER SYSTEM

**Keep ONE approach: Top Filters (proven working)**

1. **Remove sidebar QUICK_LINKS section** - it's redundant
2. **Keep top complexity filters** - they work correctly
3. **Add section quick-filters** to filter by Research/Thoughts/Pitches

```html
<!-- Replace sidebar QUICK_LINKS with this unified approach -->
<div class="sidebar-section">
  <h3>// SECTIONS</h3>
  <div class="key-findings">
    <a href="#research" class="key-finding-tag" data-section="research">📚 Research</a>
    <a href="#thoughts" class="key-finding-tag" data-section="thoughts">💭 Thoughts</a>
    <a href="#pitches" class="key-finding-tag" data-section="pitches">🎯 Pitches</a>
  </div>
</div>
```

Then add CSS to highlight active section:

```css
.key-finding-tag[data-section].active {
  background: var(--neon-cyan);
  color: var(--bg-dark);
}
```

---

## ISSUE #4: ANCHOR NAVIGATION BROKEN (#thoughts, #pitches)

### Current Problems
1. Clicking `#thoughts` in sidebar scrolls but doesn't:
   - Make the section visible (add `active` class)
   - Hide other sections
   - Update nav highlight

2. The `showSection()` function exists but isn't triggered on hashchange properly

### Current Code (Broken)
```javascript
function handleHash() {
  const hash = window.location.hash.slice(1);
  if (hash === 'thoughts' || hash === 'pitches') {
    showSection(hash);  // This should work...
  }
}
```

### PROPOSED FIX

**Fix #1: Ensure hashchange listener is attached**
```javascript
// Add at end of loadData()
window.addEventListener('hashchange', handleHash);
// Also call on page load
handleHash();
```

**Fix #2: Make sidebar links trigger showSection**
```javascript
// Sidebar hash link handlers
document.querySelectorAll('.archive-sidebar a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const sectionId = href.slice(1);
    showSection(sectionId);
    // Update sidebar active state
    document.querySelectorAll('.archive-sidebar a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});
```

**Fix #3: Add smooth scroll**
```css
html {
  scroll-behavior: smooth;
}
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Fix Data Loading (Critical)
- [ ] Create embedded data version of research.json, thoughts.json, pitches.json
- [ ] Add script embedding to index.html
- [ ] Modify loadData() to check for EMBEDDED_DATA first
- [ ] Add fallback to fetch if embedded data missing
- [ ] Test: Page should load without "DECRYPTING_DATA" stuck

### Phase 2: Fix Navigation
- [ ] Make stat boxes clickable (link to sections)
- [ ] Remove duplicate sidebar filters
- [ ] Add section quick-links to sidebar
- [ ] Fix hashchange handler
- [ ] Test: Clicking #thoughts should show thoughts section

### Phase 3: Polish
- [ ] Add loading states that actually show progress
- [ ] Add error states with "retry" buttons
- [ ] Ensure mobile responsive works
- [ ] Test all filter combinations

---

## FILES TO MODIFY

| File | Changes |
|------|---------|
| `index.html` | Embed data, fix stat clicks, fix filters, fix hash nav |
| `wiki/index.html` | Embed topics.json data |
| `wiki/js/wiki.js` | Add embedded data support, fix fetch fallback |

---

## TESTING CHECKLIST

- [ ] Archive loads without stuck loading animation
- [ ] Stats tiles (Thoughts, Pitches) are clickable and navigate to correct section
- [ ] #thoughts in URL shows thoughts section
- [ ] #pitches in URL shows pitches section
- [ ] Sidebar section links work
- [ ] Filters (complexity) work correctly
- [ ] Search filters entries correctly
- [ ] Wiki loads topics without stuck animation
- [ ] Wiki stat boxes show correct counts

---

## NOTES

- The GitHub raw URLs DO work (verified with curl and web_fetch)
- The issue is likely network timing or browser-specific fetch behavior
- Embedding data is the most robust solution for a static site
- Total embedded data size is ~80KB (research.json: 40KB, topics.json: 35KB, thoughts+pitches: ~2KB) - acceptable for page load

