# FRESH NAVIGATION & DATA PROPOSAL - Feb 24, 2026

## Current Issues Identified

### 1. Stats Tiles Not Clickable
- Wiki shows: Topics, Papers, Complete, Live (static display)
- Archive shows: Research, Thoughts, Pitches (static display)
- **User expects**: Click to navigate to filtered section

### 2. Filter System Inconsistency
- **Wiki**: Has filter buttons (All/Research/Complete/Implemented) at top - WORKS
- **Archive**: Has BOTH sidebar quick_links AND top filters - CONFUSING
- **Solution**: Keep top filters (proven working), remove redundant sidebar filters

### 3. Navigation Anchor Broken
- Clicking `#thoughts` or `#pitches` in URL doesn't show the correct section
- `showSection()` exists but hashchange handler may not be properly attached

### 4. Data Loading Issue
- "DECRYPTING_DATA" animation can get stuck if fetch fails
- Need fallback mechanism

## Priority Fixes

### Phase 1: Make Stats Clickable
- Convert stat boxes to anchor links
- Click "Thoughts" → navigate to #thoughts section
- Click "Pitches" → navigate to #pitches section

### Phase 2: Unified Filter System
- Keep top filter buttons (All/Research/Thoughts/Pitches/Complexity)
- Remove broken/duplicate sidebar quick_links
- Make filter buttons actually filter the content

### Phase 3: Fix Hash Navigation
- Ensure `window.addEventListener('hashchange', handleHash)` is attached
- When hash changes, call `showSection()` to display correct section

### Phase 4: Data Fallback
- Add embedded data fallback if fetch fails
- Show user-friendly error instead of stuck animation

## Files to Modify

1. **archive/index.html** - Main research archive
2. **wiki/index.html** - Wiki homepage  
3. **wiki/js/wiki.js** - Wiki JavaScript

## Test Checklist
- [ ] Click stats tiles → navigates to section
- [ ] #thoughts in URL → shows thoughts
- [ ] #pitches in URL → shows pitches
- [ ] Top filters work correctly
- [ ] No stuck loading animation
