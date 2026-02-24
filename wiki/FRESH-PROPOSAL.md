# FRESH PROPOSAL: Wiki & Research Archive Cyberpunk UI Improvement

**Date:** 2026-02-24  
**Status:** READY FOR IMPLEMENTATION  
**Priority:** HIGH

---

## Current State Analysis

### Wiki (wiki/)
- **Location:** `/root/.openclaw/workspace-research-agent/wiki/index.html`
- **CSS:** `wiki/css/wiki.css` (32KB), `wiki/css/cyberpunk.css` (10KB)
- **JS:** `wiki/js/wiki.js`
- **Features:** Cyberpunk theme with neon colors, sidebar stats, tags, loading state
- **Nav:** Archive link (◀ ARCHIVE), Wiki (🏠), GitHub

### Archive (root/)
- **Location:** `/root/.openclaw/workspace-research-agent/index.html`
- **CSS:** Uses `wiki/css/wiki.css` (shared)
- **Features:** Navigation (Research, Wiki, GitHub), loading states, filters
- **Nav:** Research (📚), Wiki (🔍), GitHub

---

## Requirements Summary

1. ✅ Cyberpunk aesthetic (neon accents, glow effects, dark bg) - reference Solaris portal colors
2. ✅ UI consistency across BOTH wiki AND archive
3. ✅ Cohesive buttons and UI elements
4. ✅ Responsive, animated, satisfying interactions
5. ✅ Working links between wiki ↔ archive
6. ✅ Research jobs must not be interrupted

---

## Proposed Improvements

### 1. Unified Navigation Bar

**Current:** Both have separate nav bars with different styling

**Proposed:**
- Create shared `cyber-header` component
- Consistent nav items: [Research] [Wiki] [GitHub]
- Active state indicator with cyan glow underline
- Hover: magenta pulse animation
- Logo with glitch effect on hover

```html
<!-- Unified Header -->
<header class="cyber-header">
  <a href="./index.html" class="cyber-logo">AI_AGENT_RESEARCH</a>
  <nav class="cyber-nav">
    <a href="./index.html" class="nav-tab active">Research</a>
    <a href="wiki/" class="nav-tab">Wiki</a>
    <a href="https://github.com/0volume/research-archive" class="nav-tab">GitHub ⊞</a>
  </nav>
</header>
```

### 2. Consistent Sidebar

**Current:** Wiki has stats + tags; Archive has stats + quick-links + navigation

**Proposed:**
- Unified sidebar structure for both
- Stats grid: 2x2 with neon borders
- Tags section with clickable filter tags
- Collapsible on mobile (hamburger menu)
- Consistent "Recent Updates" section

### 3. Unified Button Styles

**Current:** Inconsistent button implementations

**Proposed - Button Variants:**
```css
/* Primary - Cyan glow */
.btn-cyber {
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  background: transparent;
  transition: all 0.3s ease;
}
.btn-cyber:hover {
  background: rgba(0, 255, 245, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 245, 0.4);
}

/* Secondary - Magenta accent */
.btn-magenta {
  border: 2px solid var(--neon-magenta);
  color: var(--neon-magenta);
}
.btn-magenta:hover {
  background: rgba(255, 0, 255, 0.15);
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
}

/* Ghost - Minimal */
.btn-ghost {
  border: 1px solid var(--text-dim);
  color: var(--text-muted);
}
```

### 4. Card Components

**Current:** Different card styles (entry, pitch, thought)

**Proposed - Unified Card:**
```css
.cyber-card {
  background: var(--bg-secondary);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyber-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-color, var(--neon-cyan));
}
```

### 5. Loading States

**Current:** Basic spinner

**Proposed:**
- Cyberpunk spinner with dual-ring animation
- "DECRYPTING_DATA..." / "INITIALIZING..." text
- Scanline effect during load
- Skeleton placeholders for content

### 6. Animations & Interactions

**Proposed CSS:**
```css
/* Page load stagger */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.entry, .card { animation: fadeSlideIn 0.4s ease forwards; }
.entry:nth-child(1) { animation-delay: 0.05s; }
.entry:nth-child(2) { animation-delay: 0.1s; }
/* ... */

/* Hover glow pulse */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 5px var(--neon-cyan); }
  50% { box-shadow: 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan); }
}

/* Glitch text effect */
@keyframes glitchText {
  0%, 100% { text-shadow: 2px 0 var(--neon-magenta), -2px 0 var(--neon-cyan); }
  25% { text-shadow: -2px 0 var(--neon-magenta), 2px 0 var(--neon-cyan); }
  50% { text-shadow: 2px 2px var(--neon-magenta), -2px -2px var(--neon-cyan); }
}
```

### 7. Responsive Design

**Breakpoints:**
- Desktop: > 1024px (sidebar visible)
- Tablet: 768px - 1024px (collapsible sidebar)
- Mobile: < 768px (hamburger menu, stacked layout)

### 8. Footer

**Current:** Different footer implementations

**Proposed - Unified Footer:**
```html
<footer class="cyber-footer">
  <div class="footer-content">
    <span class="footer-brand">© 2024 AI_AGENT_RESEARCH</span>
    <nav class="footer-nav">
      <a href="./index.html">Research</a>
      <a href="wiki/">Wiki</a>
      <a href="https://github.com/0volume/research-archive">GitHub</a>
    </nav>
    <span class="footer-status">● SYSTEM ONLINE</span>
  </div>
</footer>
```

---

## Solaris Portal Color Reference

Reference colors from Solaris for consistency:
- Primary: `#00fff5` (Cyan)
- Secondary: `#ff00ff` (Magenta)  
- Accent: `#ff6b35` (Orange)
- Success: `#00ff88` (Green)
- Danger: `#ff3366` (Red)
- Background: `#0a0a0f` (Near black)
- Surface: `#12121a` (Dark gray)

---

## File Changes Required

### New Files
1. `css/shared.css` - Common components (header, footer, buttons, animations)

### Modified Files
1. `wiki/index.html` - Add shared header/footer, use shared.css
2. `index.html` (archive) - Add shared header/footer, use shared.css
3. `wiki/css/wiki.css` - Keep page-specific, import shared.css
4. `wiki/css/cyberpunk.css` - Keep design tokens,可能被 shared.css 替代

### Not Modified (Preserve)
- `wiki/js/wiki.js` - Logic unchanged
- Research data files - No changes
- All .md files - No changes

---

## Implementation Checklist

- [ ] Create `css/shared.css` with unified components
- [ ] Update `wiki/index.html` with new header/footer
- [ ] Update `index.html` (archive) with new header/footer
- [ ] Add responsive breakpoints
- [ ] Add animations (stagger, hover effects)
- [ ] Test wiki ↔ archive navigation links
- [ ] Verify all existing functionality works
- [ ] Test on mobile viewport

---

## Risk Mitigation

⚠️ **Research jobs must not be interrupted:**
- Only modify HTML/CSS files
- Do NOT change JS logic
- Do NOT modify data loading
- Do NOT touch research agent code

---

## Approval Status

**READY FOR IMPLEMENTATION** - Proceed to code-agent for implementation.
