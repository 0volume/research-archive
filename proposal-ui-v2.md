# Wiki & Archive UI Improvement Proposal - Cyberpunk Theme v2

**Date:** February 24, 2026  
**Time:** 3:22 AM UTC  
**Reviewer:** code-review

---

## Current State Analysis

### Wiki (https://0volume.github.io/research-archive/wiki/)
- Already has cyberpunk base styling (neon colors, glow effects)
- Uses Orbitron, Rajdhani, JetBrains Mono fonts
- Grid layout with sidebar + main content
- Loading spinners and animations present
- Navigation: Home link points to `./index.html` (relative - incorrect!)

### Archive (https://0volume.github.io/research-archive/)
- Uses same CSS as wiki (wiki/css/wiki.css)
- Has tabs: Research, Thoughts, Pitches
- Filters by complexity level
- Navigation has: Research (active), Wiki, GitHub
- Wiki link is `wiki/` (correct!)

---

## Issues Identified

### Critical (Broken Links)
1. **Wiki → Archive link broken**: Wiki nav links use `./index.html` which goes to wiki/index.html (doesn't exist)
2. Should link to `../` (parent directory) not `./index.html`

### UI Consistency Issues
3. Both pages use the same CSS but slightly different header layouts
4. Archive has `.archive-container` but wiki has `.wiki-container` - potential style drift
5. No consistent "glow" button states across both

### Enhancement Opportunities
6. Add hover glow animations to nav buttons (like Solaris)
7. Improve the scanline effect for more atmosphere
8. Add "pulse" animation on active navigation items
9. Make entry cards more interactive with hover states
10. Add keyboard navigation support

---

## Proposed Improvements

### Phase 1: Fix Broken Links
- Wiki: Change `./index.html` to `../` in nav
- Verify all cross-links work (wiki ↔ archive)

### Phase 2: Visual Enhancements (Solaris-inspired)
- Add subtle pulsing glow to active nav items
- Enhance button hover states with cyan/magenta transitions
- Add "typing" effect to loading states
- Make stat numbers animate on load (count up effect)
- Add hover ripple effect on cards

### Phase 3: Polish
- Ensure responsive behavior on mobile
- Add keyboard shortcuts (Esc to go back)
- Smooth scroll behavior
- Consistent border-radius and spacing

---

## Implementation Plan

1. **Fix wiki navigation** - Change `./index.html` to `../` in wiki/index.html
2. **Enhance CSS** - Add new animation keyframes, improve hover states
3. **Add JavaScript** - Stat count-up animation, keyboard navigation
4. **Verify** - Test all links between wiki and archive

**Target:** Cohesive cyberpunk aesthetic matching Solaris portal, with working navigation.

---

## Files to Modify
- `/root/.openclaw/workspace-research-agent/wiki/index.html` - Fix nav links
- `/root/.openclaw/workspace-research-agent/wiki/css/wiki.css` - Add enhancements
- `/root/.openclaw/workspace-research-agent/wiki/js/wiki.js` - Add enhancements
- `/root/.openclaw/workspace-research-agent/index.html` (archive) - If needed

**Action:** Spawn code-agent with this proposal for implementation.
