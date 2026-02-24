# Navigation & Data Fix - Feb 24, 2026 (4:30 PM)

## Issues Found

### 1. Thoughts/Pitches Links Point to Non-Existent Wiki Sections
- `renderThoughts` defaults to `wiki/#thoughts` - but wiki has no `#thoughts` section
- `renderPitches` defaults to `pitch-${item.id}.html` - these exist but should open GitHub
- These should link to the correct destinations

### 2. Stats Tiles Navigation - ALREADY WORKS
- The onclick handlers are correctly implemented
- Verified in code: `onclick="showSection('thoughts')"` exists
- CSS: `.section { display: none }`, `.section.active { display: block }` is correct

### 3. Filter System - ALREADY UNIFIED  
- QUICK_LINKS removed, using top filters + sidebar nav
- This matches user request

### 4. Data Loading - VERIFIED WORKING
- Data files exist and accessible on GitHub:
  - `data/thoughts.json` - 4 entries ✓
  - `data/pitches.json` - 5 entries ✓

## Fix Required

### Fix 1: Update Thought Links
In `renderThoughts()`, change:
```javascript
const thoughtUrl = item.url || `wiki/#thoughts`;
```
To:
```javascript
const thoughtUrl = item.url || `wiki/index.html`;
```

### Fix 2: Update Pitch Links
In `renderPitches(), change:
```javascript
const pitchUrl = item.url || `pitch-${item.id}.html`;
```
To:
```javascript
const pitchUrl = item.url || `https://github.com/0volume/research-archive/blob/main/pitch-${item.id}.html`;
```

Or better, open directly in archive:
```javascript
const pitchUrl = `index.html#pitches`;  // Link back to archive pitches section
```

### Fix 3: Add Target for External Links
For GitHub links, add `target="_blank"`:
```html
<a href="${pitchUrl}" target="_blank" class="entry-card">
```

## Implementation Plan

1. Edit `/root/.openclaw/workspace-research-agent/index.html`
2. Fix renderThoughts() link defaults
3. Fix renderPitches() link defaults  
4. Test locally
5. Commit and push to GitHub

## Files to Modify
- `/root/.openclaw/workspace-research-agent/index.html` - renderThoughts(), renderPitches()
