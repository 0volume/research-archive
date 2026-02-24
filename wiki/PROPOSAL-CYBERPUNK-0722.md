# FRESH PROPOSAL: Wiki & Archive Cyberpunk UI - v3 (Feb 24, 2026)

**Time:** 7:22 AM UTC  
**Status:** READY FOR IMPLEMENTATION

---

## Current Analysis

### Wiki (https://0volume.github.io/research-archive/wiki/)
- ✅ Has cyberpunk header with logo + nav + GitHub
- ✅ Sidebar with stats, tags, recent updates  
- ✅ Main content loads dynamically via wiki.js
- ✅ Loading spinner with "LOADING_DATA..."
- ✅ Footer with nav links
- ⚠️ Need to verify sidebar responsiveness on mobile

### Archive (https://0volume.github.io/research-archive/)
- ✅ Has header with 🧠 logo + nav links
- ✅ Sidebar with stats, quick links
- ✅ Section tabs (Research, Thoughts, Pitches) with filters
- ✅ Footer with nav links
- ✅ Loading spinner
- ⚠️ Need to verify mobile responsiveness

### Shared CSS
- ✅ `/root/.openclaw/workspace-research-agent/css/shared.css` exists
- ✅ Used by both wiki and archive

---

## Issues Found

1. **Mobile Responsiveness** - Sidebar may overflow on small screens
2. **Loading State Z-Index** - Ensure loading overlay works correctly
3. **Navigation Active States** - Verify correct page is highlighted
4. **Color Consistency** - Both must use exact same neon colors

---

## Cyberpunk Color Reference (SOLARIS-style)
```css
:root {
  --bg-dark: #0a0a0f;
  --bg-panel: #12121a;
  --bg-panel-hover: #1a1a25;
  --neon-cyan: #00fff2;
  --neon-magenta: #ff00ff;
  --neon-green: #00ff41;
  --neon-orange: #ff6b35;
  --text-primary: #e0e0e0;
  --text-muted: #888;
  --border-color: #2a2a3a;
}
```

---

## Implementation Tasks

1. **Verify mobile responsiveness** - Ensure sidebar collapses/hides on mobile
2. **Add hamburger menu** for mobile nav
3. **Test wiki ↔ archive navigation** - All links must work
4. **Add hover glow effects** to all clickable elements
5. **Verify loading spinner** displays correctly
6. **Test filter buttons** in archive

---

## Files to Check/Modify

1. `css/shared.css` - Ensure all responsive styles exist
2. `wiki/index.html` - Verify header/footer
3. `index.html` - Verify header/footer  
4. `wiki/css/wiki.css` - Ensure it imports shared.css
5. `wiki/js/wiki.js` - Verify it loads correctly

---

## DO NOT MODIFY

- Research data files
- Agent code
- Build scripts
- GitHub workflow files

