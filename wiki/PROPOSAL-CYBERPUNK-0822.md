# FRESH PROPOSAL - Cyberpunk UI Improvement v2
**Date:** Feb 24, 2026 - 8:22 AM UTC

## Current State Analysis

### Wiki (https://0volume.github.io/research-archive/wiki/)
- Header with logo and nav (RESEARCH, WIKI, GITHUB)
- Sidebar with stats, popular tags, recent updates
- Main content area with loading spinner
- Footer with status indicator
- Uses: wiki.css + shared.css

### Archive (https://0volume.github.io/research-archive/)
- Header with logo and nav
- Sidebar with stats, quick links, navigation
- Three sections: Research, Thoughts, Pitches
- Filter buttons for complexity
- Footer identical to wiki
- Uses: wiki.css + shared.css

### Issues Found:
1. **Inconsistent visual hierarchy** - Cards look plain, no hover glow
2. **Missing animated accents** - No scanlines, glitch effects, or tech grid
3. **Loading states** - Basic spinner, could be more cyberpunk
4. **No working links in cards** - Research entries are static, not clickable
5. **Footer placement** - May break on short content
6. **Tag styling** - Basic pills, need neon borders/glow

---

## Proposal: Cyberpunk UI Enhancement v2

### 1. Unified Design System
Create a single `cyberpunk.css` that both wiki and archive import:
- Consistent neon color variables
- Shared card, button, and badge components
- Corner accent decorations
- Glow-on-hover effects

### 2. Enhanced Card Components
- Add corner brackets (┌ ┐ └ ┘) to all cards
- Implement neon border glow on hover
- Add subtle pulse animation for key items
- Make research entries clickable (link to detail or GitHub)

### 3. Animated Backgrounds
- Tech grid pattern (50px grid, cyan at 3% opacity)
- Optional scanline overlay for authenticity
- Floating particle effect on main headers

### 4. Navigation Improvements
- Active nav item gets neon underline + glow
- Smooth transition on hover
- Mobile hamburger with slide-in animation

### 5. Loading States
- Replace basic spinner with rotating cyber emblem
- Add "SYSTEM INITIALIZING..." text animation
- Data loading progress indicator style

### 6. Stats Display
- Add "flipping" number animation on load
- Glowing count-up effect
- Icon + number + label layout

### 7. Button Styling
- Neon border with transparent bg
- Fill + glow on hover
- Click ripple effect

### 8. Footer Consistency  
- Both wiki and archive: identical footer
- Add subtle animated border top
- Status dot with pulse animation

### Files to Modify:
1. `/root/.openclaw/workspace-research-agent/css/shared.css` - Add cyberpunk system
2. `/root/.openclaw/workspace-research-agent/wiki/css/wiki.css` - Enhance components  
3. `/root/.openclaw/workspace-research-agent/wiki/index.html` - Add working links
4. `/root/.openclaw/workspace-research-agent/index.html` - Enhance cards, add links

### Implementation Priority:
1. CSS system (shared.css) - foundation
2. Card enhancements (wiki.css) - visual pop
3. Loading animations - polish
4. Working links - functionality
5. Test both pages render correctly

---

**Deliverable:** Cohesive cyberpunk UI across both wiki and archive with working navigation between them.
