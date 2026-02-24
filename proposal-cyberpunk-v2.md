# Wiki & Research Archive UI Improvement Proposal
## Cyberpunk Theme Enhancement - v2
**Date:** February 24, 2026
**Time:** 09:22 UTC

---

## Current State Analysis

### Wiki (wiki/index.html)
- Has cyberpunk header with neon branding
- Sidebar with stats, tags, recent updates
- Dynamic content loading from GitHub JSON
- Mobile hamburger menu

### Main Archive (index.html)
- Uses shared CSS + wiki.css
- Sections: Research, Thoughts, Pitches
- Search + filter functionality
- Same navigation structure

### Issues Identified
1. **Inconsistent button styles** - Archive uses different filter buttons than wiki
2. **Loading states** - Both show "LOADING_DATA..." but could be more animated
3. **Missing wiki↔archive deep links** - Navigation works but topic cross-linking missing
4. **No scroll animations** - Elements just appear, no cyberpunk reveal
5. **Tag styling** - Could use more glow effects
6. **Entry cards** - Could have hover pulse effects

---

## Proposed Improvements

### 1. Unified Cyberpunk Button System
Create consistent button styles across both pages:
- Neon border glow on hover
- Scanline effect on click
- Consistent sizing and spacing
- Cyberpunk "active" state with underline glow

### 2. Enhanced Loading Animation
- Replace simple spinner with "decrypting" text animation
- Matrix-style character cycling effect
- Progress percentage simulation

### 3. Animated Card Reveals
- Staggered fade-in with neon line drawing effect
- Cards slide in from bottom with glow trail
- Hover: border pulse + subtle glitch effect

### 4. Improved Tag/Badge Styling
- Neon border glow matching Solaris palette
- Subtle background gradient
- Hover: expand with glow burst

### 5. Navigation Enhancement
- Active page indicator with animated underline
- Smooth hover transitions
- Add "back to archive" links in wiki topic pages

### 6. Search Bar Cyberpunk Polish
- Glowing border on focus
- Typewriter effect placeholder
- Results highlight with neon marker

### 7. Footer Consistency
- Ensure both pages have identical footer structure
- Matching status indicator (● ONLINE)

---

## Color Reference (Solaris)
- `--neon-cyan: #00fff5`
- `--neon-magenta: #ff00ff`
- `--neon-orange: #ff6b00`
- `--neon-green: #00ff41`
- `--dark-bg: #0a0a0f`
- `--dark-surface: #12121a`

---

## Implementation Priority
1. **P0:** Button consistency, loading animation, card reveals
2. **P1:** Tag styling, search bar polish
3. **P2:** Navigation enhancements, footer alignment

---

## Files to Modify
- `/root/.openclaw/workspace-research-agent/wiki/css/wiki.css`
- `/root/.openclaw/workspace-research-agent/css/shared.css`
- `/root/.openclaw/workspace-research-agent/wiki/index.html`
- `/root/.openclaw/workspace-research-agent/index.html`

---

## Success Criteria
- [ ] Buttons look identical on both pages
- [ ] Loading has animated "decrypting" effect
- [ ] Cards animate in on page load
- [ ] All navigation links work
- [ ] Mobile responsive
- [ ] No console errors
