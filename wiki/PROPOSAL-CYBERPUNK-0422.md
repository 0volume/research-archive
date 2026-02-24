# FRESH Cyberpunk UI Proposal - Feb 24, 2026 (4:22 AM)

## Current State Analysis

### Archive (index.html)
- Has cyberpunk styling with neon accents
- Navigation: Research | Wiki | GitHub links
- Stats sidebar with category/entry counts
- Filter buttons for complexity levels
- Loading spinners present
- Fetches from GitHub raw JSON files

### Wiki (wiki/index.html)
- Has cyberpunk styling
- Navigation: Main Archive link (../) - **NEEDS FIXING**
- Stats sidebar with topics/papers counts
- Popular tags display
- Dynamic content loading via wiki.js

## Issues Identified

### 1. Navigation Link Inconsistency
- **Archive**: Has "Wiki" link pointing to `wiki/`
- **Wiki**: Has "MAIN_ARCHIVE" link pointing to `../` (relative)
- **FIX**: Should point to absolute `../index.html` for clarity

### 2. Visual Consistency Gaps
- Both should share exact same CSS variables for colors
- Scanline effects should be identical
- Button hover states need glow effects
- Loading spinner should match across both

### 3. Missing Elements
- No consistent footer on either page
- Archive nav lacks "active" indicator styling for current section
- Wiki nav should show which section is active

### 4. UI Polish Needed
- Add "glitch" text effect on hover for titles
- Enhance card hover states with stronger glow
- Add animated border gradients
- Improve mobile responsiveness

## Proposed Improvements

### Phase 1: Fix Broken/Confusing Links
1. Wiki nav: Change `../` to absolute path `../index.html`
2. Add clear breadcrumb: Wiki ↔ Archive navigation
3. Make nav links consistent styling

### Phase 2: Visual Consistency
1. Extract shared CSS variables to common file or ensure both import same base
2. Match all colors exactly:
   - Neon Cyan: #00fff5
   - Neon Magenta: #ff00ff
   - Background: #0a0a0f / #12121a
   - Neon Orange: #ff6b00
3. Same typography: Orbitron, Rajdhani, JetBrains Mono

### Phase 3: Enhanced Cyberpunk Effects
1. Add scanline overlay to both pages
2. Add grid background pattern
3. Glow effects on all interactive elements
4. Animated title effects
5. Consistent card styling with neon borders

### Phase 4: Responsive & Polish
1. Ensure both work on mobile
2. Add smooth transitions
3. Fix any JavaScript errors
4. Test all links work

## Implementation Notes
- Work in: `/root/.openclaw/workspace-research-agent/`
- Files: index.html, wiki/index.html, wiki/css/wiki.css
- Test at: https://0volume.github.io/research-archive/
- Push to: https://github.com/0volume/research-archive
