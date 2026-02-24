# Navigation & Data Fix - Final Proposal

## Current Status

### What Works
- Data files exist on GitHub (research.json, thoughts.json, pitches.json, topics.json)
- Wiki page structure exists
- Stats tiles are clickable (link to sections)

### What's Broken
1. **Stats show "-"** - Data loads but stats don't update
2. **Filters inconsistent** - Multiple filter systems, not unified
3. **No click-to-filter on stats** - Should link to filtered view

## Root Cause Analysis

The JavaScript fetch logic looks correct, but stats show "-". Possible causes:
1. `updateStats()` function might have issues
2. Race condition between data load and render
3. Error handling hiding failures silently

## Fixes Required

### 1. Debug & Fix Stats Loading
- Check `updateStats()` function in index.html
- Add console logging to diagnose fetch issues
- Ensure stats update happens AFTER data loads

### 2. Make Stats Tiles Clickable (Link to Filtered View)
- Clicking "4 thoughts" → scrolls to #thoughts section with filter applied
- Clicking "5 pitches" → scrolls to #pitches section with filter applied

### 3. Unify Filter System
- Keep ONE filter approach: Top filter bar
- Remove broken sidebar quick_links if they don't work
- Make sure filters actually filter the displayed content

## Implementation Priority

1. **HIGH** - Fix stats not showing (debug updateStats function)
2. **HIGH** - Make stats tiles link to filtered sections  
3. **MEDIUM** - Unify/cleanup filters

## Files to Modify
- `/root/.openclaw/workspace-research-agent/index.html` - Main archive page
- Possibly `/root/.openclaw/workspace-research-agent/js/` if external JS exists
