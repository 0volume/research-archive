# FRESH PROPOSAL - Wiki & Archive UI Improvement
# Generated: 2026-02-24 10:52 UTC

## Current Analysis

### Wiki (wiki/index.html)
- **Status**: Loading animation runs forever, content never appears
- **Issue**: Fetch to GitHub raw URL fails silently (CORS/network)
- **Has**: Cyberpunk header, navigation, sidebar stats, search input, filter buttons
- **Missing**: Content cards, recent updates list

### Archive (index.html)  
- **Status**: Working, loads data from GitHub JSON
- **Has**: Search, filters, research/thoughts/pitches sections
- **Issue**: Minor polish opportunities

### Shared CSS
- Cyberpunk theme: neon cyan (#00fff2), magenta (#ff00ff), orange (#ff6b35)
- Orbitron + Rajdhani fonts
- Glowing effects, scanlines, animations
- Responsive layout

## Critical Issues

1. **Wiki data fetch fails** - fetch('https://raw.githubusercontent.com/.../topics.json') never resolves
2. **No fallback** - No local data or error handling
3. **Missing content** - Topics, papers, filters don't render

## Proposed Solutions

### 1. Fix Wiki Data Loading (CRITICAL)
**Option A**: Use local wiki/data/topics.json instead of GitHub raw
```javascript
// Change in wiki.js:
this.baseUrl = '';  // Load from local folder
// OR
this.baseUrl = './';  // Relative path
```

**Option B**: Add fallback with error handling
```javascript
async loadHomepage() {
  try {
    // Try local first
    const response = await fetch('./data/topics.json');
    if (!response.ok) throw new Error('Local failed');
    this.data = await response.json();
  } catch (localError) {
    // Fallback to GitHub
    try {
      const response = await fetch('https://raw.githubusercontent.com/0volume/research-archive/main/wiki/data/topics.json');
      this.data = await response.json();
    } catch (githubError) {
      this.showError('Failed to load data');
    }
  }
  this.renderHomepage();
}
```

### 2. Visual Improvements (Both Pages)
- Add "glitch" effect on hover for titles
- Enhance button hover states with color shift
- Add staggered fade-in for cards
- Improve mobile hamburger menu animation

### 3. Cross-Linking
- Add "Browse Archive" button in wiki sidebar
- Add "Browse Wiki" button in archive sidebar  
- Ensure all links use relative paths

### 4. Archive Enhancements
- Add category badges to research cards
- Improve empty state message
- Add "last updated" timestamps

## Implementation Plan

### Phase 1: Fix Wiki Loading (Priority 1)
1. Modify wiki/js/wiki.js to use local data
2. Add error handling with user feedback
3. Test content renders correctly

### Phase 2: Polish UI (Priority 2)
1. Add glitch effects and animations
2. Improve button states
3. Enhance mobile experience

### Phase 3: Cross-Linking (Priority 3)
1. Add navigation buttons between wiki/archive
2. Verify all links work

## Files to Modify

1. `wiki/js/wiki.js` - Fix data loading, add fallback
2. `wiki/css/wiki.css` - Add glitch effects, animations
3. `css/shared.css` - Button improvements
4. `wiki/index.html` - Add navigation buttons
5. `index.html` - Add wiki link button

## Expected Result

- Wiki loads and displays topics
- Consistent cyberpunk theme across both sites
- Working navigation between wiki and archive
- Polished animations and interactions
