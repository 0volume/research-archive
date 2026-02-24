# PROPOSAL-CYBERPUNK-1022.md
# Wiki & Archive UI Improvement Proposal - Cyberpunk Theme
# Generated: 2026-02-24 10:22 UTC

## Current State Analysis

### Wiki (wiki/index.html)
- Has cyberpunk header with navigation
- Shows loading/decrypting animation that never completes
- Sidebar shows stats and popular tags
- **CRITICAL ISSUE**: Content never loads - the wiki.js likely failing to fetch data

### Archive (index.html)
- Fully functional with data loading from GitHub JSON
- Has search, filters, section tabs
- Shows research, thoughts, pitches
- Working navigation to wiki

### Shared CSS
- Cyberpunk color scheme (neon cyan, magenta, green, orange)
- Orbitron + Rajdhani fonts
- Glowing effects, animations
- Responsive design

## Issues Identified

1. **Wiki content not loading** - The decrypting animation runs forever, no content appears
2. **Inconsistent styling** - Some UI elements could be more cohesive
3. **Limited interactivity** - Could add more satisfying interactions
4. **Mobile experience** - Hamburger menu works but could be smoother

## Proposed Improvements

### 1. Fix Wiki Content Loading (CRITICAL)
- Ensure wiki.js loads data from research JSON files
- Display actual wiki content (topics, papers, tags)
- Show proper loading states that transition to content

### 2. Enhanced Cyberpunk Visuals
- Add scanline overlay effect (subtle)
- Improve glow animations on hover
- Add more neon accent variations
- Better button states with ripple effects

### 3. Consistent Navigation
- Ensure wiki ↔ archive links work seamlessly
- Add breadcrumb navigation
- Highlight current section

### 4. Improved Search & Filter
- Add search to wiki (currently missing)
- Make filter buttons more visually distinct
- Add keyboard shortcuts

### 5. Animations & Interactions
- Add staggered entry animations for cards
- Improve loading transitions
- Add hover effects on all interactive elements

## Implementation Priority

1. **HIGH**: Fix wiki content loading
2. **HIGH**: Ensure all links work between wiki/archive
3. **MEDIUM**: Enhance visual polish
4. **MEDIUM**: Add search to wiki
5. **LOW**: Refine animations

## Files to Modify

1. `wiki/js/wiki.js` - Fix data loading
2. `wiki/index.html` - Add search, fix content areas
3. `index.html` - Minor polish improvements
4. `css/shared.css` - Add scanline effect, improve buttons
5. `wiki/css/wiki.css` - Additional wiki-specific styles

## Expected Outcome

- Wiki displays actual content from data files
- Consistent cyberpunk theme across both pages
- All navigation links functional
- Satisfying interactions and animations
- Responsive on mobile devices
