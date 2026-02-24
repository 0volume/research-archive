# FRESH PROPOSAL: Wiki & Archive Cyberpunk UI - Feb 24, 0552 UTC

## Status: READY FOR IMPLEMENTATION

---

## Current Analysis

### Live Sites (Verified via fetch)
- **Wiki**: https://0volume.github.io/research-archive/wiki/ - Shows sidebar but main content stuck on "LOADING_DATA..."
- **Archive**: https://0volume.github.io/research-archive/ - Same loading issue

### Local Files (Analyzed)
- ✅ `wiki/css/wiki.css` - 650+ lines, comprehensive cyberpunk styling
- ✅ `css/shared.css` - 350+ lines, unified components
- ✅ Both HTML files properly reference shared.css

### Cyberpunk Design: ALREADY EXCELLENT
- Neon colors (cyan #00fff5, magenta #ff00ff)
- Glow effects on hover
- Scanline background effects
- Staggered fade-in animations
- Responsive breakpoints
- Glitch text effects

---

## Gaps Identified

| Priority | Issue | Impact |
|----------|-------|--------|
| **P0** | JSON data loading fails - content doesn't render | Critical |
| **P1** | Filter buttons use `.filter-btn` instead of shared `.cyber-filter-btn` | Medium |
| **P2** | No error handling when data fails to load | Low |

---

## Root Cause Analysis

### Data Loading Issue
The `loadData()` function in index.html fetches from:
```
https://raw.githubusercontent.com/0volume/research-archive/main/research.json
```

This URL may have changed or the JSON structure may not match what the JS expects.

### Button Class Issue
- `shared.css` defines `.cyber-filter-btn` (lines 140-170)
- Archive index.html uses plain `.filter-btn` class
- Should use the unified class for consistency

---

## Implementation Plan

### Step 1: Fix Data Loading (P0)
1. Check if research.json exists in the GitHub repo
2. Verify JSON structure matches what `renderResearch()` expects
3. Add proper error handling with visible error state
4. Use local JSON files as fallback

### Step 2: Unify Button Classes (P1)
1. Replace `.filter-btn` with `.cyber-filter-btn` in archive index.html
2. Ensure active states work correctly
3. Test hover animations

### Step 3: Add Error Fallback (P2)
1. Show "NO_DATA" message if JSON fails
2. Style error state with cyberpunk aesthetic (red neon)

---

## Files to Modify

1. `/root/.openclaw/workspace-research-agent/index.html` - Fix data loading, update button classes
2. `/root/.openclaw/workspace-research-agent/wiki/index.html` - Verify similar fixes if needed

---

## Not Modified (Preserve)
- CSS files (already excellent)
- wiki/js/wiki.js (logic)
- Research data files

---

## Verification Steps
1. Load archive page - data should render
2. Load wiki page - data should render  
3. Click filter buttons - should highlight with cyan glow
4. Navigate wiki ↔ archive - links work
5. Mobile view - responsive layout works

---

**APPROVED FOR IMPLEMENTATION**
