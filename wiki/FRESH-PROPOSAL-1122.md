# FRESH PROPOSAL - Cyberpunk UI Improvement v5
## Analysis: Feb 24, 2026 - 11:22 UTC

### Current State

**Archive (index.html):**
- Header with logo, nav (Research/Wiki/GitHub)
- Sidebar with STATS, QUICK_LINKS
- Tabs: Research, Thoughts, Pitches with loading animations
- Cyberpunk colors: neon-cyan (#00fff2), neon-magenta (#ff00ff)
- Filters by complexity (ALL/BEGINNER/INTERMEDIATE/ADVANCED)

**Wiki:**
- Header with logo, nav (RESEARCH/WIKI/GitHub)
- Sidebar with STATS, POPULAR_TAGS, RECENT_UPDATES
- Loading animation with decrypting text effect

### Issues to Fix

1. **Button Inconsistency**: Archive uses `cyber-filter-btn` class, Wiki uses different styling
2. **Missing Glow Animations**: Interactive elements lack hover glow effects
3. **Navigation Link Gap**: Wiki nav doesn't highlight "WIKI" when active (uses `.active` on itself)
4. **Card Styling**: Research cards need more consistent cyberpunk borders/glows
5. **Tag Styling**: Both sides use `key-finding-tag` - ensure consistency

### Proposed Improvements

1. **Unified Button System**: Create consistent `.cyber-btn` with glow hover effects for both pages
2. **Enhanced Card Hover**: Add glowing border animation on research cards
3. **Active Nav Highlight**: Ensure Wiki nav shows cyan glow when on wiki page
4. **Tag Enhancements**: Make tags clickable with neon border glow on hover
5. **Loading Animation Sync**: Both should use identical decrypting loader
6. **Responsive Polish**: Ensure mobile hamburger menu works identically

### Implementation Priority

1. CSS: Add unified button/card/tag styles to shared.css
2. Update wiki/index.html nav to properly highlight active state
3. Add hover glow effects to all interactive elements
4. Verify all cross-links work (Wiki ↔ Archive)

### Color Reference (SOLARIS)
- `--neon-cyan: #00fff2`
- `--neon-magenta: #ff00ff`
- `--neon-green: #00ff41`
- `--neon-orange: #ff6b35`
