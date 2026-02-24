# Quick Fix: Section Visibility CSS

## Problem
- Navigation uses `.active` class to show/hide sections
- But NO CSS exists to actually hide inactive sections
- All sections visible at once regardless of navigation

## Solution
Add CSS to shared.css:

```css
/* Section visibility control */
.section {
    display: none;
}

.section.active {
    display: block;
}
```

## Files to modify
- `/root/.openclaw/workspace-research-agent/css/shared.css`

## Status
- thoughts.json: ✅ EXISTS on GitHub (4 thoughts)
- pitches.json: ✅ EXISTS on GitHub (5 pitches)
- Navigation JS: ✅ Works correctly
- Missing: CSS to show/hide sections

## Implementation
Add the CSS rules above to shared.css, commit, push, verify.
