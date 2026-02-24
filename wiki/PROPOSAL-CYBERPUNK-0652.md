# FRESH PROPOSAL: Wiki & Archive Cyberpunk UI - v2 (Feb 24, 2026)

**Time:** 6:52 AM UTC  
**Status:** READY FOR IMPLEMENTATION

---

## Current Analysis

### Wiki (https://0volume.github.io/research-archive/wiki/)
- Already has cyberpunk styling with neon cyan/magenta
- Has header with logo + nav + GitHub link
- Sidebar with stats, tags, recent updates
- Main content loads dynamically via JS
- Loading spinner with "LOADING_DATA..." text

### Archive (https://0volume.github.io/research-archive/)
- Has header with 🧠 logo + nav links (Research, Wiki, GitHub)
- Shows "LOADING_DATA..." then stats
- Basic card layout for entries
- Need to check actual rendering

---

## Key Issues to Fix

1. **UI Consistency** - Both should use EXACTLY same header/footer/nav styles
2. **Working Links** - Wiki ↔ Archive navigation must work
3. **Responsive** - Mobile-friendly with proper breakpoints
4. **Satisfying Interactions** - Glow effects, hover animations, click feedback
5. **Loading States** - Consistent cyberpunk loading animations
6. **Color Reference** - Use Solaris portal colors:
   - `--accent-cyan: #00fff2`
   - `--accent-magenta: #ff00ff`
   - `--accent-green: #00ff41`
   - `--bg-dark: #0a0a0f`
   - `--bg-panel: #12121a`

---

## Implementation Plan

### 1. Create Shared CSS (`css/shared.css`)
Unified styles for:
- Header with glitch effect logo
- Nav tabs with cyan/magenta hover states
- Footer with system status
- Buttons (primary, secondary, ghost)
- Cards with corner accents
- Loading spinner (dual-ring cyber style)
- Animations (stagger, glow pulse, glitch)

### 2. Update Wiki Header
```html
<header class="cyber-header">
  <a href="../index.html" class="cyber-logo" data-text="AI_AGENT_RESEARCH">
    <span class="logo-icon">🧠</span> AI_AGENT_RESEARCH
  </a>
  <nav class="cyber-nav">
    <a href="../index.html">📚 Research</a>
    <a href="./index.html" class="active">🔍 Wiki</a>
    <a href="https://github.com/0volume/research-archive" target="_blank">GitHub ⊞</a>
  </nav>
</header>
```

### 3. Update Archive Header
Match wiki header exactly with different active state

### 4. Unified Footer
```html
<footer class="cyber-footer">
  <div class="cyber-footer-content">
    <span class="cyber-footer-brand">AI_AGENT_RESEARCH</span>
    <nav class="cyber-footer-nav">
      <a href="../index.html">📚 Research</a>
      <a href="wiki/">🔍 Wiki</a>
      <a href="https://github.com/0volume/research-archive" target="_blank">GitHub ⊞</a>
    </nav>
    <span class="cyber-footer-status">● SYSTEM ONLINE</span>
  </div>
</footer>
```

### 5. Button Styles
```css
.btn-cyber {
  border: 2px solid var(--accent-cyan);
  color: var(--accent-cyan);
  background: transparent;
  padding: 10px 20px;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-cyber:hover {
  background: rgba(0, 255, 242, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 242, 0.4);
}
```

### 6. Card Corner Accents (CSS)
```css
.card-cyber {
  position: relative;
  background: var(--bg-panel);
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  transition: all 0.3s ease;
}
.card-cyber::before,
.card-cyber::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--accent-cyan);
  opacity: 0.4;
  transition: all 0.3s ease;
}
.card-cyber::before {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}
.card-cyber::after {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}
.card-cyber:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 242, 0.3);
}
.card-cyber:hover::before,
.card-cyber:hover::after {
  opacity: 1;
  border-color: var(--accent-magenta);
}
```

---

## Files to Modify

1. **Create:** `css/shared.css` - Shared components
2. **Modify:** `wiki/index.html` - Use shared.css, update header/footer
3. **Modify:** `index.html` (root) - Use shared.css, update header/footer
4. **Modify:** `wiki/css/wiki.css` - Import shared.css, remove duplicates
5. **Check:** `wiki/js/wiki.js` - Ensure it still works

---

## DO NOT MODIFY

- Research data files
- Agent code
- Build scripts
- GitHub workflow files

---

## Implementation Steps

1. Create `css/shared.css` with all unified styles
2. Update `wiki/index.html` to import shared.css and use new header/footer
3. Update root `index.html` to import shared.css and use new header/footer
4. Update `wiki/css/wiki.css` to import shared.css
5. Test wiki ↔ archive navigation
6. Push to GitHub and verify live
