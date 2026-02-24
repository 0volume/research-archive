# FRESH PROPOSAL - Cyberpunk UI Improvement v3
**Date:** Feb 24, 2026 - 9:55 AM UTC

## Current State Analysis

### What's Already Implemented ✅

**Wiki (https://0volume.github.io/research-archive/wiki/)**
- Cyberpunk color palette (Solaris exact colors: #00fff2 cyan, #ff00ff magenta)
- Tech grid background with gradient overlays
- Scanline animation effect
- Glowing header with backdrop blur
- Navigation with neon hover underline
- Topic cards with hover glow effects
- Loading state with "DECRYPTING_DATA" animation
- Stats display with stat boxes
- Tags with neon borders
- Responsive design with mobile hamburger menu

**Archive (https://0volume.github.io/research-archive/)**
- Same header/nav styling as wiki (shared CSS)
- Same sidebar with stats, tags, navigation
- Three sections: Research, Thoughts, Pitches
- Complexity filter buttons
- Search input with cyberpunk styling
- Same footer as wiki
- Same loading animation

### Minor Issues Found 🔧

1. **Search input styling** - Could use more prominent glow on focus
2. **Filter buttons** - Active state could be more prominent
3. **Entry cards in archive** - Could add corner bracket decorations for consistency
4. **Hover states on archive cards** - Could use more pronounced glow
5. **Page transition** - Could add smooth scroll behavior
6. **External links** - Could add external link icon indicator

---

## Proposal: Fine-Tuning Cyberpunk UI

### 1. Enhanced Search Input
- Add stronger glow on focus (box-shadow expansion)
- Add placeholder text animation
- Add subtle pulse when focused

### 2. Filter Button Improvements
- Make active state more visible with fill + glow
- Add slight scale animation on click
- Add transition for state changes

### 3. Card Corner Accents (Archive)
- Add CSS ::before/::after corner brackets to entry cards
- Match the style already in cyberpunk.css
- Apply to research entries, thought cards, pitch cards

### 4. Enhanced Hover Effects
- Add translateY(-2px) on card hover
- Add stronger glow spread on hover
- Add cursor: pointer to indicate clickability

### 5. External Link Indicators
- Add ↗ icon after external links
- Style consistently with theme

### 6. Smooth Scroll
- Ensure html has scroll-behavior: smooth
- Add scroll-to-top button on long pages

---

## Implementation Plan

1. Modify `/wiki/css/wiki.css` for enhanced hover/focus states
2. Modify `/css/shared.css` for filter button improvements
3. Test both wiki and archive pages
4. Push changes to GitHub
5. Verify live deployment

---

## Files to Modify
1. `/root/.openclaw/workspace-research-agent/wiki/css/wiki.css`
2. `/root/.openclaw/workspace-research-agent/css/shared.css`

**Priority:** Low - these are polish improvements. The core cyberpunk theme is already solid.

---

**Deliverable:** Slightly refined cyberpunk UI with better interactive feedback.
