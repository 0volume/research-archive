# FRESH-PROPOSAL-1222.md
# Wiki & Archive UI Improvement - Cyberpunk Theme
# Generated: 2026-02-24 12:22 UTC

## Current Analysis (Live Sites)

### Wiki (https://0volume.github.io/research-archive/wiki/)
- Shows header "Research Wiki // Cyberpunk" with navigation
- Sidebar displays: STATS (4 boxes with -), POPULAR_TAGS (self-improvement, agents, reflection)
- Main content shows infinite "DECRYPTING_DATA" loading animation
- **ISSUE**: Content never loads - fetch failing silently

### Archive (https://0volume.github.io/research-archive/)
- Header with logo, nav links (Research, Wiki, GitHub)
- Shows "AI_AGENT_RESEARCH", "Research • Thoughts • Pitches"
- Filter buttons for category/complexity
- Content shows "DECRYPTING_DATA" / "ACCESSING_NEURAL_GRID..." with loading state
- Links to wiki/ work

## Issues Identified

1. **Wiki Data Path Bug**: wiki.js fetches from `wiki/data/topics.json` but file is at `data/topics.json`
2. **Archive also stuck on loading** - both pages not loading content
3. **No error visibility** - users see infinite spinner, no error message
4. **Inconsistent UI** - both have cyberpunk basics but missing polish

## Proposed Improvements

### Phase 1: Fix Data Loading (CRITICAL)
- Fix wiki.js to fetch from correct path: `data/topics.json` (not `wiki/data/`)
- Add visible error state instead of infinite spinner
- Add retry button on error
- Test both wiki and archive data loading

### Phase 2: Enhanced Error Handling
- Show cyberpunk error card with:
  - Error icon (⚠️)
  - "SYSTEM_ERROR" title in red neon
  - Clear error message
  - "RETRY" and "BACK" buttons
- Add debug info expandable section

### Phase 3: UI Polish
- Add CRT screen curvature effect (subtle)
- Enhance neon glow on interactive elements
- Add sound effect option (muted by default)
- Improve button hover states with glitch effect

### Phase 4: Navigation Improvements
- Add breadcrumb to wiki detail pages
- Improve back navigation
- Add keyboard shortcuts hint (/ for search, Esc to go back)

## Files to Modify

1. `wiki/js/wiki.js` - Fix data path, improve error handling
2. `wiki/index.html` - Add error state template, improve loading
3. `wiki/css/wiki.css` - Add error styles, enhanced animations
4. `index.html` (archive) - Fix loading issue if present
5. `css/shared.css` - Add error state styles, CRT effect

## Expected Outcome
- Both wiki and archive load and display content correctly
- Clear error states when data fails to load
- Enhanced cyberpunk visuals consistent across both
- All navigation links functional

## Priority
1. FIX data loading (critical)
2. Add error states
3. UI polish
