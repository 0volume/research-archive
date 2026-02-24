# PROPOSAL-CYBERPUNK-1152-v2.md
# Wiki & Archive UI Improvement Proposal - Cyberpunk Theme
# Generated: 2026-02-24 11:52 UTC
# Updated: Based on code-review feedback

## Code Review Feedback Incorporated

Code-review identified that:
- Data file (`topics.json`) already exists in backup
- The issue is likely deployment-related (data path, error handling)
- Don't create new wiki.json - use existing data
- Separate critical fix from enhancement

## Current State Analysis

### Wiki (wiki/index.html)
- Header with cyberpunk title "Research Wiki // Cyberpunk"
- Navigation bar (Research, Wiki, GitHub)
- Sidebar with stats and popular tags
- **CRITICAL**: Content area shows only tags - NO actual wiki content loading
- Decrypting animation runs forever (no error handling)

### Archive (index.html)
- Fully functional with data loading from GitHub JSON
- Has search, filters, section tabs
- Shows research, thoughts, pitches
- Working navigation to wiki

## Issues Identified (After Code Review)

1. **Wiki content not loading** - Fetch may be failing silently
2. **No error handling** - Infinite decrypting animation when fetch fails
3. **Missing data folder deployment** - data/topics.json may not be deployed
4. **Inconsistent styling** - Could use more cyberpunk polish
5. **Limited interactivity** - Could add more satisfying interactions

## Proposed Improvements

### Phase 1: Fix Wiki Loading (CRITICAL)
- Verify data path in wiki.js (should fetch from correct location)
- Add error handling - show error state instead of infinite spinner
- Add timeout for fetch requests
- Ensure data/topics.json is deployed

### Phase 2: Wiki Content Display
- Use existing topics.json data structure
- Display wiki entries with title, category, tags, content
- Add search functionality to wiki

### Phase 3: Enhanced Cyberpunk Visuals
- CRT scanline overlay effect
- Glitch text effect on hover for titles
- Improve neon glow animations
- Better button states with ripple effects

### Phase 4: UI Consistency
- Ensure wiki ↔ archive links work seamlessly
- Matching button styles across both pages
- Consistent navigation highlighting

## Implementation Priority

1. **HIGH**: Fix wiki data loading + error handling
2. **HIGH**: Verify data file deployment
3. **MEDIUM**: Add search to wiki
4. **MEDIUM**: Enhance visual polish
5. **LOW**: Refine animations

## Files to Modify

1. `wiki/js/wiki.js` - Fix data loading, add error handling
2. `wiki/index.html` - Add search, fix content areas
3. `wiki/css/wiki.css` - Add enhanced cyberpunk styles
4. `index.html` - Minor polish improvements
5. `css/shared.css` - Add scanline effect, button consistency

## Expected Outcome

- Wiki displays actual content from topics.json
- Error states shown when data fails to load
- Consistent cyberpunk theme across both pages
- All navigation links functional
- Satisfying interactions and animations
